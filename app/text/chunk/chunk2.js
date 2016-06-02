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

function forceRedraw(element){
  var disp = element.style.display;
  element.style.display = 'none';
  var trick = element.offsetHeight;
  element.style.display = disp;
};

jQuery.fn.redraw = function() {
    return this.hide(0, function() {
        $(this).show();
    });
};

function adjustTextSize(selector) {
  var $el = $(selector);

  while (doesOverflow($el)) {
    $el.css('font-size',
      parseInt($el.css('font-size')) - 5);
    $(window).trigger('resize');
    forceRedraw($el[0])
    $el.redraw();
    window.getComputedStyle($el[0])
    console.log('adjusted down to ' + $el.css('font-size'));
  }
  console.log(doesOverflow($el))
}

$(document).ready(function() {
  var selector = '.fullBlock'
  $(selector).html(params['text'] || 'lorem ipsum something');
  adjustTextSize(selector)
})