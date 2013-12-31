
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , config = require('./config.json')
  , mongoose = require('mongoose')
  , path = require('path');

/*
 * DB
 */
console.log("here");
mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

var app = express();

app.configure(function(){
  app.set('port', config.port || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.limit('3.5mb'));
  app.use(express.methodOverride());
  app.use(app.router); 
  app.use(express.static(path.join(__dirname, '/public')));
  app.use(function(req, res) {
     res.status(400);
     res.render('404');
  });
  app.use(function(error, req, res, next) {
    console.log(error);
     res.status(500);
     res.render('500');
  });     
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
 * Models
 */

require('./models')(app);

/*
 * Routes
 */
require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
process.on('uncaughtException', function(err){
  console.log(err);
});