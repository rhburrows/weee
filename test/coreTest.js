module("core", {
  setup: function() {
    editor = $('#editor').weee().get(0);
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

test("weee:click is sent to the textarea", function(){
  textarea.bind('weee:click', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  $('canvas').click();
});

test("weee:mousedown is sent to the textarea", function(){
  textarea.bind('weee:mousedown', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  $('canvas').mousedown();
});

test("weee:mouseup is sent to the textarea", function(){
  textarea.bind('weee:mouseup', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  $('canvas').mouseup();
});

test("weee:contentsUpdate is sent to the textarea", function(){
  textarea.bind('weee:contentsUpdate', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  editor.insertString("Hello!");
});

test("weee:movePoint is sent to the textarea", function(){
  editor.insertString("Hello!");

  textarea.bind('weee:movePoint', function(e){
    equals(e.editor, editor, "It provides access to the editor");
    ok(e.display, "It provides access to the display");
  });

  expect(2);
  editor.movePoint(-2);
});