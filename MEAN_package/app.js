'use strict';

require('dotenv').load();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGODB_URI || "mongodb://localhost/CORE_package";

// SERVER
var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socket1 = require('./socket_template');

// MIDDLE WARE
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var uuid = require('uuid');

// DB
let mongoose = require('mongoose');


// ROUTES
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.handle = (err, data) => {
    console.log('data ', data);
    res.status(err ? 400 : 200).send(err || data);
  };
  next();
});
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));



// LISTENERS
io.on('connection', (socket) => {
  console.log('Socket Connected');
  socket1.init(io, socket);
});
server.listen(PORT, err => {
  console.log(err || `Server @ PORT ${PORT}`);
});
mongoose.connect(MONGO_URL, err => {
  console.log(err || `MONGOdb @ ${MONGO_URL}`)
});
module.exports = router;
