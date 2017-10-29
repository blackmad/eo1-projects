  var originalPresets = [
    
    [
    { shape : 'diamond', resolution : 48, size: 50 },
      { shape : 'diamond', resolution : 48, offset : 24 },
      { shape : 'circle', resolution : 8, size: 6 }],

    // [{ resolution: 32 },
    //   { shape : 'circle', resolution : 32, offset: 15 },
    //   { shape : 'circle', resolution : 32, size: 26, offset: 13 },
    //   { shape : 'circle', resolution : 32, size: 18, offset: 10 },
    //   { shape : 'circle', resolution : 32, size: 12, offset: 8 }],

    [{ resolution: 48 },
      { shape: 'diamond', resolution: 48, offset: 12, alpha: 0.5  },
      { shape: 'diamond', resolution: 48, offset: 36, alpha: 0.5  },
      { shape: 'circle', resolution: 16, size: 8, offset: 4, alpha: 0.5 }],

    [{ shape: 'diamond', resolution: 24, size: 25 },
      { shape: 'diamond', resolution: 24, offset: 12 },
      { resolution: 24, alpha: 0.5 }],

    [{ shape: 'square', resolution: 32 },
      { shape: 'circle', resolution: 32, offset: 16 },
      { shape: 'circle', resolution: 32, offset: 0, alpha: 0.5 },
      { shape: 'circle', resolution: 16, size: 9, offset: 0, alpha: 0.5 }],

    [{ shape : 'circle', resolution : 24 },
      { shape : 'circle', resolution : 24, size: 9, offset: 12 }],

    [{ shape : 'square', resolution : 48, offset: 24 },
      { shape : 'circle', resolution : 48, offset : 0 },
      { shape : 'diamond', resolution : 16, size: 15, offset : 0, alpha : 0.6 },
      { shape : 'diamond', resolution : 16, size: 15, offset : 8, alpha : 0.6 }],

    [{ shape : 'square', resolution : 48 },
      { shape : 'diamond', resolution : 12, size: 8 },
      { shape : 'diamond', resolution : 12, size: 8, offset : 6 }]
  ]


var otherOptions = [
[
  { shape: 'diamond', resolution: 8, size: 22, offset: 0, alpha: 0.611 }
],
[
  { shape: 'circle', resolution: 8, size: 2, offset: 0, alpha: 0.651 },
  { shape: 'circle', resolution: 8, size: 2, offset: 66, alpha: 0.541 },
  { shape: 'circle', resolution: 8, size: 2, offset: 70, alpha: 0.441 },
  { shape: 'circle', resolution: 8, size: 25, offset: 0, alpha: 0.501 }
],
[
  { shape: 'square', resolution: 8, size: 18, offset: 0, alpha: 0.121 },
  { shape: 'circle', resolution: 8, size: 2, offset: 66, alpha: 0.541 },
  { shape: 'circle', resolution: 8, size: 2, offset: 0, alpha: 0.651 },
  { shape: 'circle', resolution: 8, size: 2, offset: 19, alpha: 0.501 },
  { shape: 'circle', resolution: 8, size: 2, offset: 70, alpha: 0.441 }
],
[
  { shape: 'diamond', resolution: 24, size: 90, offset: 14, alpha: 0.191 },
  { shape: 'diamond', resolution: 8, size: 33, offset: 17, alpha: 0.431 },
  { shape: 'diamond', resolution: 42, size: 105, offset: 23, alpha: 0.031 }
],
[
  { shape: 'square', resolution: 8, size: 18, offset: 0, alpha: 0.5 }
],
[
    {"shape":"square","resolution":16,"offset":-22,"alpha":0.94},
    {"shape":"square","resolution":23,"offset":-25,"alpha":0.97},
    {"shape":"square","resolution":16,"offset":22,"alpha":0.94},
    {"shape":"square","resolution":23,"offset":25,"alpha":0.97},
    {"resolution": 9, "alpha": 0.5},
  ]
]

var presets = _.map(originalPresets, function(preset) {
  return _.map(preset, function(line) {
    if (line['resolution']) line['resolution'] = line['resolution'] / 2;
    if (line['size']) line['size'] = line['size'] / 2;
    if (line['offset']) line['offset'] = line['offset'] / 2;
    return line;
  });
});

var possibleOpts = presets.concat(otherOptions);

function pixelate_img_load(event) {
  img = event.target;
  img.onload = null;

  var img_height = img.height;
  var img_width = img.width;

  var final_height = 0;
  var final_width = 0;
  if (img_height > img_width) {
    // portrait
    img.style.maxHeight = window.innerHeight;
  } else {
    // landscape
    img.style.maxWidth = window.innerWidth;
  }

  var mainCanvas = document.createElement("canvas");
  mainCanvas.width = img.width;
  mainCanvas.height = img.height;
  var ctx = mainCanvas.getContext("2d");
  ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
  img.src = mainCanvas.toDataURL("image/jpeg");

  var opts = _.sample(possibleOpts);

  // opts = _.times(_.random(3, 5), function (index) {
  //   return {
  //     // shape: _.sample(['circle', 'diamond', 'square']),
  //     resolution: _.random(1, 50),
  //     offset: _.random(-50, 50),
  //     alpha: _.random(50, 100) / 100
  //   }
  // });


  console.log(JSON.stringify(opts));

  canvas = img.closePixelate(opts);
  console.log('setting pixelated bg')
  adjust_image_bg_for_text(img)
  $('.image').css('background-image', "url('" + canvas.toDataURL("image/png") + "')");
  $.adaptiveBackground.run();
}
