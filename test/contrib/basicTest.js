module("s2e.basic", {
  setup : function() {
    $('#editor').s2e({
      initialText : "This is just some sample text.\n" +
                    "It should help when testing the various functions.\n" +
                    "Blah blah blah!\n"
    });
    editor = $('#editor').data('s2e.editor');
  }
});

var editor;

test("endOfLine", function(){
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

test("positionToLine", function(){
  editor.movePoint(34);

  equals(editor.positionToLine(0), 1,
        "It works on the first character of the buffer.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToLine(30), 1,
        "It works on the last character of the first line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToLine(31), 2,
        "It works on the first character of the next line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToLine(81), 2,
        "It works on the last character of the next line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToLine(82), 3,
        "It works on the first character of the last line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToLine(97), 3,
        "It works on the last character of the last line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToLine(98), 4,
        "It works on the last, blank line");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
});

test("positionToColumn", function() {
  editor.movePoint(34);

  equals(editor.positionToColumn(0), 1,
        "It works on the first character of the buffer.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToColumn(30), 31,
        "It works on the last character of the first line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToColumn(31), 1,
        "It works on the first character of the next line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToColumn(81), 51,
        "It works on the last character of the next line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToColumn(82), 1,
        "It works on the first character of the last line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToColumn(97), 16,
        "It works on the last character of the last line.");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
  equals(editor.positionToColumn(98), 1,
        "It works on the last, blank line");
  equals(editor.pointPosition(), 34, "It doesn't move the point");
});

test("gotoLine", function() {
  editor.gotoLine(3);
  equals(editor.pointPosition(), 82,
         "It goes to the first character of the specified line");

  editor.gotoLine(1);
  equals(editor.pointPosition(), 0, "It works backwards");

  editor.gotoLine(1000);
  equals(editor.pointPosition(), 98,
        "If the line specified is too big it goes to the last line");
});