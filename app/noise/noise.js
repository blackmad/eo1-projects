var Simple1DNoise = function() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};


function draw_noisy_line(context, x0, y0, x1, y1) {
  var generator = new Simple1DNoise();

  context.beginPath();
  context.moveTo(x0, y0);

  var dx = x1 - x0;
  var dy = y1 - y0;

  var inc_x = (dx >= 0) ? +1 : -1;
  var inc_y = (dy >= 0) ? +1 : -1;

  dx = (dx < 0) ? -dx : dx;
  dy = (dy < 0) ? -dy : dy;

  if (dx >= dy) {
    var d = 2*dy - dx
    var delta_A = 2*dy
    var delta_B = 2*dy - 2*dx

    var x = 0;
    var y = 0;
    for (i=0; i<=dx; i++) {
      context.lineTo(x + x0, y + y0 + generator.getVal(x)-0.5);
      if (d > 0) {
        d += delta_B;
        x += inc_x;
        y += inc_y;
      }
      else {
        d += delta_A;
        x += inc_x;
      }
    }
  }
  else {
    var d = 2*dx - dy
    var delta_A = 2*dx
    var delta_B = 2*dx - 2*dy

    var x = 0;
    var y = 0;
    for (i=0; i<=dy; i++) {
      context.lineTo(x + x0 + generator.getVal(x)-0.5, y + y0);
      if (d > 0) {
        d += delta_B;
        x += inc_x;
        y += inc_y;
      }
      else {
        d += delta_A;
        y += inc_y;
      }
    }
  }

  context.stroke();
}

function drawLine(from_x, from_y, to_x, to_y) {
  var slope = from_x - to_x / from_y - to_y;

  context.save()
  context.beginPath();
  context.strokeStyle="#FF0000";
  context.moveTo(from_x, from_y);
  context.lineTo(to_x, to_y);
  // context.stroke();
  context.restore()

  context.strokeStyle="#000000";

  context.beginPath();
  context.moveTo(from_x, from_y)

  var distance = 0.0
  _.times(1000, function(x) {
    var distance = x / Math.abs(Math.floor(from_x - to_x))
    var x_offset = (distance * (to_x - from_x)) + from_x
    var y_offset = (distance * (to_y - from_y)) + from_y
    var x_jitter = 0  // (Math.random() * 10) - 5
    var y_jitter = generator.getVal(x) - 0.5
    console.log(y_jitter)
    context.lineTo(x_offset , y_offset + y_jitter)
  })

  context.stroke();

}


function draw_clean_line(context, from_x, from_y, to_x, to_y) {
  var slope = from_x - to_x / from_y - to_y;

  context.save()
  context.beginPath();
  context.strokeStyle="#FF0000";
  context.moveTo(from_x, from_y);
  context.lineTo(to_x, to_y);
  context.stroke();
  context.restore()
}

/* Following canvas-based Perlin generation code originates from
 * iron_wallaby's code at: http://www.ozoneasylum.com/30982
 */
function randomNoise(canvas, x, y, width, height, alpha) {
    x = x || 0;
    y = y || 0;
    width = width || canvas.width;
    height = height || canvas.height;
    alpha = alpha || 255;
    var g = canvas.getContext("2d"),
        imageData = g.getImageData(x, y, width, height),
        random = Math.random,
        pixels = imageData.data,
        n = pixels.length,
        i = 0;
    while (i < n) {
        pixels[i++] = pixels[i++] = pixels[i++] = (random() * 256) | 0;
        pixels[i++] = alpha;
    }
    g.putImageData(imageData, x, y);
    return canvas;
}

function perlinNoise(canvas, noise) {
    noise = noise || randomNoise(createCanvas(canvas.width, canvas.height));
    var g = canvas.getContext("2d");
    g.save();
    
    /* Scale random iterations onto the canvas to generate Perlin noise. */
    for (var size = 4; size <= noise.width; size *= 2) {
        var x = (Math.random() * (noise.width - size)) | 0,
            y = (Math.random() * (noise.height - size)) | 0;
        g.globalAlpha = 4 / size;
        g.drawImage(noise, x, y, size, size, 0, 0, canvas.width, canvas.height);
    }

    g.restore();
    return canvas;
}

var canvas = document.getElementById('myCanvas');
perlinNoise(canvas);
// var context = canvas.getContext('2d');
// draw_clean_line(context, 100, 150, 450, 50)
// draw_line(context, 100, 150, 450, 50)
