  var possibleOpts = [
    [{ shape : 'diamond', resolution : 48, size: 50 },
      { shape : 'diamond', resolution : 48, offset : 24 },
      { shape : 'circle', resolution : 8, size: 6 }],

    [{ resolution: 32 },
      { shape : 'circle', resolution : 32, offset: 15 },
      { shape : 'circle', resolution : 32, size: 26, offset: 13 },
      { shape : 'circle', resolution : 32, size: 18, offset: 10 },
      { shape : 'circle', resolution : 32, size: 12, offset: 8 }],

    [{ resolution: 48 },
      { shape: 'diamond', resolution: 48, offset: 12, alpha: 0.5  },
      { shape: 'diamond', resolution: 48, offset: 36, alpha: 0.5  },
      { shape: 'circle', resolution: 16, size: 8, offset: 4, alpha: 0.5 }],

    // [{ shape: 'circle', resolution: 32, size: 6, offset: 8 },
    //   { shape: 'circle', resolution: 32, size: 9, offset: 16 },
    //   { shape: 'circle', resolution: 32, size: 12, offset: 24 },
    //   { shape: 'circle', resolution: 32, size: 9, offset: 0 }],

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

  // opts = _.times(_.random(-5, 5), function (index) {
  //   return {
  //     shape: _.sample('circle', 'diamond', 'square'),
  //     resolution: _.random(1, 50),
  //     offset: _.random(1, 50),
  //     alpha: _.random(50, 100) / 100
  //   }
  // });

  canvas = img.closePixelate(opts);
  console.log('setting pixelated bg')
  adjust_image_bg_for_text(img)
  $('.image').css('background-image', "url('" + canvas.toDataURL("image/png") + "')");
}
