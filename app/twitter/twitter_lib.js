var needsUpdating = true;
var statuses = [];
var intervalId = null;
var last_id = null;
var seen_ids = [];
var seen_images = [];
var searchInProgress = false;
var first_load = true;

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

function get_videos(status) {
  if (status
    && status['extended_entities']
    && status['extended_entities']['media']
    && status['extended_entities']['media'][0]
    && status['extended_entities']['media'][0]['video_info']
  ) {
    return _.map(status['extended_entities']['media'], function(m) { return m["video_info"]['variants'][0]['url'] })
  }
  return []
}

function get_images(status) {
  if (status && status['entities']
    && status['entities']['media']) {
    return _.map(status['entities']['media'], function(m) { return m['media_url'] })
  }
  return []
}

function process_status(status) {
  var text = status['text']
  var images = get_images(status)
  var videos = get_videos(status)

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

  if (images.length > 0) {
    console.log('have images')
    new_params = {
      'text': text,
      'image': images[0],
      'video': videos[0] || '',
      'author_name': status['user']['name'],
      'author_screenname': status['user']['screen_name'],
      'author_image': status['user']['profile_image_url']
    }
    if (params['hideText']) {
      new_params['hideText'] = params['hideText']
    }
    if (params['text'] == 'no') {
      new_params['hideText'] = 'yes'
    }
    new_url = _.sample(visualizations_addresses) + '?' + $.param(new_params)

    console.log(new_url)

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
  console.log(data)

  var statusData = data;
  if (data.hasOwnProperty('statuses')) {
    console.log('got ' + data['statuses'].length + ' statuses')
    statusData = data['statuses']
  }

  new_statuses = _.filter(statusData, function(status) {
    if (_.contains(seen_ids, status['id_str'])) {
      console.log('discarding status because we\'ve already seen ' + status['id_str'])
      console.log(status)
      // dupe status
      return false;
    }

    var images = get_images(status)
    if (images.length == 0) {
      console.log('discarding status because no images')
      console.log(status)
      return false;
    }
    if (_.contains(seen_images, images[0])) {
      // dupe image
      console.log('discarding status because we\'ve already seen ' + images[0])
      console.log(status)
      return false;
    }

    if (images[0]) {
      seen_images.push(images[0])
    }

    return true;
  })

  console.log(new_statuses.length + ' were new')

  if (new_statuses.length == 0) {
    updateSearch({'searchOlder': true});
  } else {
    statuses = statuses.concat(new_statuses);
    seen_ids = seen_ids.concat(_.map(new_statuses, function(s) { return s['id_str'] }));

    if (statuses.length == 0) {
      if (intervalId) {
        clearInterval(intervalId)
      }
    } else {
      console.log('maybe do update')
      maybeDoUpdate();
    }
  }
}

function maybeDoUpdate() {
  if (needsUpdating && statuses.length > 0) {
    console.log('have status, need update')
    var status = statuses.shift()

    needsUpdating = false;
    process_status(status)
    if (!intervalId) {
      var params = parseQuery(window.location.search);
      var interval = 200000
      if (params['interval']) {
        interval = parseDuration(params['interval'])
        console.log('refresh every ' + interval + ' ms')
      }
      intervalId = setInterval(forceUpdate, interval);
    }

    if (statuses.length < 2) {
      updateSearch();
    }
  }
}

function updateSearch(options) {
  if (searchInProgress) { return; }
  searchInProgress = true;

  options = options || {}
  var searchOlder = options['searchOlder'] || false;

  var cb = new Codebird;
  cb.setConsumerKey(YOURKEY, YOURSECRET);
  cb.setToken(YOURTOKEN, YOURTOKENSECRET);

  var params = parseQuery(window.location.search);
  var query = params['q'] || "NYC OR new york"
  var list_id = params['list_id']

  // query += " filter:twimg";
  var my_params = {
    q: query,
    count: 100,
    list_id: list_id
  };

  var endpoint = 'search_tweets'
  if (list_id) {
    endpoint = 'lists_statuses'
  }

  if (params['result_type']) {
    my_params['result_type'] = params['result_type'];
  }

  console.log(my_params)

  if (searchOlder) {
    var max_id = _.min(seen_ids)
    console.log('searching older, starting from: ' + max_id)
    my_params['max_id'] = max_id;
  } else if (seen_ids.length > 0) {
    var since_id = _.max(seen_ids)
    console.log('searching newer, starting from: ' + since_id)
    my_params['since_id'] = since_id;
  }

  cb.__call(
      endpoint,
      my_params,
      process_search_response,
      true
  );
}

function forceUpdate() {
  needsUpdating = true;
  maybeDoUpdate();
}

function make_page() {
  var params = parseQuery(window.location.search);

  if (params['debug'] == '1') {
    process_status(dummy_data['statuses'][3])
  } else if (params['debug']) {
    process_search_response(dummy_data);
  } else {
    updateSearch();
  }
}


$("body").keydown(function(e) {
  if(e.keyCode == 37) { // left
    console.log('left');
  }
  else if(e.keyCode == 39) { // right
    console.log('right');
  }
});

$("iframe0").keydown(function(e) {
  if(e.keyCode == 37) { // left
    console.log('left');
  }
  else if(e.keyCode == 39) { // right
    console.log('right');
  }
});

$("iframe1").keydown(function(e) {
  if(e.keyCode == 37) { // left
    console.log('left');
  }
  else if(e.keyCode == 39) { // right
    console.log('right');
  }
});
