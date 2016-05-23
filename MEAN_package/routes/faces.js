'use strict';

let express = require('express');
let router = express.Router();
let request = require('request');
let Face = require('../models/Face');

let OCP_APIM_SUBSCRIPTION_KEY = process.env.OCP_APIM_SUBSCRIPTION_KEY;
console.log('OCP_APIM_SUBSCRIPTION_KEY= ', OCP_APIM_SUBSCRIPTION_KEY || 'OCP_APIM_SUBSCRIPTION_KEY= EMPTY');


// router.route('/:id')
// .get((req, res) => {
//   Face.findById(req.params.id, res.handle);
// })
// .delete((req, res) => {
//   Face.findByIdAndRemove(req.params.id, (err, facedetects) => {
//     res.status(err ? 400: 200).send(err || {SUCCESS : 'Removed!'});
//   });
// })
// .put((req, res) => {
//   let bodyObj = {
//     faceId: req.body.faceId,
//     faceRectangle: {
//       top: req.body.top,
//       left: req.body.left,
//       width: req.body.width,
//       height: req.body.height
//     }
//   };
//   Face.update(req.params.id, bodyObj, res.handle);
// });

router.route('/')
.post((req, res) => {
  let options = {
    method: 'POST',
    url: 'https://api.projectoxford.ai/face/v1.0/detect',
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/json',
      'ocp-apim-subscription-key': OCP_APIM_SUBSCRIPTION_KEY
    },
    body: {
      url: req.body.url
    },  json: true
  };

  request(options, (err, response, body) => {
    if(err) return res.send(err);

    let facedetect = new Face(body[0]);

    facedetect.save(res.handle);
  });
});

module.exports = router;
