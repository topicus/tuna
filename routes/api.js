var mongoose = require('mongoose')
  , config = require('../config.json')
  , _ = require('underscore')
  , fs = require('fs')
  , request = require('superagent');

var Post = mongoose.model('post');
var contentTpl = {
  'posts': 'post',
  'images': 'image',
}


module.exports = function(app) {
  app.post('/api/posts/create', createPost, gracefulRes());
  app.get('/api/:type/:id', loadContent, render())
};

/*
 * Return something good
 */
var gracefulRes = function(msg) {
  return function(req, res) {
    res.json(msg && {msg: msg} || {err: null, type:res.locals.type, id: res.locals.item.id});
  };
};


/*
 * Render templates
 */
var render = function() {
  return function(req, res) { 
    res.render(res.locals.tpl, function(err, html){
      if(err) return res.send(500);
      res.json({html: html});
    });
  };
};

/*
 * Redirect to a route
 */
var redirect = function(route) {
  return function(req, res) {
    res.redirect(route);
  };
};

/*
 * Save new post
 */
var createPost = function(req, res, next){  
  var post = new Post({
    body: req.body.body
  });
  post.save(function(err, post){
    if(err) {
      return res.send(500); 
    }
    res.locals.item = post;
    res.locals.type = 'post';
    next();
  });  
};


/*
 * Load post
 */
var loadContent = function(req, res, next){
 var modelName = req.params.type.substring(0, req.params.type.length -1);
 var Content = mongoose.model(modelName);
 Content.findById(req.params.id)
  .exec(function(err, content) {
    console.log(err, content);
    if(err || !content) return res.send(500);
    res.locals.content = content;
    res.locals.item = modelName;
    res.locals.tpl = modelName;
    next();
  });
};
