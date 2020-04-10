var needsUpdating = true;
var statuses = [];
var intervalId = null;
var last_id = null;
var offset = 0;
var seen_ids = [];
var seen_images = [];
var searchInProgress = false;
var first_load = true;
var params = {};

var iframe_index = 0;

function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).replace(/\+/g, ' ').split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
    }
    return query;
}

function get_images(resp) {
  if (resp && resp['photos']) {
    return resp['photos'];
  }
  return [];
}

function process_status(status) {
  var text = status['text']
  var image = status['url']
  var user = status['user'] || {};

  console.log('trying to process')
  console.log(status)

  var visualizations = [
    // 'blur',
    // 'clean',
    // 'bare',
    // 'bare_bg',
    'pixelate',
  ]

  var params = parseQuery(window.location.search);
  if (params['viz']) {
    visualizations = _.intersection(visualizations, params['viz'].split(','));
    if (visualizations.length == 0) {
      visualizations = params['viz'].split(',')
    }
  }

  var visualizations_addresses = _.map(visualizations, function(v) {
    return 'visualizations/' + v + '/' + v + '.html'
  })

  if (image) {
    console.log('have images')
    new_params = {
      'text': text,
      'image': image,
      'author_name': user['name'],
      'author_screenname': user['screen_name'],
      'author_image': user['profile_image_url']
    }
    if (params['hideText']) {
      new_params['hideText'] = params['hideText']
    }
    if (params['text'] == 'no') {
      new_params['hideText'] = 'yes'
    }
    new_url = _.sample(visualizations_addresses) + '?' + $.param(new_params)

    iframe_index = (iframe_index + 1) % 2
    var iframe_id = 'iframe' + iframe_index
    console.log('using ' + iframe_id)
    document.getElementById(iframe_id).src = new_url;

    if (first_load) {
      first_load = false;
      flipIframes();
    } else {
      setTimeout(flipIframes, 2000);
    }
    return true;
  }

  return false;
}

function flipIframes() {
  $('#body').toggleClass('state1 state2')
  console.log('swapping iframes')
}

function process_search_response(data) {
  searchInProgress = false;

  new_statuses = data['photos'];
  params['offset'] = data['end'];

  if (new_statuses.length == 0) {
    console.log('restarting from the beginning')
    params['offset'] = 0;
    updateSearch(params);
  } else {
    console.log(new_statuses.length + ' were new')
    statuses = new_statuses;

    console.log('maybe do update')
    maybeDoUpdate();
  }
}

function maybeDoUpdate() {
  console.log('statuses length '+ statuses.length)
  if (needsUpdating && statuses.length > 0) {
    console.log('have status, need update')
    var status = statuses.shift()

    needsUpdating = false;
    process_status(status)
    if (!intervalId) {
      var interval = 200000
      if (params['interval']) {
        interval = parseDuration(params['interval'])
        console.log('refresh every ' + interval + ' ms')
      }
      intervalId = setInterval(forceUpdate, interval);
    }

    if (statuses.length < 2) {
      updateSearch(params);
    }
  }
}

function updateSearch(options) {
  if (searchInProgress) { return; }
  searchInProgress = true;

  console.log(options)
  if (params['instagram']) {
    jQuery.get('/instagram/posts', options, process_search_response)
  } if (params['twitter']) {
    jQuery.get('/twitter/posts', options, process_search_response)
  } else {
    jQuery.get('/tumblr/posts', options, process_search_response)
  }
}

function forceUpdate() {
  needsUpdating = true;
  maybeDoUpdate();
}

function make_page() {
  params = parseQuery(window.location.search);

  if (params['debug'] == '1') {
    process_status(dummy_data['photos'][3])
  } else if (params['debug']) {
    process_search_response(dummy_data);
  } else {
    updateSearch(params);
  }
}
