
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , MongoStore = require('connect-mongo')(express)
  , passport = require('passport')
  , config = require('./config.json')
  , mongoose = require('mongoose')
  , path = require('path');

/*
 * DB
 */
mongoose.connect(config.db.url || ('mongodb://' + config.db.host + '/'+ config.db.name));

var app = express();

app.configure(function(){
  app.set('config', config);
  app.set('port', config.port || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.limit('3.5mb'));
  app.use(express.methodOverride());
  app.use(express.methodOverride());
  app.use(express.cookieParser(app.get('config').session));
  app.use(express.session({
      secret: app.get('config').session
    , store: new MongoStore({db: app.get('config').db.name
    , url:app.get('config').db.url}) 
    , cookie: { maxAge: 365 * 24 * 60 * 60 * 1000, path: '/', domain: '.' + app.get('config').host }
  }));
  app.use(passport.initialize());
  app.use(passport.session());  
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