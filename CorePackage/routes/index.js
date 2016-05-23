'use strict';

let express = require('express');
let router = express.Router();
let path = require('path');
let User = require('../models/User');

router.get('/', (req, res, next) => {
  let indexPath = path.join(__dirname, '../views/index.html');
  res.sendFile(indexPath);
});

router.get('/admin', User.loggedIn, User.adminVerify,  (req, res) => {
  console.log('req.user:\n', req.user);
  res.send('ADMINS ONLY\n');
});

module.exports = router;
