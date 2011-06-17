module("display", {
  setup: function() {
    var textarea = $('#editor');
    display = new $.fn.s2e.config.Display(textarea);

    // Stupid setup. Need to clean this up
    // Make sure no lines wrap
    display.lineLengths = [10, 10, 10, 10, 10, 10];
  }
});

var display;
var editor;

test('onclick', function(){
  equals($('#editor:focus').size(), 0,
         "The textarea should not be focused to start");

  $(display.canvas).click();
  equals($('#editor:focus').size(), 1,
         "The textarea should be focused after clicking on the canvas");
});

test('s2e:click event', function(){
  var click = $.Event('click');
  click.pageX = $(display.canvas).position().left + display.padding + 10;
  click.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('s2e:click', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(click);
});

test('s2e:mousedown event', function(){
  var mousedown = $.Event('mousedown');
  mousedown.pageX = $(display.canvas).position().left + display.padding + 10;
  mousedown.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('s2e:mousedown', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(mousedown);
});

test('s2e:mouseup event', function(){
  var mouseup = $.Event('mouseup');
  mouseup.pageX = $(display.canvas).position().left + display.padding + 10;
  mouseup.pageY = $(display.canvas).position().top + 10;

  expect(3);
  $(display).bind('s2e:mouseup', function(ev){
    equals(ev.position, 0,
           "It converts the coordinates to a position in the buffer");
    equals(ev.pageX, $(display.canvas).position().left + display.padding + 10,
          "It provides access to the actual click position");
    equals(ev.pageY, $(display.canvas).position().top + 10,
          "It provides access to the actual click position");
  });

  $(display.canvas).trigger(mouseup);
});
