var needsUpdating = true;
var statuses = [];
var intervalId = null;
var last_id = null;
var seen_ids = [];
var searchInProgress = false;

function parseQuery(qstr) {
    var query = {};
    var a = qstr.substr(1).replace(/\+/g, ' ').split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '')
    }
    return query;
}

function process_status(status) {
  var text = status['text']
  var images = []
  if (status['entities']
    && status['entities']['media']) {
    images = _.map(status['entities']['media'], function(m) { return m['media_url'] })
  }

  var visualizations = [
    // 'blur',
    // 'clean',
    // 'bare',
    // 'bare_bg',
    'pixelate',
  ]

  var params = parseQuery(window.location.search);
  if (params['viz']) {
    visualizations = visualizations.intersection(params['viz'].split(','));
  }

  var visualizations_addresses = _.map(visualizations, function(v) {
    return 'visualizations/' + v + '/' + v + '.html'
  })

  if (images.length > 0) {
    document.getElementById('iframe').src = _.sample(visualizations_addresses) + '?' + $.param({
      'text': text,
      'image': images[0],
      'author_name': status['user']['name'],
      'author_screenname': status['user']['screen_name'],
      'author_image': status['user']['profile_image_url']
    })
    return true;
  }

  return false;
}

function process_search_response(data) {
  searchInProgress = false;

  console.log('got ' + data['statuses'].length + ' statuses')

  new_statuses = _.filter(data['statuses'], function(status) {
    return !_.contains(seen_ids, status['id_str']);
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
      maybeDoUpdate();
    }
  }
}

function maybeDoUpdate() {
  if (needsUpdating && statuses.length > 0) {
    var status = statuses.shift()

    needsUpdating = false;
    process_status(status)
    if (!intervalId) {
      var params = parseQuery(window.location.search);
      var interval = parseInt(params['interval'] || '2000')
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
  var params = {
    q: query + " filter:twimg",
    result_type: 'popular',
    count: 10
  };

  if (searchOlder) {
    var max_id = _.min(seen_ids)
    console.log('searching older, starting from: ' + max_id)
    params['max_id'] = max_id;
  } else if (seen_ids.length > 0) {
    var since_id = _.max(seen_ids)
    console.log('searching newer, starting from: ' + since_id)
    params['since_id'] = since_id;
  }

  cb.__call(
      "search_tweets",
      params,
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
