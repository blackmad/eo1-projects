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

function randChunkSplit(arr,min,max) {
  // uncomment this line if you don't want the original array to be affected
  // var arr = arr.slice();
  var arrs = [],size=1; 
  var min=min||1;
  var max=max||min||1;
  while (arr.length > 0) {
    size = Math.min(max,Math.floor((Math.random()*max)+min));
    arrs.push(arr.splice(0, size));
  }
  return arrs;
}

function doesOverflow(el) {
  // return $(el)[0].scrollHeight > $(el)[0].clientHeight || 
  // $(el)[0].scrollWidth > $(el)[0].clientWidth
    return ($(el)[0].scrollHeight > $(el).innerHeight()) || 
      ($(el)[0].scrollWidth > $(el).innerWidth());
}


function adjustTextSize($el) {
  while (doesOverflow($el)) {
    $el.css('font-size', parseInt($el.css('font-size')) - 5);
    console.log('adjusted down to ' + $el.css('font-size'));
  }
  // console.log(doesOverflow($el))

  $('.bgText').css('font-size', parseInt($el.css('font-size'))/2);
}

$(document).ready(function() {
  document.fonts.ready.then(function () {
    var text = params['text'] || 'lorem ipsum something';
    var words = text.split(' ')
    var chunks = randChunkSplit(words, 1, 3);

    var sizeLeft = 100;
    var lastClass = null;
    var classesUsed = []

    _.each(chunks, function(chunk) {
      var line = chunk.join(' ')
      var div = $('<div class="fullBlock"></div>')
      if (Math.random() < 0.3 && !_.contains(classesUsed, 'boxBlock')) {
        classesUsed.push('boxBlock')
        div.addClass('boxBlock')
      }
      var span = $('<span>' + line + '</span>')
      div.append(span)
      var height = Math.max(sizeLeft * Math.random(), 10)
      div.css('height', Math.floor(height) + 'vh')
      $('.content').append(div)
      adjustTextSize(div)
      var realHeight = Math.floor(span.height() / window.innerHeight)
      sizeLeft -= realHeight;
    });

    $('.textRepeat').html(_.times(300, function() { return text}).join(' '));
    $('.fullBlock').css('height', 'auto');
  });
})