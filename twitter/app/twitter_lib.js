function process_status(status) {
  var text = status['text']
  var images = []
  if (status['entities']
    && status['entities']['media']) {
    images = _.map(status['entities']['media'], function(m) { return m['media_url'] })
  }

  var visualizations = [
    //'visualizations/blur/blur.html',
    'visualizations/clean/clean.html'
  ]
  if (images.length > 0) {
    document.getElementById('iframe').src = _.sample(visualizations) + '?' + $.param({
      'text': text,
      'image': images[0]
    })
    return true;
  }

  return false;
}

function process_search_response(data) {
  var statuses = data['statuses'];
  process_status(statuses[1]);
}

function make_page() {
  var cb = new Codebird;
  cb.setConsumerKey(YOURKEY, YOURSECRET);
  cb.setToken(YOURTOKEN, YOURTOKENSECRET);

  // var params = {
  //   q: "NYC photo"
  // };
  // cb.__call(
  //     "search_tweets",
  //     params,
  //     process_search_response,
  //     true
  // );

  process_search_response(dummy_data);
}
