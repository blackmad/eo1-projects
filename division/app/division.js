// TODO - center in canvas

// Based on 'JPEG Raster' by Jonathan Puckey:
// http://www.flickr.com/photos/puckey/3179779686/in/photostream/

// Create a raster item using the image with id='mona'
var raster = null;

var lastPos = null;

function moveHandler(event) {
    // if (lastPos.getDistance(event.point) < 2)
    //     return;
    // lastPos = event.point;

    var size = this.bounds.size.clone();
    var isLandscape = size.width > size.height;

    // If the path is in landscape orientation, we're going to
    // split the path horizontally, otherwise vertically:

    size /= isLandscape ? [2, 1] : [1, 2];

    if (size.floor().width <= 1 || size.floor().height <= 1) {
      return;
    }

    var path = new Path.Rectangle({
        point: this.bounds.topLeft.floor(),
        size: size.ceil(),
        onMouseMove: moveHandler
    });
    path.fillColor = raster.getAverageColor(path);

    var path = new Path.Rectangle({
        point: isLandscape
            ? this.bounds.topCenter.ceil()
            : this.bounds.leftCenter.ceil(),
        size: size.floor(),
        onMouseMove: moveHandler
    });
    path.fillColor = raster.getAverageColor(path);

    this.remove();
}


function onResize(event) {
    project.activeLayer.removeChildren();

    // Transform the raster so that it fills the bounding rectangle
    // of the view:
    raster = new Raster('mona');
    // Make the raster invisible:
    raster.visible = false;
    lastPos = view.center;

    var img_height = document.getElementById('mona').height;
    var img_width = document.getElementById('mona').width;

    var final_height = 0;
    var final_width = 0;
    if (img_height > img_width) {
      final_height = window.innerHeight;
      final_width = img_width * (final_height / img_height)
    } else {
      final_width = window.innerWidth;
      final_height = img_height * (final_width / img_width)
    }

    raster.fitBounds(new Rectangle({ point: [0, 0], size: [final_width, final_height]}), true);

    // Create a path that fills the view, and fill it with
    // the average color of the raster:
    new Path.Rectangle({
        rectangle: new Rectangle({ point: [0, 0], size: [final_width, final_height]}),
        fillColor: raster.getAverageColor(view.bounds),
        onMouseMove: moveHandler
    });

    function clickAround() {
      var x = Math.random() * final_width;
      var y = Math.random() * final_height;
      var p = new Point(x, y);
      var hit = project.hitTest(p)
      _.bind(moveHandler, hit.item)();
      view.update();
      setTimeout(clickAround, 2500);
    }

    // _.times(3000, clickAround)
    // view.update();
    setTimeout(clickAround, 2500);
}