function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).replace(/\+/g, ' ').split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
    }
    return query;
}

var params = parseQuery(window.location.search);

function shouldProxyImage() {
  return window.location.protocol != "file:";
}

function proxyImage(image) {
  if (shouldProxyImage()) {
    return '/proxy/' + image;
  } else {
    return image;
  }
}

function adjust_image_bg_for_text(img) {
  var is_img_widescreen = img.width >= img.height;
  var is_window_widescreen = window.innerWidth > window.innerHeight;
  var text_box_height = $('#text').height();
  if (!is_window_widescreen && is_img_widescreen) {
    var displayed_height = img.height * (window.innerWidth / img.width)
    var text_top = $(document.querySelector("#outer_text")).position()

    if (displayed_height < text_top.top) {
      var offset = (text_top.top - displayed_height) / 2
      $('.image').css('background-position', '50% ' + offset);
    }
  }
}

function hideTextDisplay() {
  $('body').addClass('notext')
  $('.textDisplay').hide()
}

function make_make_page(image_onload_handler) {
  return function() {
    var image = params['image'];
    var text = params['text'];
    console.log(image)

    var video = params['video'];

    if (video) {
      var videocontainer = document.getElementById('videoclip');
      var videosource = document.getElementById('mp4video');
      videosource.setAttribute('src', video);
      videocontainer.load();
      videocontainer.play();
      $('.image').hide();
    }

    if (params['hideText'] == 'yes') {
      hideTextDisplay();
    }

    if (text) {
      text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      text = text.replace(/: *$/, '');
      text = text.trim()
      if (text.length > 0) {
        $('#text').html(text);
      } else {
        hideTextDisplay();
      }

      $('#author_name').html(params['author_name'])
      $('#author_screenname').html(params['author_screenname'])
    } else {
      hideTextDisplay()
    }

    if (image) {
      $('.image').css('background-image', "url('" + image + "')");
      if (image_onload_handler) {
        var img = new Image()
        img.onload = image_onload_handler;
        img.src = proxyImage(image)
      }
    }
  }
}
