var needsUpdating = true;
var statuses = [];
var intervalId = null;
var last_id = null;

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
    'blur',
    // 'clean',
  ]

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
  statuses = statuses.concat(data['statuses']);
  maybeDoUpdate();
}

function maybeDoUpdate() {
  if (needsUpdating && statuses) {
    var status = statuses.shift()
    needsUpdating = false;
    process_status(status)
    if (!intervalId) {
      intervalId = setInterval(forceUpdate, 2000);
    }
  }
  if (statuses.length < 2) {
    updateSearch();
  }
}

function updateSearch() {
  var cb = new Codebird;
  cb.setConsumerKey(YOURKEY, YOURSECRET);
  cb.setToken(YOURTOKEN, YOURTOKENSECRET);

  var params = parseQuery(window.location.search);
  var query = params['q'] || "NYC OR new york"
  var params = {
    q: query + " filter:twimg",
    result_type: 'popular',
    count: 100
  };
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
  // updateSearch();
  process_search_response(dummy_data);
  // process_status(dummy_data['statuses'][3])
}
