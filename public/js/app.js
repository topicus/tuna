;(function(){
  var request = superagent;

  var $ajaxForm = $('.ajaxForm')
    , $main = $('#main')
    , $forms = $('#forms')
    , $toolbar = $('#toolbar');

  var formError = function(field){
    alert("error");
  };
  var formSuccess = function(res){
    page('/posts/' + res.id)
  };  
  var showTuna = function(html){
    $main.html(html);
    hideToolbar();
    hideForms();
  };
  var hideToolbar = function(){
    $toolbar.hide();
  };
  var hideForms = function(){
    $forms.hide();
  };  
  $('.ajaxForm').ajaxForm({
    error: formError,
    success: formSuccess,
    resetForm: true,
  });
  $( ".input-post" ).markdown();

  //Client side routes
  var index = function(ctx){
    
  };
  var showContent = function(ctx){
    request
    .get('/api/' + ctx.params.type + '/' + ctx.params.id)
    .end(function(res){
      console.log(res);
      $main.html(res.body.html);
      hideToolbar();
      hideForms();
    }); 
  };
  page('/', index);
  page('/:type/:id', showContent);
  page();


  // $('.sharer-toolbar li').on('click', function(e){
  //   console.log($('.sharer-form li').eq($(e.currentTarget).index()));
  //   $('.sharer-form li').eq($(e.currentTarget).index()).removeClass('show');
  //   $('.sharer-form li').eq($(e.currentTarget).index()).hide();
  // })

})();