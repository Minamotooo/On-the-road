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
  

  hotelSignUpRouter.post('/districts', async (req, res) => {
    const division = req.body.firstLevel;
  
    try {
      
       console.log("Request received");
            const result = await pool.query('SELECT name FROM districts WHERE division_id = ( SELECT division_id FROM divisions WHERE name = $1);',[division]);
            res.json({success : true, data:result.rows}); 
            console.log(result.rows);
        
      
    
    } catch (error) {
      console.error('Error loading hotel signup', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  hotelSignUpRouter.post('/upaziilas', async (req, res) => {
    const district = req.body.secondLevel;
  
    try {
      
       console.log("Request received");
            const result = await pool.query('SELECT name FROM upazillas WHERE district_id = ( SELECT district_id FROM districts WHERE name = $1);',[district]);
            res.json({success : true, data:result.rows}); 
            console.log(result.rows);
        
      
    
    } catch (error) {
      console.error('Error loading hotel signup', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });



  hotelSignUpRouter.post('/unions', async (req, res) => {
    const upaziila = req.body.thirdLevel;
  
    try {
      
       console.log("Request received");
            const result = await pool.query('SELECT name FROM unions WHERE upazilla_id = ( SELECT upazilla_id FROM upazillas WHERE name = $1);',[upazilla]);
            res.json({success : true, data:result.rows}); 
            console.log(result.rows);
        
      
    
    } catch (error) {
      console.error('Error loading hotel signup', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


    





module.exports = hotelSignUpRouter;