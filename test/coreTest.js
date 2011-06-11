module("s2e.core", {
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

test("bindKey", function(){
  var callCountOne = 0;
  editor.bindKey('s', function(editor) {
    callCountOne++;
  });
  var keyPressS = jQuery.Event('keydown');
  keyPressS.which = 83; // 83 is the which for 's'
  textarea.trigger(keyPressS);
  equals(callCountOne, 1, "It handles basic alpha keys");

  var callCountTwo = 0;
  editor.bindKey('S-s', function(editor) {
    callCountTwo++;
  });
  var keyPressShiftS = jQuery.Event('keydown');
  keyPressShiftS.which = 83;
  keyPressShiftS.shiftKey = true;
  textarea.trigger(keyPressShiftS);
  equals(callCountTwo, 1, "It handles the shift modifier");

  var callCountThree = 0;
  editor.bindKey('C-s', function(editor) {
    callCountThree++;
  });
  var keyPressCtrlS = jQuery.Event('keydown');
  keyPressCtrlS.which = 83;
  keyPressCtrlS.ctrlKey = true;
  textarea.trigger(keyPressCtrlS);
  equals(callCountThree, 1, "It handles the control modifier");

  var callCountFour = 0;
  editor.bindKey('A-s', function(editor){
    callCountFour++;
  });
  var keyPressAltS = jQuery.Event('keydown');
  keyPressAltS.which = 83;
  keyPressAltS.altKey = true;
  textarea.trigger(keyPressAltS);
  equals(callCountFour, 1, "It handles the alt modifier");

  var callCountFive = 0;
  editor.bindKey('C-A-s', function(editor){
    callCountFive++;
  });
  var keyPressCtrlAltS = jQuery.Event('keydown');
  keyPressCtrlAltS.which = 83;
  keyPressCtrlAltS.ctrlKey = true;
  keyPressCtrlAltS.altKey = true;
  textarea.trigger(keyPressCtrlAltS);
  equals(callCountFive, 1, "It handles multiple modifiers");

  textarea.trigger(keyPressS);
  equals(callCountOne, 2, "Keybindings don't step on each other");

  textarea.trigger(keyPressShiftS);
  equals(callCountTwo, 2, "Keybindings don't step on each other");

  textarea.trigger(keyPressCtrlS);
  equals(callCountThree, 2, "Keybindings don't step on each other");

  textarea.trigger(keyPressAltS);
  equals(callCountFour, 2, "Keybindings don't step on each other");

  textarea.trigger(keyPressCtrlAltS);
  equals(callCountFive, 2, "Keybindings don't step on each other");
});

function testKeyString(keyString, which, name) {
  test(keyString + " matches " + name, function() {
    var callCount = 0;
    editor.bindKey(keyString, function(editor, ev){
      callCount++;
    });
    var keyPress = jQuery.Event('keydown');
    keyPress.which = which;
    textarea.trigger(keyPress);
    equals(callCount, 1,
           "It recognizes '" + keyString + "' as the " + name + " key");

    var modCallCount = 0;
    editor.bindKey('C-' + keyString, function(editor, ev){
      modCallCount++;
    });
    var modKeyPress = jQuery.Event('keydown');
    modKeyPress.which = which;
    modKeyPress.ctrlKey = true;
    textarea.trigger(modKeyPress);
    equals(modCallCount, 1,
          "It recognizes '" + keyString + "' with modifiers also");
  });
}

testKeyString('<LEFT>', 37, "left arrow");
testKeyString('<UP>', 38, "up arrow");
testKeyString('<RIGHT>', 39, "right arrow");
testKeyString('<DOWN>', 40, "down arrow");
testKeyString('<TAB>', 9, "tab");
testKeyString('<SPACE>', 32, "spacebar");
testKeyString('<BACKSPACE>', 8, "backspace");
testKeyString('<ENTER>', 13, "enter");
testKeyString('<ESC>', 27, "escape");
testKeyString('<DELETE>', 46, "delete");
testKeyString('<F1>', 112, "F1");
testKeyString('<F2>', 113, "F2");
testKeyString('<F3>', 114, "F3");
testKeyString('<F4>', 115, "F4");
testKeyString('<F5>', 116, "F5");
testKeyString('<F6>', 117, "F6");
testKeyString('<F7>', 118, "F7");
testKeyString('<F8>', 119, "F8");
testKeyString('<F9>', 120, "F9");
testKeyString('<F10>', 121, "F10");
testKeyString('<F11>', 122, "F11");
testKeyString('<F12>', 123, "F12");

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

test("afterInsert", function() {
  var callbackCountOne = 0;
  editor.afterInsert(function(c){
    callbackCountOne++;
  });
  editor.insertChar('a');
  equals(callbackCountOne, 1, "It calls the callbacks after insertChar");

  var callbackCountTwo = 0;
  editor.afterInsert(function(c){
    callbackCountTwo++;
  });
  editor.insertChar('b');
  equals(callbackCountTwo, 1, "It works with multiple callbacks");
  equals(callbackCountOne, 2, "It doesn't overwrite existing callbacks");

  editor.insertString('cdefg');
  equals(callbackCountOne, 7, "It is called multiple times with insertString");
  equals(callbackCountTwo, 6, "It is called multiple times with insertString");
});

test("textarea-editor link", function(){
  editor.insertString("Some Text");

  equals(textarea.val(), "Some Text",
        "It keeps the backing textarea synced to the canvas");
});