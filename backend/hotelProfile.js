const express = require('express');

const hotelRouter = express.Router();
const bcrypt = require('bcrypt');
const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');

// Increase payload size limit to 10MB
hotelRouter.use(bodyParser.json({ limit: '10mb' }));


hotelRouter.use(bodyParser.json());

//CLICK ON HOTELS FROM NAVBAR AND REACH HERE
hotelRouter.post('/hotellandingpage', async (req, res) => {

 try {
    const result = await pool.query('SELECT H.hotel_id,H.NAME,H.ADDRESS,D.name AS DISTRICT, DIV.name as DIVISION, H.description, MIN(HR.price_per_night) AS STARTING_PRICE  FROM HOTEL H JOIN hotel_rooms HR ON H.hotel_id = HR.hotel_id  JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = Div.division_id GROUP BY H.hotel_id, D.name, DIV.name ORDER BY STARTING_PRICE; ');
   

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
    const result = await pool.query('SELECT H.hotel_id,H.name, H.address, D.name AS DISTRICT, DIV.name AS DIVISION, H.description FROM HOTEL H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE LOWER(H.name) ILIKE $1 OR LOWER(D.name) ILIKE $1 OR LOWER(DIV.name) ILIKE $1;',[`%${searchTerm}%`]
    );

    console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading hotels:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


//FOR SENDING BACK HOTELID FROM HOTEL USERNAME
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
   

    console.log(result);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading hotel reviews:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



//FOR DISPLAYING THE HOTEL ROOMS FOR A HOTEL
hotelRouter.post('/fetchCurrentHotel/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    console.log("HELLLLLLLLLLLLLL");
  
    try {
      const result = await pool.query('SELECT * FROM hotel_rooms WHERE HOTEL_ID = $1;',[hotelId]);
     
  
      console.log(result);
  
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

      console.log(result);

      res.json(result.rows);
  } catch (error) {
      console.error('Error loading hotel rooms:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



 module.exports = hotelRouter;