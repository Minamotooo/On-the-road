const express = require('express');

const restaurantRouter = express.Router();

const cors = require('cors');
const pool = require('./db/database');

const bodyParser = require('body-parser');


restaurantRouter.use(bodyParser.json());


//code here






module.exports = restaurantRouter;