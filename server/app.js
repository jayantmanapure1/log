const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Require your conn.js file for MongoDB connection logic
require('./db/conn');
app.use(express.json());
const User = require('./model/userSchema');

app.use(require('./router/auth'));


// app.get('/about', (req, res) => {
//     res.send("Hello About world from the server");
// });

// app.get('/contact', (req, res) => {
//     
//     res.send("Hello contact world from the server");
//  });

// app.get('/signin', (req, res) => {
//     res.send("Hello signin world from the server");
// });

// app.get('/signout', (req, res) => {
//     res.send("Hello signout world from the server");
// });

// Start the Express server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
