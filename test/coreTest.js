module("core", {
  setup: function() {
    editor = $('#editor').s2e().get(0);
    textarea = $('#editor');
  }
});

var textarea;
var editor;

test("textarea-editor link", function(){
  editor.insertString("Some Text");

  equals(textarea.val(), "Some Text",
        "It keeps the backing textarea synced to the canvas");
});

test("click", function(){
  equals($('#editor:focus').size(), 0,
         "The textarea should not be focused to start");

  $("canvas").click();
  equals($('#editor:focus').size(), 1,
         "The textarea should be focused after clicking on the canvas");
});

test("s2e:click is sent to the textarea", function(){
  textarea.bind('s2e:click', function(){
    ok("s2e:click called!");
  });

  expect(1);
  $('canvas').click();
});

test("s2e:mousedown is sent to the textarea", function(){
  textarea.bind('s2e:mousedown', function(){
    ok("s2e:mousedown called!");
  });

  expect(1);
  $('canvas').mousedown();
});

test("s2e:mouseup is sent to the textarea", function(){
  textarea.bind('s2e:mouseup', function(){
    ok("s2e:mouseup called!");
  });

  expect(1);
  $('canvas').mouseup();
});

test("s2e:contentsUpdate is sent to the textarea", function(){
  textarea.bind('s2e:contentsUpdate', function(){
    ok("s2e:contentsUpdate called!");
  });

  expect(1);
  editor.insertString("Hello!");
});

test("s2e:movePoint is sent to the textarea", function(){
  editor.insertString("Hello!");

  textarea.bind('s2e:movePoint', function(){
    ok("s2e:contentsUpdate called!");
  });

  expect(1);
  editor.movePoint(-2);
});