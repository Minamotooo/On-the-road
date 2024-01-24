const express = require('express');

const touristSpotRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');


touristSpotRouter.use(bodyParser.json());


//code here






module.exports = touristSpotRouter;