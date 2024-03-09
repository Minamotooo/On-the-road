const express = require('express');

const hotelRouter = express.Router();
const bcrypt = require('bcrypt');
const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');

// Increase payload size limit to 10MB
hotelRouter.use(bodyParser.json({ limit: '10mb' }));


hotelRouter.use(bodyParser.json());

//////////////////CASCADING DELETE////////////////////////
// DELETE route for deleting a hotel by username
hotelRouter.delete('/delete/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Check if the hotel exists
    const checkHotel = await pool.query(
      'SELECT * FROM hotel WHERE username = $1',
      [username]
    );

    if (checkHotel.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Hotel not found' });
    }

    // Perform the delete operation
    await pool.query('DELETE FROM hotel WHERE username = $1', [username]);

    res.status(200).json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//CLICK ON HOTELS FROM NAVBAR AND REACH HERE
hotelRouter.post('/hotellandingpage', async (req, res) => {

 try {
    const result = await pool.query('SELECT H.*,D.name AS DISTRICT, DIV.name as DIVISION, H.description, MIN(HR.price_per_night) AS STARTING_PRICE  FROM HOTEL H JOIN hotel_rooms HR ON H.hotel_id = HR.hotel_id  JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = Div.division_id GROUP BY H.hotel_id, D.name, DIV.name ORDER BY STARTING_PRICE; ');
   

    console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading hotels:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

hotelRouter.post('/search', async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const result = await pool.query('SELECT H.hotel_id,H.name, H.address,H.photo, D.name AS DISTRICT, DIV.name AS DIVISION, H.description FROM HOTEL H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE LOWER(H.name) ILIKE $1 OR LOWER(D.name) ILIKE $1 OR LOWER(DIV.name) ILIKE $1;',[`%${searchTerm.toLowerCase()}%`]
    );

    console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading hotels:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//FOR INSERTING A NEW ROOM FOR A HOTEL
hotelRouter.post("/insertNewRoom", async (req, res) => {
  const { roomType, hotelID,availableRooms,amenities,pricePerNight,numberOfGuests,roomImageURL } = req.body;
  console.log("RECEIVED ROOM INFO: ", roomType, hotelID,availableRooms,amenities,pricePerNight,numberOfGuests,roomImageURL);
  try {
    // Insert user into the database
    const result = await pool.query(
      "INSERT INTO HOTEL_ROOMS (HOTEL_ID,ROOM_TYPE,AVAILABLE_ROOMS_LEFT,PRICE_PER_NIGHT,CAPACITY, AMENITIES,IMAGE) VALUES ($1, $2, $3, $4, $5,$6 ,$7) RETURNING *",
      [hotelID, roomType, availableRooms, pricePerNight, numberOfGuests, amenities, roomImageURL]
    );

    res
      .status(201)
      .json({ message: "Room Added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});





// FOR EDITING HOTEL ROOM INFO
hotelRouter.put('/editRoom/:hotelId', async (req, res) => {
  const { hotelId } = req.params;
  const { hotelID,roomType,availableRooms, amenities, pricePerNight, numberOfGuests,roomImageURL } = req.body;

  try {
    // Update the hotel profile
    const updateQuery = `
      UPDATE HOTEL_ROOMS
      SET AVAILABLE_ROOMS_LEFT = $1, PRICE_PER_NIGHT = $2,CAPACITY = $3, AMENITIES = $4, IMAGE = $5
      WHERE hotel_id = $6 AND ROOM_TYPE = $7
    `;
    await pool.query(updateQuery, [availableRooms, pricePerNight, numberOfGuests, amenities, roomImageURL, hotelID,roomType]);

    res.status(200).json({ success: true, message: 'Hotel room info updated successfully' });
  } catch (error) {
    console.error('Error updating hotel room info:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// FOR SENDING BACK HOTELID FROM HOTEL USERNAME
hotelRouter.post('/fetchHotelId/:username', async (req, res) => {
  const { username } = req.body;
  console.log("RECEIVED USERNAME: ", username);
  try {
    const result = await pool.query(
      `SELECT H.hotel_id FROM hotel H JOIN business_entity BE ON H.username = BE.username WHERE BE.business_type = 'Hotel' AND H.username = $1; `,
      [username]
    );

    console.log("FOUND THE HOTEL ID");
    console.log(result.rows[0].hotel_id);

    res.json({ hotelId: result.rows[0].hotel_id }); // Return the hotelId in the response
    console.log("SENT THE HOTEL ID");
  } catch (error) {
    console.error('Error loading hotel rooms:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

hotelRouter.put('/update/:hotelId', async (req, res) => {
  const { hotelId } = req.params;
  const { email, name, phone_no, photo, description } = req.body;

  try {
    // Update the hotel profile
    const updateQuery = `
      UPDATE HOTEL
      SET email = $1, name = $2, phone_no = $3, photo = $4, description = $5
      WHERE hotel_id = $6
    `;
    await pool.query(updateQuery, [email, name, phone_no, photo, description, hotelId]);

    res.status(200).json({ success: true, message: 'Hotel profile updated successfully' });
  } catch (error) {
    console.error('Error updating hotel profile:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});







//SELECT A PARTICULAR HOTEL AND REACH HERE
//FOR DISPLAYING THE HOTEL DETAILS ALONG WITH LOCATION
hotelRouter.post('/details/:hotelId', async (req, res) => {
  const { hotelId } = req.params;

  try {
    const result = await pool.query('SELECT H.*,U.name AS UNION_NAME,UPZ.name AS UPAZILLA_NAME,D.name AS DISTRICT_NAME,DIV.name AS DIVISION_NAME FROM HOTEL H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = Div.division_id WHERE H.hotel_id = $1; ',[hotelId]);
   

    console.log(result);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error loading hotel rooms:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//FOR DISPLAYING THE REVIEW OF A HOTEL
hotelRouter.get('/review/:hotelId', async (req, res) => {
  const { hotelId } = req.params;

  try {
    const result = await pool.query('SELECT * FROM reviews R JOIN hotel H ON R.business_username=H.username WHERE hotel_id = $1;',[hotelId]);
   

   // console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading hotel reviews:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



//FOR DISPLAYING THE HOTEL ROOMS FOR A HOTEL
hotelRouter.post('/fetchCurrentHotel/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    //console.log("HELLLLLLLLLLLLLL");
  
    try {
      const result = await pool.query('SELECT * FROM hotel_rooms WHERE HOTEL_ID = $1;',[hotelId]);
     
  
      //console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading hotel rooms:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
//FOR EDITING ROOM INFO
  hotelRouter.post('/fetchCurrentRoomInfo/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { roomType } = req.body;
    console.log("**************");
    console.log(hotelId, roomType);
  
    try {
      const result = await pool.query('SELECT * FROM hotel_rooms WHERE HOTEL_ID = $1 AND ROOM_TYPE = $2;',[hotelId,roomType]);
     
  
      //console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading hotel rooms:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });



//FOR RESERVING A ROOM IN A HOTEL
hotelRouter.post('/Roombooking/:hotelId', async (req, res) => {
  const { hotelId} = req.params;
  const {
      username,
      roomType,
      pricePerNight,
      noOfRooms,
      checkInDate,
      checkOutDate
  } = req.body;
 
  // Convert date strings to JavaScript Date objects
  const checkInDateObj = new Date(checkInDate);
  const checkOutDateObj = new Date(checkOutDate);

  // Calculate the total number of nights
  const numberOfNights = Math.ceil((checkOutDateObj - checkInDateObj) / (1000 * 60 * 60 * 24));

  // Calculate the total bill
  const totalBill = pricePerNight * noOfRooms * numberOfNights;
  const status = "PENDING";

  try {
      const result = await pool.query('INSERT INTO hotel_room_booking(client_username, hotel_id, room_type,no_of_rooms, check_in_date, check_out_date, total_bill, payment_completion_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8);', [username, hotelId, roomType, noOfRooms, checkInDateObj, checkOutDateObj, totalBill, status]);

     // console.log(result);

      res.json(result.rows);
  } catch (error) {
      console.error('Error loading hotel rooms:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//ADDING BACK HOTEL ROOMS AFTER CHECKOUTDATE
hotelRouter.post("/triggerProcedure", async (req, res) => {
  try {
    
    
    // Execute the PostgreSQL stored procedure
    const result = await pool.query(
      "CALL check_and_update_payment_completion_status()"
    );

    // Return success response
    res.status(200).json({ message: "Stored procedure triggered successfully" });
  } catch (error) {
    console.error("Error triggering stored procedure", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//RETRIEVE BOOKING REQUESTS FOR A HOTEL
hotelRouter.post('/fetchBookingRequests/:username', async (req, res) => {
  const { username } = req.params;
  //console.log("RECEIVED BOOK REQUEST: ", username);
  try {
    const result = await pool.query(`SELECT * FROM hotel_room_booking HRB JOIN hotel H ON H.hotel_id = HRB.hotel_id WHERE H.username = $1 AND payment_completion_status = 'PENDING';`,[username]);
  // console.log("BOOKING REQUEST :");

    //console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading booking requests:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//HANDLE BOOKING REQUESTS APPROVAL OR DENIAL
hotelRouter.post('/BookingAction/:booking_id', async (req, res) => {
  const { booking_id } = req.params;
  const { action } = req.body;
 // console.log("RECEIVED BOOK REQUEST: ",action, "for the ID: " ,booking_id);
  try {
    var result;
    if(action === "approve"){
       result = await pool.query(`
      UPDATE hotel_room_booking SET payment_completion_status = 'ONGOING' where booking_id = $1; `,[booking_id]);
    }
    else
      { result = await pool.query(`
      UPDATE hotel_room_booking SET payment_completion_status = 'DENIED' WHERE booking_id = $1;`,[booking_id]);
  }
  // console.log("BOOKING REQUEST HANDLED");

   // console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading booking requests:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//FOR DISPLAYING THE PENDING REQUESTS FOR A USER
hotelRouter.post('/fetchPendingRequests/:username', async (req, res) => {
  const { username } = req.params;
 // console.log("RECEIVED BOOK REQUEST: ", username);
  try {
    const result = await pool.query(`SELECT * FROM hotel_room_booking HRB JOIN hotel H ON H.hotel_id = HRB.hotel_id WHERE HRB.client_username = $1 AND payment_completion_status = 'PENDING';`,[username]);
   //console.log("BOOKING REQUEST :");

   // console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading booking requests:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//FOR DISPLAYING THE APPROVED REQUESTS FOR A USER
hotelRouter.post('/fetchApprovedRequests/:username', async (req, res) => {
  const { username } = req.params;
 // console.log("RECEIVED BOOK REQUEST: ", username);
  try {
    const result = await pool.query(`SELECT * FROM hotel_room_booking HRB JOIN hotel H ON H.hotel_id = HRB.hotel_id WHERE HRB.client_username = $1 AND (payment_completion_status = 'ONGOING' OR payment_completion_status = 'COMPLETED');`,[username]);
   //console.log("BOOKING REQUEST :");

    //console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading booking requests:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


  //FOR INSERTING A REVIEW FOR A HOTEL
  hotelRouter.post('/review/postReview', async (req, res) => {
    
    const { rating, comment, imageURL, hotel_username,client_username } = req.body;
  console.log("RECEIVED REVIEW INFO: ", rating, comment, imageURL, hotel_username,client_username);
    try {
      const result = await pool.query('INSERT INTO reviews(rating, comment, image, business_username, client_username) VALUES($1,$2,$3,$4,$5);', [rating, comment, imageURL, hotel_username,client_username]);
  
      //console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error posting review:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


  hotelRouter.post("/gettopreviewedtouristspots", async (req, res) => {
  
    const {username} = req.body;
    console.log("BACKEND******",username);
  
    try {
      // Call the stored procedure to update average ratings
      const result1 = await pool.query(
        `CALL update_average_ratings($1);`, [username]
      );
  
      // Select the top 5 tourist spots ordered by Average_Rating
      const result = await pool.query(
        
        `SELECT TS.spot_id,TS.name, TS.blog_description, TS.image, TS.average_rating, COUNT(TS.spot_id) reviewCount, (D.name || ', ' || DIV."name") location FROM tourist_spot TS  JOIN tourist_spot_blog_comment C ON TS.spot_id = C.spot_id JOIN unions U ON TS.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id GROUP BY TS.spot_id,TS.name, TS.blog_description, TS.image, TS.average_rating, D.name, DIV.name ORDER BY Average_Rating DESC LIMIT 5;`
      );
  
      // Send the result to the client
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching tourist spots data");
    }
  });


  hotelRouter.post("/gettopreviewedhotels", async (req, res) => {
  
    const {username} = req.body;
    console.log("BACKEND******",username);
  
    try {
      // Call the stored procedure to update average ratings
      const result1 = await pool.query(
        `CALL update_average_hotel_ratings($1);`, [username]
      );
  
      // Select the top 5 tourist spots ordered by Average_Rating
      const result = await pool.query(
        
        `SELECT H.hotel_id,H.name, H.description, H.photo, H.average_rating, COUNT(H.hotel_id) reviewCount, (D.name || ', ' || DIV."name") location 
        FROM Hotel H
        JOIN reviews R ON H.username = R.business_username
        JOIN unions U ON H.union_id = U.union_id
        JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id
        JOIN districts D ON UPZ.district_id = D.district_id
        JOIN divisions DIV ON D.division_id = DIV.division_id
        GROUP BY H.hotel_id,H.name, H.description, H.photo, H.average_rating, D.name, DIV.name
        ORDER BY Average_Rating DESC LIMIT 5;`
      );
  
      // Send the result to the client
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching tourist spots data");
    }
  });

 module.exports = hotelRouter;