module("editor", {
  setup: function() {
    editor = new $.fn.s2e.config.Editor();
  }
});

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

test("s2e:contentsUpdate event", function(){
  $(editor).bind('s2e:contentsUpdate', function(e){
    ok('s2e:contentsUpdate event was triggered');
  });

  expect(4);
  // Each of the below triggers the event incrementing the expect
  editor.insertChar('A');
  editor.insertString('Hello!');
  editor.backspace();
  editor.delChar();
});

test("s2e:movePoint event", function(){
  $(editor).bind('s2e:movePoint', function(e){
    ok('s2e:movePoint event was triggered');
  });

  expect(7);
  // Each of the below triggers the event incrementing the expect
  editor.pointForward();
  editor.pointBackward();
  editor.movePoint(10);
  editor.movePointTo(0);
  editor.endOfLine();
  editor.beginningOfLine();
  editor.gotoLine();
});