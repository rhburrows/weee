module("input", {
  setup: function() {
    var nullEditor = {};
    inputManager = new $.fn.s2e.defaults['inputManager'](nullEditor);
    inputHandler = inputManager.handler();
  }
});

var inputManager;
var inputHandler;

test("bindKey", function(){
  var callCountOne = 0;
  inputManager.bindKey('s', function(editor) {
    callCountOne++;
  });
  var keyPressS = jQuery.Event('keydown');
  keyPressS.which = 83; // 83 is the which for 's'
  inputHandler(keyPressS);
  equals(callCountOne, 1, "It handles basic alpha keys");

  var callCountTwo = 0;
  inputManager.bindKey('S-s', function(editor) {
    callCountTwo++;
  });
  var keyPressShiftS = jQuery.Event('keydown');
  keyPressShiftS.which = 83;
  keyPressShiftS.shiftKey = true;
  inputHandler(keyPressShiftS);
  equals(callCountTwo, 1, "It handles the shift modifier");

  var callCountThree = 0;
  inputManager.bindKey('C-s', function(editor) {
    callCountThree++;
  });
  var keyPressCtrlS = jQuery.Event('keydown');
  keyPressCtrlS.which = 83;
  keyPressCtrlS.ctrlKey = true;
  inputHandler(keyPressCtrlS);
  equals(callCountThree, 1, "It handles the control modifier");

  var callCountFour = 0;
  inputManager.bindKey('A-s', function(editor){
    callCountFour++;
  });
  var keyPressAltS = jQuery.Event('keydown');
  keyPressAltS.which = 83;
  keyPressAltS.altKey = true;
  inputHandler(keyPressAltS);
  equals(callCountFour, 1, "It handles the alt modifier");

  var callCountFive = 0;
  inputManager.bindKey('C-A-s', function(editor){
    callCountFive++;
  });
  var keyPressCtrlAltS = jQuery.Event('keydown');
  keyPressCtrlAltS.which = 83;
  keyPressCtrlAltS.ctrlKey = true;
  keyPressCtrlAltS.altKey = true;
  inputHandler(keyPressCtrlAltS);
  equals(callCountFive, 1, "It handles multiple modifiers");

  inputHandler(keyPressS);
  equals(callCountOne, 2, "Keybindings don't step on each other");

  inputHandler(keyPressShiftS);
  equals(callCountTwo, 2, "Keybindings don't step on each other");

  inputHandler(keyPressCtrlS);
  equals(callCountThree, 2, "Keybindings don't step on each other");

  inputHandler(keyPressAltS);
  equals(callCountFour, 2, "Keybindings don't step on each other");

  inputHandler(keyPressCtrlAltS);
  equals(callCountFive, 2, "Keybindings don't step on each other");
});

function testKeyString(keyString, which, name) {
  test(keyString + " matches " + name, function() {
    var callCount = 0;
    inputManager.bindKey(keyString, function(editor, ev){
      callCount++;
    });
    var keyPress = jQuery.Event('keydown');
    keyPress.which = which;
    inputHandler(keyPress);
    equals(callCount, 1,
           "It recognizes '" + keyString + "' as the " + name + " key");

    var modCallCount = 0;
    inputManager.bindKey('C-' + keyString, function(editor, ev){
      modCallCount++;
    });
    var modKeyPress = jQuery.Event('keydown');
    modKeyPress.which = which;
    modKeyPress.ctrlKey = true;
    inputHandler(modKeyPress);
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