/* TODO
- try a version where the image fills the height or the width, not both
- try a version where we only blur behind the text
*/

function process_status(status) {
  console.log(status)
  var text = status['text']
  var images = []
  if (status['entities'] 
    && status['entities']['media']) {
    images = _.map(status['entities']['media'], function(m) { return m['media_url'] })
  }

  if (images.length > 0) {
    $('.blur')[0].style.backgroundImage = "url('" + images[0]+ "')";

    text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    $('#text').html(text);

    var img = new Image()
    img.onload = function(i) {
      var colorThief = new ColorThief();
      var color = colorThief.getColor(img)
      var c = tinycolor({r: color[0], g: color[1], b: color[2]})
      console.log(c.toHexString())

      $('#text').css('color', c.complement().toHexString());
    }
    img.src = '/proxy/' + images[0]
  }
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