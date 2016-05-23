'use strict';

var mongoose = require('mongoose');

var oxfordSchema = new mongoose.Schema({
  categories    : { type: Array, required: true},
  requestId     : { type: String},
  metadata      : { type: Object}
});

oxfordSchema.statics.getAll = cb => {
  Oxford.find({}, (err, result) => {
    err ? cb(err) : cb(null, result);
  });
};

oxfordSchema.statics.create = (newObj, cb) => {
  var image = new Oxford({
    categories: newObj.categories,
    requestId: newObj.requestId,
    metadata: newObj.metadata
  });
  image.save((err, savedOxford) => {
    if(err) return cb(err);

    else cb(null, savedOxford);
  });
};

oxfordSchema.statics.getOne = (id, cb) => {
  Oxford.findById(id, (err, result) => {
    err ? cb(err) : cb(null, result);
  });
};

oxfordSchema.statics.remove = (id, cb) => {
  Oxford.findByIdAndRemove(id, (err, deletedImage) => {
    err ? cb(err) : cb(null, deletedImage);
  });
};

oxfordSchema.statics.update = (id, updateObj, cb) => {
  if(!id || !updateObj) return cb({ERROR : 'Required information not Provided.'});
  var obj = updateObj;
  Oxford.findByIdAndUpdate(id, { $set: obj}, (err, updatedResult) => {
    if(err) return cb(err);
    updatedResult.save((err, savedImage) => {
      err ? cb(err) : cb(null, savedImage);
    });
  });
};

var Oxford = mongoose.model('Oxford', oxfordSchema);
module.exports = Oxford;
