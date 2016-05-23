'use strict';

let express = require('express');
let router = express.Router();

router.use('/s3', require('./s3'));
router.use('/ddg', require('./ddg'));
router.use('/oxford', require('./oxford'));
router.use('/faces', require('./faces'));
router.use('/users', require('./users'));



module.exports = router;
