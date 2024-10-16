const express = require("express");
const admin = express.Router();
const pool = require("./db/database");
const bodyParser = require("body-parser");

// Increase payload size limit to 10MB
admin.use(bodyParser.json({ limit: "10mb" }));

admin.post("/dashboard", async (req, res) => {
  console.log("Request received");
  try {
    const query = `SELECT TO_CHAR(booking_date, 'Month') date, SUM(total_bill) bill
    FROM hotel_room_booking
    WHERE PAYMENT_COMPLETION_STATUS = 'COMPLETED' OR PAYMENT_COMPLETION_STATUS = 'ONGOING'
    AND TO_CHAR(booking_date, 'YYYY') = TO_CHAR(CURRENT_DATE, 'YYYY')
    GROUP BY TO_CHAR(booking_date, 'Month')
    ORDER BY TO_DATE(TO_CHAR(booking_date, 'Month'),'Month') ASC;`;
    const result = await pool.query(query);
    console.log(result.rows);
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    console.error("Error loading admin dashboard", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

admin.post("/revenue", async (req, res) => {
  console.log("Request received");
  try {
    const result = await pool.query(
      `SELECT * FROM calculate_monthly_revenue();`
    );
    console.log(result.rows);
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

admin.post("/removeFromSusList/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Debug log
    console.log("Removing user from suspicious list:", username);

    // Update the user's sus status in the database
    await pool.query("CALL remove_user_from_sus_list($1)", [username]);

    // Debug log
    console.log("User removed successfully");

    res.json({ success: true });
  } catch (error) {
    console.error("Error removing user from suspicious list:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

admin.post("/showsususer", async (req, res) => {
  console.log("Request received");
  try {
    const result = await pool.query(
      `select profile_photo, username from client_user where sus = 'yes';`
    );
    console.log(result.rows);
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

admin.post("/logtable", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Log_Table");
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching log table data:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

admin.post("/addtouristspot", async (req, res) => {
  const { division, district, upazilla, union, name, blogDescription, image } =
    req.body;
  try {
    const temp = await pool.query(
      "SELECT UNION_ID FROM UNIONS UN JOIN UPAZILLAS UP ON (UN.UPAZILLA_ID = UP.UPAZILLA_ID) JOIN DISTRICTS D ON(UP.DISTRICT_ID = D.DISTRICT_ID) JOIN DIVISIONS DIV ON(D.DIVISION_ID = DIV.DIVISION_ID) WHERE DIV.NAME = $1 AND D.NAME = $2 AND UP.NAME = $3 AND UN.NAME= $4;",
      [division, district, upazilla, union]
    );
    const union_id = temp.rows[0].union_id;
    console.log(union_id);
    const result2 = await pool.query(
      "INSERT INTO tourist_spot (union_id,name,blog_description,image) VALUES ($1, $2, $3, $4) RETURNING *",
      [union_id, name, blogDescription, image]
    );
    //console.log(result2);
    // Assuming the user is successfully added, send a success response
    res.status(201).json({
      message: "Tourist Spot Added successfully",
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

admin.post("/deleteduser", async (req, res) => {
  console.log("Request received for deleted users");
  try {
    // Fetch deleted users from the 'deleted_client_user' table
    const result = await pool.query(
      "SELECT username, profile_photo FROM deleted_client_user"
    );

    console.log(result.rows);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching deleted users", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to restore a deleted user
admin.post("/restoreuser/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Restore the user by moving them from 'deleted_client_user' to 'client_user'
    await pool.query(
      "INSERT INTO client_user (username, first_name, last_name, password, email, date_of_birth, phone_no, profile_photo, division, district, zip_code, house_no, road_no, road_name, sus) " +
        "SELECT username, first_name, last_name, password, email, date_of_birth, phone_no, profile_photo, division, district, zip_code, house_no, road_no, road_name, 'no' " + // Assuming 'sus' is not in 'deleted_client_user'
        "FROM deleted_client_user WHERE username = $1",
      [username]
    );

    // Delete the user from 'deleted_client_user' after restoring
    await pool.query("DELETE FROM deleted_client_user WHERE username = $1", [
      username,
    ]);

    console.log("User restored successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = admin;
