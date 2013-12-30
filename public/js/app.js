;(function(){
  var request = superagent;

  var $ajaxForm = $('.ajaxForm')
    , $main = $('#main')
    , $forms = $('#forms')
    , $dragdrop = $('#dragdrop')
    , $toolbar = $('#toolbar');

  var formError = function(field){
    alert("error");
  };
  var formSuccess = function(res){
    page('/t/posts/' + res.id)
  };  
  var hideToolbar = function(){
    $toolbar.hide();
  };
  var hideForms = function(){
    $forms.hide();
  };  
  var showToolbar = function(){
    $toolbar.show();
  };
  var showForms = function(){
    $forms.show();
  };    

  $('.ajaxForm').ajaxForm({
    error: formError,
    success: formSuccess,
    resetForm: true,
  });
  $( ".input-post" ).markdown();

  //Client side routes
  var showIndex = function(ctx){
    $main.hide();
    showToolbar();
    showForms();
  };
  var showContent = function(ctx){
    request
    .get('/api/' + ctx.params.type + '/' + ctx.params.id)
    .end(function(res){
      $main.html(res.body.html);
      $main.show();
      hideToolbar();
      hideForms();
    }); 
  };

  page('/', showIndex);
  page('/t/:type/:id', showContent);
  page();

  $('#toolbar li').on('click', function(e){
    $('.form-base li').hide();
    $('.form-base li').eq($(e.currentTarget).index()).show();
  });
  $dragdrop.filedrop({
    fallback_id: 'image',
    url: '/api/images/upload',
    paramname: 'image',
    allowedfiletypes: ['image/jpeg','image/png','image/gif'],
    maxfiles: 1,
    maxfilesize: 3,
    dragOver: function () {
      $dragdrop.css('background', 'rgb(226, 255, 226)');
    },
    dragLeave: function () {
      $dragdrop.css('background', 'rgb(241, 241, 241)');
    },
    drop: function () {
      $dragdrop.css('background', 'rgb(241, 241, 241)');
    },
    uploadFinished: function(i, file, res, time) {
      $dragdrop
        .css('background', 'url('+res.href+') center center')
        .css('background-size', '100% 100%')
        .children('p').hide();
    }
  });  

})();