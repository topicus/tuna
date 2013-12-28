module.exports = function(app) {
  app.locals.md = require('markdown').markdown.toHTML;
  require('./site')(app);
  require('./api')(app);
};