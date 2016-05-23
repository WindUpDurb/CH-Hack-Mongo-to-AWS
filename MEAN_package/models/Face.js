'use strict';

let mongoose = require('mongoose');

let faceSchema = new mongoose.Schema({
  faceId          : {type: String},
  faceRectangle   : {type: Object}
});

faceSchema.statics.update = (id, fdObj, cb) => {

  Face.findByIdAndUpdate(id, {$set: fdObj}, (err, facedetect) => {
    if (err) return res.status(400).send(err);

    facedetect.save((err, saveFacedetect) => {
      err ? cb(err) : cb(null, saveFacedetect);
    });
  });
};

let Face = mongoose.model('Face', faceSchema);
module.exports = Face;
