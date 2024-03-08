const express = require("express");

const hotelSignUpRouter = express.Router();
const bcrypt = require("bcrypt");
const cors = require("cors");
const pool = require("./db/database");

const bodyParser = require("body-parser");

// Increase payload size limit to 10MB
hotelSignUpRouter.use(bodyParser.json({ limit: "10mb" }));

hotelSignUpRouter.use(bodyParser.json());

hotelSignUpRouter.post("/divisions", async (req, res) => {
  const { message } = req.body;

  try {
    console.log("Request received");
    const result = await pool.query(
      "SELECT name FROM divisions ORDER BY name;"
    );
    console.log("Here******");
    console.log(result.rows);
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    console.error("Error loading hotel signup", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

hotelSignUpRouter.post("/districts", async (req, res) => {
  const division = req.body.firstLevel;

  try {
    console.log("Request received");
    const result = await pool.query(
      "SELECT name FROM districts WHERE division_id = ( SELECT division_id FROM divisions WHERE name = $1) ORDER BY name;",
      [division]
    );
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    console.error("Error loading hotel signup", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

hotelSignUpRouter.post("/upazillas", async (req, res) => {
  const district = req.body.secondLevel;

  try {
    console.log("Request received");
    const result = await pool.query(
      "SELECT name FROM upazillas WHERE district_id = ( SELECT district_id FROM districts WHERE name = $1) ORDER BY name;",
      [district]
    );
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    console.error("Error loading hotel signup", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

hotelSignUpRouter.post("/unions", async (req, res) => {
  const upazilla = req.body.thirdLevel;

  try {
    console.log("Request received");
    const result = await pool.query(
      "SELECT name FROM unions WHERE upazilla_id = ( SELECT upazilla_id FROM upazillas WHERE name = $1) ORDER BY name;",
      [upazilla]
    );
    res.json({ success: true, data: result.rows });
    console.log(result.rows);
  } catch (error) {
    console.error("Error loading hotel signup", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

hotelSignUpRouter.post("/", async (req, res) => {
  const {
    email,
    username,
    password,
    businessType,
    division,
    district,
    upazila,
    union,
    hotelname,
    hoteladdress,
    hotelphonenumber,
    hoteldescription,
    image,
  } = req.body;

  console.log(username);

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        error: "Bad Request: Missing or invalid fields in the request body",
      });
  }
  const hashedPassword = await bcrypt.hash(password, 13);
  // console.log(hashedPassword);
  try {
    // Insert user into the database
    const result1 = await pool.query(
      "INSERT INTO BUSINESS_ENTITY (USERNAME, BUSINESS_TYPE) VALUES ($1, $2 ) RETURNING *",
      [username, businessType]
    );
    //console.log(result1);
    const temp = await pool.query(
      "SELECT UNION_ID FROM UNIONS UN JOIN UPAZILLAS UP ON (UN.UPAZILLA_ID = UP.UPAZILLA_ID) JOIN DISTRICTS D ON(UP.DISTRICT_ID = D.DISTRICT_ID) JOIN DIVISIONS DIV ON(D.DIVISION_ID = DIV.DIVISION_ID) WHERE DIV.NAME = $1 AND D.NAME = $2 AND UP.NAME = $3 AND UN.NAME= $4;",
      [division, district, upazila, union]
    );
    const union_id = temp.rows[0].union_id;
    //console.log(union_id);
    const result2 = await pool.query(
      "INSERT INTO HOTEL (USERNAME, PASSWORD, NAME, UNION_ID, ADDRESS, PHONE_NO, EMAIL, PHOTO,DESCRIPTION) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8, $9) RETURNING *",
      [
        username,
        hashedPassword,
        hotelname,
        union_id,
        hoteladdress,
        hotelphonenumber,
        email,
        image,
        hoteldescription,
      ]
    );
    //console.log(result2);
    // Assuming the user is successfully added, send a success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: result1.rows[0] });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = hotelSignUpRouter;
