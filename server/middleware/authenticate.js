const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.access_token; // Make sure this matches the cookie name
    if (!token) {
      return res.status(403).send('Please log in first'); // Send a proper error message
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    // Verify token expiration
    if (Date.now() >= verifyToken.exp * 1000) {
      return res.status(401).send('Token expired'); // Send a proper error message
    }

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      'tokens.token': token
    });

    if (!rootUser) {
      throw new Error('User not found');
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized: No valid token provided'); // Send a proper error message
    console.error(error);
  }
};

module.exports = authenticate;
