var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

module.exports = function(app) {
  var Post = new Schema({
    "body": { type: String, required: true }
  });
  mongoose.model('post', Post);
  var Image = new Schema({
      "image" :  { type: String, required: true }
    , "body": { type: String}
  });
  mongoose.model('image', Image);
  var Top = new Schema({
    "items" :  [String]
  });
  mongoose.model('top', Top);
  var Quote = new Schema({
    "body": { type: String, required: true }
  });
  mongoose.model('quote', Quote);
};