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
    WHERE PAYMENT_COMPLETION_STATUS = 'APPROVED' OR PAYMENT_COMPLETION_STATUS = 'ONGOING'
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

module.exports = admin;
