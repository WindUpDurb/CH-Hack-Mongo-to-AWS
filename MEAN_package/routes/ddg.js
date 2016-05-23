'use strict';

let express = require('express');
let router = express.Router();
let ddg = require('ddg');

router.route('/')
.post((req, res) => {
  if(!req.body.search) return res.status(400).send({ERROR : 'You did not provide a search term'});
  let ddgOptions = {
    "format"          :   "json",
    "no_redicrects"   :   "1",
    "no_html"         :   "0"
  };
  ddg.query(req.body.search, ddgOptions, res.handle);
});

module.exports = router;
