module("core", {
  setup: function() {
    $('#editor').s2e();
    textarea = $('#editor');
    editor = textarea.data('s2e.editor');
  }
});

var textarea;
var editor;

test("insertChar", function(){
  editor.insertChar('a');
  equals(editor.contents(), "a", "it adds the character");

  editor.insertChar('b');
  equals(editor.contents(), "ab", "it doesn't overwrite the current contents");

  editor.pointBackward();
  editor.insertChar('c');
  equals(editor.contents(), "acb", "it is inserted directly after the point");
});

test("insertString", function(){
  editor.insertString("Hello");
  equals(editor.contents(), "Hello", "it adds the string");

  editor.insertString(" world!");
  equals(editor.contents(), "Hello world!",
         "it doesn't overwrite current contents");

  editor.movePoint(-6);
  editor.insertString("cruel ");
  equals(editor.contents(), "Hello cruel world!",
        "it is inserted directly after the point");
});

test("backspace", function(){
  editor.insertString("Teswtz");

  editor.backspace();
  equals(editor.contents(), "Teswt", "it deletes a character");

  editor.pointBackward();
  editor.backspace();
  equals(editor.contents(), "Test",
         "it remove the character directly before the point");
});

test("pointForward", function(){
  editor.insertString("Hi");
  editor.movePoint(-2);

  editor.pointForward();
  equals(editor.pointPosition(), 1, "It advances the point");

  editor.pointForward();
  equals(editor.pointPosition(), 2, "It works multiple times");

  editor.pointForward();
  equals(editor.pointPosition(), 2,
         "It does nothing if already at the end of the buffer");
});

test("pointBackward", function(){
  editor.insertString("Hi");

  editor.pointBackward();
  equals(editor.pointPosition(), 1, "It moves the point backward 1");

  editor.pointBackward();
  equals(editor.pointPosition(), 0, "It works multiple times");

  editor.pointBackward();
  equals(editor.pointPosition(), 0,
         "It does nothing if already at the beginning of the buffer");
});

test("movePoint", function(){
  editor.insertString("Sample Text");

  editor.movePoint(-11);
  equals(editor.pointPosition(), 0, "It moves the point the specified amount");

  editor.movePoint(6);
  equals(editor.pointPosition(), 6, "It works both directions");

  editor.movePoint(150);
  equals(editor.pointPosition(), 11,
         "It stops at the end if it would move past the end of the buffer");

  editor.movePoint(-99);
  equals(editor.pointPosition(), 0,
        "It stops at the beginning if it would move past the start");
});

test("charAtPoint", function(){
  editor.insertString("Hi");

  equals(editor.charAtPoint(), "",
         "It returns an empty string if at the end of the buffer");

  editor.pointBackward();
  equals(editor.charAtPoint(), "i",
         "It returns the character immediately after the point");

  editor.pointBackward();
  equals(editor.charAtPoint(), "H");
});

test("textarea-editor link", function(){
  editor.insertString("Some Text");

  equals(textarea.val(), "Some Text",
        "It keeps the backing textarea synced to the canvas");
});

test("afterUpdate", function() {
  var callbackCountOne = 0;
  editor.afterUpdate(function(c){
    callbackCountOne++;
  });
  editor.insertChar('a');
  equals(callbackCountOne, 1, "It calls the callbacks after insertChar");

  var callbackCountTwo = 0;
  editor.afterUpdate(function(c){
    callbackCountTwo++;
  });
  editor.insertChar('b');
  equals(callbackCountTwo, 1, "It works with multiple callbacks");
  equals(callbackCountOne, 2, "It doesn't overwrite existing callbacks");

  editor.insertString('cdefg');
  equals(callbackCountOne, 7, "It is called multiple times with insertString");
  equals(callbackCountTwo, 6, "It is called multiple times with insertString");

  editor.backspace();
  equals(callbackCountOne, 8, "It is called with backspace");
  equals(callbackCountTwo, 7, "It is called with backspace");
});