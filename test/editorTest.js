module("editor", {
  setup: function() {
    display = {};
    editor = new $.fn.s2e.Editor("", display);
  }
});

var editor;
var display;

function countEvent(event) {
  $(editor).bind(event, function(){
    ok(event + " called!");
  });
}

test("insertChar", function(){
  editor.insertChar('a');
  equals(editor.contents(), "a", "it adds the character");

  editor.insertChar('b');
  equals(editor.contents(), "ab", "it doesn't overwrite the current contents");

  editor.pointBackward();
  editor.insertChar('c');
  equals(editor.contents(), "acb", "it is inserted directly after the point");
});

test("insertChar events", function(){
  countEvent('s2e:contentsUpdate');

  expect(2);
  editor.insertChar('a');
  editor.insertChar('b');
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

test("insertString events", function(){
  countEvent('s2e:contentsUpdate');

  expect(2);
  editor.insertString("line 1\n");
  editor.insertString("line 2\n");
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

test("backspace events", function(){
  editor.insertString('Hi');
  countEvent('s2e:contentsUpdate');

  expect(2);
  editor.backspace();
  editor.backspace();
  editor.backspace();
});

test("delChar", function() {
  editor.insertString("this is a string");
  editor.movePointTo(0);

  editor.delChar();
  equals("h", editor.charAtPoint(),
        "It deletes the character currently at the point");

  editor.delChar();
  equals("i", editor.charAtPoint(),
        "It works even if called multiple times");

  editor.movePoint(5);
  editor.delChar();
  equals("a", editor.charAtPoint(),
        "It doesn't have to be at the beginning of the buffer");

  equals("is isa string", editor.contents(), "It alters the editor's contents");
});

test("delChar events", function(){
  editor.insertString("Hi");
  editor.movePointTo(0);

  countEvent('s2e:contentsUpdate');

  expect(2);
  editor.delChar();
  editor.delChar();
  editor.delChar();
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

test("pointForward events", function(){
  editor.insertString("Hi");
  editor.movePoint(-2);

  expect(2);
  countEvent('s2e:movePoint');

  editor.pointForward();
  editor.pointForward();
  // This third one won't trigger an event because its already at the end
  editor.pointForward();
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

test("pointBackward events", function(){
  editor.insertString("Hi");

  countEvent('s2e:movePoint');

  expect(2);
  editor.pointBackward();
  editor.pointBackward();
  editor.pointBackward();
});

test("endOfLine", function(){
  var s = "This is just some sample text.\n" +
          "It should help when testing the various functions.\n" +
          "Blah blah blah!\n";
  editor.insertString(s);
  editor.movePointTo(0);

  editor.endOfLine();
  equals(editor.pointPosition(), 30,
         "It moves the point to the end of the line");

  editor.pointForward();
  editor.endOfLine();
  equals(editor.pointPosition(), 81,
        "It works on the second line also");

  editor.endOfLine();
  equals(editor.pointPosition(), 81,
        "Calling endOfLine() while at the end of the line does nothing");
});

test("endOfLine events", function(){
  editor.insertString("text\ntext");
  editor.movePointTo(0);

  countEvent('s2e:movePoint');

  expect(1);
  editor.endOfLine();
  editor.endOfLine();
});

test("beginningOfLine", function(){
  var s = "This is just some sample text.\n" +
          "It should help when testing the various functions.\n" +
          "Blah blah blah!\n";
  editor.insertString(s);
  editor.movePointTo(0);

  editor.beginningOfLine();
  equals(editor.pointPosition(), 0,
         "It doesn't move the point if its already at the beginning");

  editor.movePoint(10);
  editor.beginningOfLine();
  equals(editor.pointPosition(), 0,
        "It moves the point from the middle of the line to the beginning");

  editor.movePoint(80);
  editor.beginningOfLine();
  equals(editor.pointPosition(), 31,
        "It works on the second line too");
});

test("beginningOfLine", function(){
  editor.insertString("text\ntext");

  countEvent('s2e:movePoint');

  expect(1);
  editor.beginningOfLine();
  editor.beginningOfLine();
});

test("nextLine", function(){
  var s = "Line One\n" +
          "Line Two is longer\n" +
          "Line Three\n";
  editor.insertString(s);
  editor.movePointTo(0);

  editor.nextLine();
  equals(editor.pointPosition(), 9, "It moves the point to the next line");

  editor.endOfLine();
  editor.nextLine();
  equals(editor.pointPosition(), 38,
        "If the next line is shorter it puts it at the end");

  editor.nextLine();
  equals(editor.pointPosition(), 39, "It moves to empty lines");

  editor.nextLine();
  equals(editor.pointPosition(), 39, "It does nothing on the last line");

  editor.insertString('hi');
  editor.movePoint(-2);
  editor.nextLine();
  equals(editor.pointPosition(), 39, "It does nothing on the last line");
});

test("nextLine", function(){
  editor.insertString("text\ntext\ntext");
  editor.movePointTo(0);

  countEvent('s2e:movePoint');

  expect(2);
  editor.nextLine();
  editor.nextLine();
  editor.nextLine();
});

test("previousLine", function(){
  var s = "Line One\n" +
          "Line Two is longer\n" +
          "Line Three\n";
  editor.insertString(s);

  editor.previousLine();
  equals(editor.pointPosition(), 28,
         "It moves the point to the previous line");

  editor.endOfLine();
  editor.previousLine();
  equals(editor.pointPosition(), 19,
         "It keeps the position from the line before");

  editor.endOfLine();
  editor.previousLine();
  equals(editor.pointPosition(), 8,
         "If the previous line is shorter it puts the point at the end");

  editor.previousLine();
  equals(editor.pointPosition(), 8,
         "It does nothing if on the first line");
});

test("previousLine", function(){
  editor.insertString("text\ntext\ntext");

  countEvent('s2e:movePoint');

  expect(2);
  editor.previousLine();
  editor.previousLine();
  editor.previousLine();
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

test("movePoint events", function(){
  editor.insertString("Test");

  countEvent('s2e:movePoint');

  expect(2);
  editor.movePoint(-2);
  editor.movePoint(2);
  editor.movePoint(1);
});

test("movePointTo", function(){
  editor.insertString("Sample Text");

  editor.movePointTo(0);
  equals(editor.pointPosition(), 0, "It moves the point to the specified location");

  editor.movePointTo(5);
  equals(editor.pointPosition(), 5, "It works both directions");

  editor.movePointTo(-19);
  equals(editor.pointPosition(), 0,
         "It starts at the first character if given a negative position");

  editor.movePointTo(120);
  equals(editor.pointPosition(), 11,
        "It stops at the end if given a position greater than the buffer size");
});

test("movePointTo events", function(){
  editor.insertString("Sample");

  countEvent('s2e:movePoint');

  expect(2);
  editor.movePointTo(2);
  editor.movePointTo(0);
  editor.movePointTo(0);
});

test("gotoLine", function() {
  var s = "This is just some sample text.\n" +
          "It should help when testing the various functions.\n" +
          "Blah blah blah!\n";
  editor.insertString(s);
  editor.movePointTo(0);

  editor.gotoLine(3);
  equals(editor.pointPosition(), 82,
         "It goes to the first character of the specified line");

  editor.gotoLine(1);
  equals(editor.pointPosition(), 0, "It works backwards");

  editor.gotoLine(1000);
  equals(editor.pointPosition(), 98,
        "If the line specified is too big it goes to the last line");
});

test("gotoLine", function(){
  editor.insertString("text\ntext");

  countEvent('s2e:movePoint');

  expect(2);
  editor.gotoLine(1);
  editor.gotoLine(2);
  editor.gotoLine(2);
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

test("previousChar", function(){
  editor.insertString("Hi");

  equals(editor.previousChar(), "i",
         "It returns the character immediately before the point");

  editor.pointBackward();
  equals(editor.previousChar(), "H");

  editor.pointBackward();
  equals(editor.previousChar(), "",
         "It returns an empty string if at the beginning of the buffer");
});

test("s2e:movePoint event", function(){
  editor.insertString("Welcome!");
  editor.movePointTo(0);

  $(editor).bind('s2e:movePoint', function(e){
    equals(e.pointFrom, 0, "It has the original point position");
    equals(e.pointTo, 5, "It has the new point position");
  });

  expect(2);
  editor.movePointTo(5);
});

test("lineCount", function(){
  equals(editor.lineCount(), 0, "It works on empty editors");

  editor.insertString("H");
  equals(editor.lineCount(), 1, "It works if there's just one line");

  editor.insertString("ello\nThere\nFriend.");

  equals(editor.lineCount(), 3, "It counts the number of lines with multiple");
});

test("slice", function(){
  editor.insertString("Hello there");

  equals(editor.slice(1,4), "ell",
         "It works if the point is after the slice");

  editor.movePointTo(0);

  equals(editor.slice(1,4), "ell",
         "It works if the point is before the slice");

  editor.movePointTo(2);

  equals(editor.slice(1,4), "ell",
         "It works if the point is in the middle of the slice");
});

test("display events", function(){
  $(editor).bind('s2e:click', function(e){
    ok("Display events are bubbled through the editor");
  });

  expect(1);
  $(display).trigger('s2e:click');
});