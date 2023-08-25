const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const authenticate = require("../middleware/authenticate");


const User = require('../model/userSchema');
var app = express()
app.use(cookieParser())
require('../db/conn');

router.get('/', (req, res) => {
    res.send('Hello world from the server router');
});

router.post('/register', async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(400).json({ error: 'All Fields are Compulsory' });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: 'Email already exists' });
    }else if(password != cpassword){
      return res.status(422).json({ error: 'password are not match' });
    }else{
      const newUser = new User({ name, email, phone, work, password, cpassword });
    await newUser.save();

    res.status(201).json({ message: 'User Registered Successfully' });
    }

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: 'Please fill all the fields properly' });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        return res.json({ error: 'Invalid credentials' });
      }

      const token = await userLogin.generateAuthToken();

      res.cookie('access_token', token, {
        // Set token expiration properly
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true
      });
      res.json({ message: 'User Signin Successfully' });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/about',authenticate ,(req,res)=>{
  console.log("Hello my about");
  res.send(req.rootUser);
});
module.exports = router;