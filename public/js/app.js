;(function(){
  var request = superagent;

  var $ajaxForm = $('.ajaxForm')
    , $main = $('#main')
    , $forms = $('#forms')
    , $dragdrop = $('#dragdrop')
    , $toolbar = $('#toolbar')
    , $imagehref = $('#image_href');

  //MOVE TPL's TO OTHER FILE
  var previewTpl = '<div class="preview">'+
                      '<span class="imageHolder">'+
                          '<img />'+
                          '<span class="uploaded"></span>'+
                      '</span>'+
                      '<div class="progressHolder">'+
                          '<div class="progress"></div>'+
                      '</div>'+
                    '</div>';

  var itemTopTpl = '<div class="input-group top-item">' + 
                      '<span class="span input-group-addon"><%= place %></span>' +
                      '<input class="input form-control input-list" name="item" placeholder="Write something...">' +
                    '</div>';

  var formError = function(field){
    alert("error");
  };
  var formSuccess = function(res){
    page('/t/'+res.type+'s/' + res.id)
  };
  var formBeforeSubmit = function(arr, $form, options) {
    arr.push({type:'textarea', name:'body', value:$('#inputPost').code() }); 
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
    beforeSubmit: formBeforeSubmit,
    resetForm: true,
  });

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
  $('#contentTypesContainer>li').on('click', function(e){
    console.log(e.target);
    $('.form-base>li').hide();
    $('.form-base>li').eq($(e.currentTarget).index()).show();
  });
  
  /*Top handlers*/
  $('#addItemTop').on('click', function(){
    var item_count = $('#topItems .top-item').length + 1;
    $('#topItems').append(_.template(itemTopTpl, {place:item_count + '.'}));
  });

  
  $('#inputPost').summernote({
    focus: true,
    toolbar: [
      ['style', ['style']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['fontsize', ['fontsize']],
      ['para', ['ul', 'ol']],
      ['insert', ['picture', 'link', 'video']], // no insert buttons
    ],
    oninit: function(e) {
      document.execCommand('selectAll',false,null);
    }
  });

  /*FIX THIS*/
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


  var dragdrop_message = $('#dragdrop .message');
  var createImage = function (file){
      $dragdrop.find('.preview').remove();
      var preview = $(previewTpl),
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
  /*END FIX THIS*/
})();