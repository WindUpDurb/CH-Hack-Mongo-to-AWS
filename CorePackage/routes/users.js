var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', (req, res) => {
  User.find({}, res.handle);
});

router.post('/register', (req, res) => {
  User.register(req.body, res.handle);
});

router.post('/login', (req, res) => {
  User.login(req.body, (err, token) => {
    if(err) return res.status(400).send(err);
    res.cookie('accessToken', token).send(token);
  });
});

router.delete('/logout', (req, res) => {
  res.clearCookie('accessToken').send();
});

router.get('/profile', User.loggedIn, (req, res) => {
  res.send(req.user);
});

module.exports = router;
