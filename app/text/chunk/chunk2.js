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

function doesOverflow(el) {
  // return $(el)[0].scrollHeight > $(el)[0].clientHeight || 
  // $(el)[0].scrollWidth > $(el)[0].clientWidth
    return ($(el)[0].scrollHeight > $(el).innerHeight()) || 
      ($(el)[0].scrollWidth > $(el).innerWidth());
}


function adjustTextSize(selector) {
  document.fonts.ready.then(function () {
    var $el = $(selector);

    while (doesOverflow($el)) {
      $el.css('font-size', parseInt($el.css('font-size')) - 5);
      console.log('adjusted down to ' + $el.css('font-size'));
    }
    console.log(doesOverflow($el))
    // $el.css('height', 'auto')

    $('.bgText').css('font-size', parseInt($el.css('font-size'))/2);
  })
}

$(document).ready(function() {
  var selector = '.fullBlock'
  var text = params['text'] || 'lorem ipsum something';
  $('.text').html(text);
  $('.textRepeat').html(_.times(30, function() { return text}).join(' '));
  adjustTextSize(selector)

})