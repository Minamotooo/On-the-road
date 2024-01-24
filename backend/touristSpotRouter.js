const express = require('express');

const touristSpotRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');


touristSpotRouter.use(bodyParser.json());


touristSpotRouter.use(cors()); // Enable CORS for all routes



//SEARCH BAR RESULTS
touristSpotRouter.post('/home', async (req, res) => {
    const { searchTerm } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM tourist_spot TS LEFT JOIN location L ON TS.location_id = L.location_id WHERE TS.name ILIKE $1 OR L.thana ILIKE $1 OR L.upazilla ILIKE $1 OR L.district ILIKE $1 OR L.division ILIKE $1;',[`%${searchTerm}%`]
      );
  
      console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading tourist spot:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  


    



module.exports = touristSpotRouter;