const express = require('express');

const hotelSignUpRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');


hotelSignUpRouter.use(bodyParser.json());

hotelSignUpRouter.post('/divisions', async (req, res) => {
    const { message } = req.body;
  
    try {
      
       console.log("Request received");
            const result = await pool.query('SELECT name FROM divisions;');
            res.json({success : true, data:result.rows}); 
            console.log(result.rows);
        
       
  
    
    } catch (error) {
      console.error('Error loading hotel signup', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  


    





module.exports = hotelSignUpRouter;