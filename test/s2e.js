module("S2E", {
  setup: function() {
    $('#editor').s2e({
      initialText : ""
    });
    canvas = $('#editor');
    editor = canvas.data('s2e.editor');
  }
});

var canvas;
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

test("bindKey", function(){
  var callCountOne = 0;
  editor.bindKey('s', function(editor) {
    callCountOne++;
  });
  var keyPressS = jQuery.Event('keydown');
  keyPressS.keyCode = 83; // 83 is the keyCode for 's'
  canvas.trigger(keyPressS);
  equals(callCountOne, 1, "It handles basic alpha keys");

  var callCountTwo = 0;
  editor.bindKey('S-s', function(editor) {
    callCountTwo++;
  });
  var keyPressShiftS = jQuery.Event('keydown');
  keyPressShiftS.keyCode = 83;
  keyPressShiftS.shiftKey = true;
  canvas.trigger(keyPressShiftS);
  equals(callCountTwo, 1, "It handles the shift modifier");

  var callCountThree = 0;
  editor.bindKey('C-s', function(editor) {
    callCountThree++;
  });
  var keyPressCtrlS = jQuery.Event('keydown');
  keyPressCtrlS.keyCode = 83;
  keyPressCtrlS.ctrlKey = true;
  canvas.trigger(keyPressCtrlS);
  equals(callCountThree, 1, "It handles the control modifier");

  var callCountFour = 0;
  editor.bindKey('A-s', function(editor){
    callCountFour++;
  });
  var keyPressAltS = jQuery.Event('keydown');
  keyPressAltS.keyCode = 83;
  keyPressAltS.altKey = true;
  canvas.trigger(keyPressAltS);
  equals(callCountFour, 1, "It handles the alt modifier");

  var callCountFive = 0;
  editor.bindKey('M-s', function(editor){
    callCountFive++;
  });
  var keyPressMetaS = jQuery.Event('keydown');
  keyPressMetaS.keyCode = 83;
  keyPressMetaS.metaKey = true;
  canvas.trigger(keyPressMetaS);
  equals(callCountFive, 1, "It handles the meta modifier");

  var callCountSix = 0;
  editor.bindKey('C-M-s', function(editor){
    callCountSix++;
  });
  var keyPressCtrlMetaS = jQuery.Event('keydown');
  keyPressCtrlMetaS.keyCode = 83;
  keyPressCtrlMetaS.ctrlKey = true;
  keyPressCtrlMetaS.metaKey = true;
  canvas.trigger(keyPressCtrlMetaS);
  equals(callCountSix, 1, "It handles multiple modifiers");

  canvas.trigger(keyPressS);
  equals(callCountOne, 2, "Keybindings don't step on each other");

  canvas.trigger(keyPressShiftS);
  equals(callCountTwo, 2, "Keybindings don't step on each other");

  canvas.trigger(keyPressCtrlS);
  equals(callCountThree, 2, "Keybindings don't step on each other");

  canvas.trigger(keyPressAltS);
  equals(callCountFour, 2, "Keybindings don't step on each other");

  canvas.trigger(keyPressMetaS);
  equals(callCountFive, 2, "Keybindings don't step on each other");

  canvas.trigger(keyPressCtrlMetaS);
  equals(callCountSix, 2, "Keybindings don't step on each other");
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