// server.js
const express = require("express");

const signInRouter = express.Router();

const cors = require("cors");
const pool = require("./db/database");
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
//const app = express();

signInRouter.use(bodyParser.json());

// Use the cors middleware
signInRouter.use(cors());

// Endpoint to retrieve all users
signInRouter.get("/user/:username", async (req, res) => {
  try {
    const { username } = req.params;
    // Example assuming DATE_OF_BIRTH is the correct column name
    const { rows } = await pool.query(
      "SELECT USERNAME, FIRST_NAME, LAST_NAME, EMAIL, TO_CHAR(DATE_OF_BIRTH, 'DD Month,YYYY') AS DATE_OF_BIRTH, PHONE_NO, PROFILE_PHOTO, DIVISION, DISTRICT, ZIP_CODE, HOUSE_NO, ROAD_NO, ROAD_NAME FROM CLIENT_USER WHERE USERNAME = $1",
      [username]
    );

    //console.log(rows[0]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to add a new user
// server.js

signInRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM CLIENT_USER WHERE USERNAME = $1",
      [username]
    );

    if (result.rowCount === 1) {
      const user = result.rows[0];

      // Compare the entered password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Passwords match, user is authenticated
        // req.session.user = {username: username,role: 'client'};
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: { id: user.id, username: user.username, role: "client" },
        });
      } else {
        // Passwords do not match
        res.status(401).json({
          success: false,
          error: "Unauthorized: Incorrect username or password",
        });
      }
    } else {
      // No user found with the provided username
      res
        .status(401)
        .json({ success: false, error: "Unauthorized: User not found" });
    }
  } catch (error) {
    console.error("Error signing in:", error);
  }
});

signInRouter.post("/client", async (req, res) => {
  console.log(req.body);
  const {
    username,
    firstName,
    lastName,
    password,
    email,
    dateOfBirth,
    phoneNumber,
    profilePhoto,
    division,
    district,
    zipCode,
    houseNumber,
    roadNumber,
    roadName,
  } = req.body;

  try {
    // Check if username already exists
    const usernameCheck = await pool.query(
      "SELECT * FROM CLIENT_USER WHERE USERNAME = $1",
      [username]
    );
    console.log(usernameCheck);
    if (usernameCheck.rowCount > 0) {
      res
        .status(400)
        .json({ success: false, error: "Username already exists" });
      return;
    }

    // Perform the actual registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO CLIENT_USER (USERNAME, FIRST_NAME, LAST_NAME, PASSWORD, EMAIL, DATE_OF_BIRTH, PHONE_NO, PROFILE_PHOTO, DIVISION, DISTRICT, ZIP_CODE, HOUSE_NO, ROAD_NO, ROAD_NAME) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        username,
        firstName,
        lastName,
        hashedPassword,
        email,
        dateOfBirth,
        phoneNumber,
        profilePhoto,
        division,
        district,
        zipCode,
        houseNumber,
        roadNumber,
        roadName,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});
signInRouter.put("/update/:username", async (req, res) => {
  const { username } = req.params;
  console.log("...............bcrypt...bcrypt......bcrypt........");
  console.log(req.body);

  // Destructure the fields from the request body
  const {
    email,
    first_name,
    last_name,
    date_of_birth,
    phone_no,
    profile_photo,
    division,
    district,
    zip_code,
    house_no,
    road_no,
    road_name,
  } = req.body;

  try {
    // Assuming you have a function or query to update user information in the database
    const result = await pool.query(
      "UPDATE CLIENT_USER SET EMAIL = $1, FIRST_NAME = $2, LAST_NAME = $3, DATE_OF_BIRTH = $4, PHONE_NO = $5, PROFILE_PHOTO = $6, DIVISION = $7, DISTRICT = $8, ZIP_CODE = $9, HOUSE_NO = $10, ROAD_NO = $11, ROAD_NAME = $12 WHERE USERNAME = $13",
      [
        email,
        first_name,
        last_name,
        date_of_birth,
        phone_no,
        profile_photo,
        division,
        district,
        zip_code,
        house_no,
        road_no,
        road_name,
        username,
      ]
    );

    if (result.rowCount === 1) {
      res
        .status(200)
        .json({ message: "User information updated successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user information:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// ...

signInRouter.delete("/user/:username", async (req, res) => {
  const { username } = req.params;

  console.log("Deleting user:", username);
  console.log("...........................................................");
  try {
    // Assuming you have a users table in your database
    // and you want to delete the user based on their username
    const result = await pool.query(
      "DELETE FROM CLIENT_USER WHERE USERNAME = $1",
      [username]
    );

    if (result.rowCount === 1) {
      // User deleted successfully
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      // User not found
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

signInRouter.post("/signup", async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;

  console.log(firstname);

  if (!username || !email || !password || !firstname || !lastname) {
    return res.status(400).json({
      error: "Bad Request: Missing or invalid fields in the request body",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 13);
  try {
    // Insert user into the database
    const result = await pool.query(
      "INSERT INTO CLIENT_USER (USERNAME, EMAIL, PASSWORD,FIRST_NAME, LAST_NAME) VALUES ($1, $2, $3, $4, $5 ) RETURNING *",
      [username, email, hashedPassword, firstname, lastname]
    );

    // Assuming the user is successfully added, send a success response
    res
      .status(201)
      .json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

///Restaurant Signup

signInRouter.post("/restaurant", async (req, res) => {
  const {
    email,
    username,
    password,
    businessType,
    division,
    district,
    upazila,
    union,
    name,
    cuisine,
    phoneNo,
    imageURL,
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
    console.log(union_id);
    const result2 = await pool.query(
      "INSERT INTO restaurant (USERNAME, PASSWORD, EMAIL, UNION_ID, PHONE_NO, NAME, CUISINE, IMAGE) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        username,
        hashedPassword,
        email,
        union_id,
        phoneNo,
        name,
        cuisine,
        imageURL,
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

signInRouter.post("/hotellogin", async (req, res) => {
  const { username, password, businessType } = req.body;

  console.log(
    "...................................................................."
  );
  console.log(req.body);

  let tableName;
  switch (businessType.toLowerCase()) {
    case "hotel":
      tableName = "HOTEL"; // Ensure the table name is correct
    case "restaurant":
      tableName = "RESTAURANT";
      break;

    default:
      // Handle invalid businessType
      return res
        .status(400)
        .json({ success: false, error: "Invalid business type" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM ${tableName} WHERE USERNAME = $1;`,
      [username]
    );
    console.log(
      "...................................................................."
    );
    console.log(result);

    if (result.rowCount === 1) {
      const retrievedData = result.rows[0];

      // Compare the entered password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(
        password,
        retrievedData.password
      );
      console.log(password);
      console.log(retrievedData.password); // Corrected from console.log(user.password) to console.log(retrievedData.password)

      if (passwordMatch) {
        // Passwords match, user is authenticated
        // req.session.user = { username: retrievedData.username, role: businessType.toLowerCase() };
        res
          .status(200)
          .json({
            success: true,
            message: "Login successful",
            retrievedData,
            user: {
              username: retrievedData.username,
              role: businessType.toLowerCase(),
            },
          });
      } else {
        // Passwords do not match
        res.status(401).json({ success: false, error: "Incorrect password" });
      }
    } else {
      // No user found with the provided username
      res.status(402).json({ success: false, error: "Invalid username" });
    }
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ...

// Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = signInRouter;
