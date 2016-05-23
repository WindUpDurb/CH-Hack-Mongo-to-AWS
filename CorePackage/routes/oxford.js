'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');
var Oxford = require('../models/Oxford');

const OXFORD_SECRET = process.env.OXFORD_SECRET;
console.log('OXFORD_SECRET= ', OXFORD_SECRET || 'OXFORD_SECRET= EMPTY');
router.route('/')
.post((req, res) => {
  console.log('req.body.url',req.body.url);
  var image = req.body.url;

  var options = {
    method: 'POST',
    url: 'https://api.projectoxford.ai/vision/v1.0/describe',
    qs: {
      maxCandidates: '1'
    },
    headers: {
      'postman-token': 'd811b874-3549-0e1d-0d1f-21347ff4bbfa',
      'cache-control': 'no-cache',
      'ocp-apim-subscription-key': OXFORD_SECRET,
      'content-type': 'application/json'
    },
    body: {
      url: image
    },
    json: true
  };

  console.log('options: ', options);
  request(options, function(err, response, body) {
    if(err) return res.status(400).send(err);
    Oxford.create(body, res.handle);
  });
});

router.route('/:id')
.get((req, res) => {
  Oxford.getOne(req.params.id, res.handle);
})
.put((req, res) => {
  Oxford.update(req.params.id, req.body, res.handle);
})
.delete((req, res) => {
  Oxford.remove(req.params.id, err => {
    res.status(err ? 400 : 200).send(err || {SUCCESS : 'Item Deleted'});
  });
});

module.exports = router;
