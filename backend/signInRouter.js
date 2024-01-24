// server.js
const express = require('express');

const signInRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
//const app = express();

signInRouter.use(bodyParser.json());


// Use the cors middleware
signInRouter.use(cors());




// Endpoint to retrieve all users
signInRouter.get('/user/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const { rows } = await pool.query('SELECT * FROM CLIENT_USER WHERE USERNAME = $1', [username]);
      //console.log(rows[0]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error retrieving user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
// Endpoint to add a new user
// server.js

signInRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Bad Request: Missing email or password' });
    }
  
    try {
      const result = await pool.query('SELECT * FROM CLIENT_USER WHERE EMAIL = $1', [email]);
  
      if (result.rowCount === 1) {
        const user = result.rows[0];

        //console.log(user);
  
        //Compare the entered password with the hashed password stored in the database
        const passwordMatch =  await bcrypt.compare(password,user.password);
        console.log(password);
        console.log(user.password);
  
          if (passwordMatch) {
          // Passwords match, user is authenticated
          res.status(200).json({ success: true, message: 'Login successful', user });
        } else {
          // Passwords do not match
          res.status(401).json({ success: false, error: 'Unauthorized: Incorrect password' });
        }
      } else {
        // No user found with the provided email
        res.status(401).json({ success: false, error: 'Unauthorized: Email not found' });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  

  signInRouter.put('/update/:username', async (req, res) => {
    const { username } = req.params;
    const { phone_no } = req.body;
  
    try {
      // Assuming you have a function or query to update the phone number in the database
      const result = await pool.query('UPDATE CLIENT_USER SET PHONE_NO = $1 WHERE USERNAME = $2', [phone_no, username]);
  
      if (result.rowCount === 1) {
        res.status(200).json({ message: 'Phone number updated successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating phone number:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
// ...

signInRouter.delete('/user/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      // Assuming you have a users table in your database
      // and you want to delete the user based on their username
      const result = await pool.query('DELETE FROM CLIENT_USER WHERE USERNAME = $1', [username]);
  
      if (result.rowCount === 1) {
        // User deleted successfully
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        // User not found
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });



signInRouter.post('/signup', async (req, res) => {
    const { username, email, password, firstname, lastname} = req.body;

    console.log(firstname);
  
    if (!username || !email || !password || !firstname || !lastname) {
      return res.status(400).json({ error: 'Bad Request: Missing or invalid fields in the request body' });
    }
    const hashedPassword = await bcrypt.hash(password,13);
    try {
      // Insert user into the database
      const result = await pool.query('INSERT INTO CLIENT_USER (USERNAME, EMAIL, PASSWORD,FIRST_NAME, LAST_NAME) VALUES ($1, $2, $3, $4, $5 ) RETURNING *', [username, email, hashedPassword,firstname,lastname]);
  
      // Assuming the user is successfully added, send a success response
      res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  
  
  // ...
  

// Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = signInRouter;