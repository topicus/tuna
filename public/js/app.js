;(function(){
  var request = superagent;

  var $ajaxForm = $('.ajaxForm')
    , $main = $('#main')
    , $forms = $('#forms')
    , $dragdrop = $('#dragdrop')
    , $toolbar = $('#toolbar')
    , $imagehref = $('#image_href');

  var formError = function(field){
    alert("error");
  };
  var formSuccess = function(res){
    page('/t/'+res.type+'s/' + res.id)
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

  /* Client side routes */
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
  /* End Client side routes */
  
  /* Toolbar show/hide */
  $('#toolbar li').on('click', function(e){
    $('.form-base li').hide();
    $('.form-base li').eq($(e.currentTarget).index()).show();
  });
  /* End Toolbar show/hide */
  

  var upload_image = null;
  $dragdrop.filedrop({
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
    uploadStarted:function(i, file, len){
        createImage(file);
    },

    progressUpdated: function(i, file, progress) {
        $.data(file).find('.progress').width(progress);
    }, 
    uploadFinished: function(i, file, res, time) {
      $.data(file).addClass('done');
      $imagehref.val(res.href);
    }
  });  

  var template = '<div class="preview">'+
                          '<span class="imageHolder">'+
                              '<img />'+
                              '<span class="uploaded"></span>'+
                          '</span>'+
                          '<div class="progressHolder">'+
                              '<div class="progress"></div>'+
                          '</div>'+
                      '</div>'; 
  var dragdrop_message = $('#dragdrop .message');
  var createImage = function (file){
      $dragdrop.find('.preview').remove();
      var preview = $(template),
          image = $('img', preview);

      var reader = new FileReader();
      image.width = 100;
      image.height = 100;

      reader.onload = function(e){
        image.attr('src',e.target.result);
        preview.css({top:'50%',left:'50%',margin:'-'+(preview.height() / 2)+'px 0 0 -'+(preview.width() / 2)+'px'});
      };
      reader.readAsDataURL(file);
      preview.appendTo($dragdrop);
      dragdrop_message.hide();
      $.data(file,preview);
  };

})();