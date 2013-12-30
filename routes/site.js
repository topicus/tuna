
/*
 * GET home page.
 */

module.exports = function(app){
  app.get('/', render('index'));
  app.get('/t/:type/:id', render('index'));
};

/*
 * Render templates
 */
var render = function(path) {
  return function(req, res) {
    res.render(path);
  };
};