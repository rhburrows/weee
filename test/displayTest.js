module("display", {
  setup: function() {
    display = new $.fn.weee.Display(100, 100);

    // stupid setup. Need to clean this up
    // Make sure no lines wrap
    display.lineLengths = [10, 10, 10, 10, 10, 10];
  }
});

var display;

test('weee:click event', function(){
  var click = $.Event('click');
  click.pageX = $(display.canvas).position().left + display.padding + 10;
  click.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('weee:click', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(click);
});

test('weee:mousedown event', function(){
  var mousedown = $.Event('mousedown');
  mousedown.pageX = $(display.canvas).position().left + display.padding + 10;
  mousedown.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('weee:mousedown', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(mousedown);
});

test('weee:mouseup event', function(){
  var mouseup = $.Event('mouseup');
  mouseup.pageX = $(display.canvas).position().left + display.padding + 10;
  mouseup.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('weee:mouseup', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(mouseup);
});

test('weee:mouseup event', function(){
  var mousemove = $.Event('mousemove');
  mousemove.pageX = $(display.canvas).position().left + display.padding + 10;
  mousemove.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('weee:mousemove', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(mousemove);
});

test('faces', function(){
  var face = {
    color : 'yellow'
  };
  var defaultFace = display.defaultFace;

  display.setFace(5, 10, face);

  equals(display.faceForPosition(0).color, defaultFace.color,
         "It returns the default if the face hasn't been set");
  equals(display.faceForPosition(4).color, defaultFace.color,
         "Outside the boundaries don't count as the set face");
  equals(display.faceForPosition(5).color, face.color,
         "It counts as the face at the first boundary");
  equals(display.faceForPosition(7).color, face.color,
         "It counts as the face in the middle");
  equals(display.faceForPosition(10).color, face.color,
         "It counts as the face at the second boundary");

  var newFace = {
    color : 'green'
  };
  display.setFace(6, 8, newFace);
  equals(display.faceForPosition(5).color, face.color,
         "It doesn't override the old set face outside the boundaries");
  equals(display.faceForPosition(6).color, newFace.color,
         "It counts as the face at the first boundary");
  equals(display.faceForPosition(7).color, newFace.color,
         "It counts as the face in the middle");
  equals(display.faceForPosition(8).color, newFace.color,
         "It counts as the face at the second boundary");
  equals(display.faceForPosition(15).color, defaultFace.color,
         "It's still the default after the set faces");
});

test('clearFace', function(){
  var face = {
    color : 'blue'
  };
  var defaultFace = display.defaultFace;

  display.setFace(5, 10, face);

  equals(display.faceForPosition(7).color, face.color,
         "It set the face properly");

  display.clearFace(7, 9);

  equals(display.faceForPosition(6).color, face.color,
         "It doesn't clear before the starting point");
  equals(display.faceForPosition(7).color, defaultFace.color,
         "It sets from the starting point back to deafult");
  equals(display.faceForPosition(9).color, defaultFace.color,
         "It sets at the ending point back to deafult");
  equals(display.faceForPosition(10).color, face.color,
         "It doesn't clear after the ending point");
});