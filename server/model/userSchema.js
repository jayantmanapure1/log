const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  work: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }, 
  cpassword: {
    type: String,
    required: true
  }  ,
  tokens:[
   {
      token:{
         type:String,
         required:true
      }
   }
]
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.cpassword = await bcrypt.hash(this.cpassword, saltRounds);
  }
  next();
});

userSchema.methods.generateAuthToken = async function(){
   try {
      let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY,{expiresIn:"2h"});
      this.tokens = await this.tokens.concat({token:token});
      await this.save();
      return token;
   } catch (error) {
      console.log(error);
   }
}

const User = mongoose.model('USER', userSchema);

module.exports = User;
