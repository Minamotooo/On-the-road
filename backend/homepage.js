const express = require('express');
const signInRouter = require('./signInRouter');
const touristSpotRouter = require('./touristSpotRouter');
const pool = require('./db/database');
const app = express();
const cors = require('cors');
const hotelSignUpRouter = require('./hotelSignUpRouter');
const restaurantRouter = require('./restaurantRouter');
const touristSpotDetailsRouter = require('./touristSpotDetailsRouter');
const hotelProfile = require('./hotelProfile');
const port = 4000;
// Use the cors middleware
app.use(cors());
app.use('/signin',signInRouter);
app.use('/touristSpot',touristSpotRouter);
app.use('/restaurant',restaurantRouter);
app.use('/touristSpotInfo',touristSpotDetailsRouter);
app.use('/hotelSignUp',hotelSignUpRouter);
app.use('/hotel',hotelProfile);

// Mock database query function
const getTouristSpotsData = () => {
    // This is a mock function. In a real application, you would make a database query here.
    // The data structure returned should match what your frontend expects.
    return [
        {
            id: 1,
            title: "Lalbagh Fort",
            description: "Lalbagh Fort is a fort in the old city of Dhaka, Bangladesh. Its name is derived from its neighborhood Lalbagh, which means Red Garden. The term Lalbagh refers to reddish and pinkish architecture from the Mughal period. The original fort was called Fort Aurangabad.",
            price: 136,
            coverImg: "katie-zaferes.png",
            stats: {
                rating: 5.0,
                reviewCount: 6
            },
            location: "Lalbagh Rd, Dhaka 1211",
        },
        // ... more spots
    ];
};

app.get('/homepage', (req, res) => {
    try {
        const data = getTouristSpotsData();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching tourist spots data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
