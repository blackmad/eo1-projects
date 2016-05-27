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

function proxyImage(image) {
  if (window.location.protocol == "file:") {
    return image;
  } else {
    return '/proxy/' + image;
  }
}

function make_make_page(image_onload_handler) {
  return function() {
    var image = params['image'];
    var text = params['text'];
    
    $('.image').css('background-image', "url('" + image + "')");

    text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    text = text.replace(/: *$/, '');
    $('#text').html(text);

    $('#author_name').html(params['author_name'])
    $('#author_screenname').html(params['author_screenname'])

    if (image_onload_handler) {
      var img = new Image()
      img.onload = image_onload_handler;
      img.src = proxyImage(image)
    }
  }
}
