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
  textarea.bind('s2e:click', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  $('canvas').click();
});

test("s2e:mousedown is sent to the textarea", function(){
  textarea.bind('s2e:mousedown', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  $('canvas').mousedown();
});

test("s2e:mouseup is sent to the textarea", function(){
  textarea.bind('s2e:mouseup', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  $('canvas').mouseup();
});

test("s2e:contentsUpdate is sent to the textarea", function(){
  textarea.bind('s2e:contentsUpdate', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  editor.insertString("Hello!");
});

test("s2e:movePoint is sent to the textarea", function(){
  editor.insertString("Hello!");

  textarea.bind('s2e:movePoint', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  editor.movePoint(-2);
});