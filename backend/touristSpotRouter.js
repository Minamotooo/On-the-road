

const express = require('express');

const touristSpotRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');


touristSpotRouter.use(bodyParser.json());

 // Enable CORS for all routes



//SEARCH BAR RESULTS
touristSpotRouter.post('/home', async (req, res) => {
    const { searchTerm } = req.body;
  
    try {
      const result = await pool.query('SELECT TS.*,U.name AS union_name,UPZ.name AS upazilla_name,D.name AS district_name,DIV.name AS division_name FROM tourist_spot TS LEFT JOIN unions U ON TS.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = Div.division_id WHERE TS.name ILIKE $1 OR D.name ILIKE $1 OR DIV.name ILIKE $1;',[`%${searchTerm}%`]
      );
  
      console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading tourist spot:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
  
  touristSpotRouter.post('/:division_id', async (req, res) => {
    const {division_id} = req.params;
  
    try {
      const result = await pool.query('SELECT TS.*,U.name AS union_name,UPZ.name AS upazilla_name,D.name AS district_name,DIV.name AS division_name FROM tourist_spot TS LEFT JOIN unions U ON TS.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = Div.division_id WHERE Div.division_id = $1;',[division_id]
      );
  
      console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading divisions:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });


  touristSpotRouter.post('/divisions/all', async (req, res) => {

  
    try {
      const result = await pool.query('SELECT name, url FROM divisions;');
  
      console.log(result);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading tourist spot:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });
    

  touristSpotRouter.post('/fetchDivisionWiseSpots/myDivision', async (req, res) => {
    const { divisionName } = req.body;
    console.log('****************', divisionName);
    try {
      console.log('Received request with divisionName:', divisionName);
  
      // Rest of your code...
  
      const result = await pool.query(
        `SELECT * FROM find_spots_under_division($1);`, //FUNCTION CALL
        [divisionName]
      );
  
      console.log('Result:', result.rows);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading division wise tourist spot DETAILS:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });





  touristSpotRouter.post('/Reviews/postComment', async (req, res) => {
    const { rating,comment,spot_id,username } = req.body;
    
   //console.log("Posting comment:",comment,spot_id,username);
    try {
      const result = await pool.query(
        `INSERT INTO tourist_spot_blog_comment (rating,comment_content,spot_id,client_username) VALUES ($1,$2,$3,$4) RETURNING *;`, [rating,comment,spot_id,username]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error posting tourist spot comment:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    
  });

module.exports = touristSpotRouter;


