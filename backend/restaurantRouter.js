const express = require('express');

const restaurantRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');


restaurantRouter.use(bodyParser.json());


//code here

restaurantRouter.post('/search', async (req, res) => {
    const { division, priceRange, searchTerm } = req.body;
    
    var result;
    try {
      console.log("*********************Request received");
      if(searchTerm && division && priceRange)
        result = await pool.query('SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE LOWER(H.name) ILIKE $1 INTERSECT (SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE H.price_point = $2) INTERSECT (SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE DIV.name = $3);',[`%${searchTerm}%`,`${priceRange}`,`${division}`]
      );
      else if(searchTerm && division)
      result = await pool.query('SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE LOWER(H.name) ILIKE $1  INTERSECT (SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE DIV.name = $2);',[`%${searchTerm}%`,`${division}`]
      );
      else if(searchTerm && priceRange)
      result = await pool.query('SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE LOWER(H.name) ILIKE $1 INTERSECT (SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE H.price_point = $2) ;',[`%${searchTerm}%`,`${priceRange}`]
      );
      else if(priceRange && division)
      result = await pool.query('(SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE H.price_point = $1) INTERSECT (SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE DIV.name = $2);',[`${priceRange}`,`${division}`]
      );
      else if(searchTerm )
      result = await pool.query('SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE LOWER(H.name) ILIKE $1 ;',[`%${searchTerm}%`]
      );
      else if( division)
      result = await pool.query('(SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE DIV.name = $1);',[`${division}`]
      );
      else if( priceRange)
      result = await pool.query(' (SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id WHERE H.price_point = $1) ;',[`${priceRange}`]
      );
      else
      result = await pool.query('SELECT H.*, D.name AS DISTRICT, DIV.name AS DIVISION FROM RESTAURANT H JOIN unions U ON H.union_id = U.union_id JOIN upazillas UPZ ON U.upazilla_id = UPZ.upazilla_id JOIN districts D ON UPZ.district_id = D.district_id JOIN divisions DIV ON D.division_id = DIV.division_id ;'
      );
  
      //console.log(result.rows[0]);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });






module.exports = restaurantRouter;