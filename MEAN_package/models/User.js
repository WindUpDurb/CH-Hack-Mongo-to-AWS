'use strict';

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET= ', JWT_SECRET);

let jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

let userSchema = new mongoose.Schema({
  name            :   { first: String, last: String},
  username        :   { type: String,  unique: true},
  password        :   { type: String },
  image           :   { type: String },
  about           :   { type: String },
  posts           :   [{ date: Date, post: String}],
  github          :   String, // Github user _id#
  facebook        :   String, // Facebook user _id#
  twitter         :   String, // Twitter user _id#
});


userSchema.statics.register = ( userObj, cb ) => {
  this.create(userObj, cb);
};

userSchema.statics.login = ( userObj, cb ) =>{
  User.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || {error: 'Login failed. Username or Password Incorrect!'});
    if( dbUser.password != userObj.password ){
      return cb(err || {error: 'Login failed. Username or Password is Incorrect'});
    }
    let token = dbUser.createToken(userObj);
    dbUser.password = null;
    cb(null, {token:token, dbUser:dbUser});
  });
}

userSchema.methods.createToken = function(){
  let token = jwt.sign({ _id: this._id }, JWT_SECRET);
  console.log('token\n', token);
  return token;
}

userSchema.statics.loggedIn = (req, res, next) => {
  let token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({ error: 'You are not authorized!'});
    User
    .findById(payload._id)
    .select({ password: false })
    .exec((err, user) => {
      if(err || !user){
        return res
        .clearCookie('accessToken')
        .status(400)
        .send(err || {error: 'User not found.'});
      }
      req.user = user;
      next();
    });
  });
};

userSchema.statics.adminVerify = (req, res, next) => {
  if(!req.user._clearance === 'Administrator' ) res.status(403).send({error : 'Administrator Access Deniedd.'});
  next();
};

var User = mongoose.model('User', userSchema);
module.exports = User;
