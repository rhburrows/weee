module("extras/selection", {
  setup: function() {
    editor = $('#editor').s2e().get(0);
  }
});

var editor;

test("toggleSelection", function(){
  equals(editor.selectionActive, false, "It starts inactive");

  editor.toggleSelection();
  equals(editor.selectionActive, true, "Toggling makes it active");

  editor.toggleSelection();
  equals(editor.selectionActive, false, "Toggling again makes it inactive");
});

test("selectionStart", function(){
  equals(editor.selectionStart(), null,
         "Its null when the selection isn't active");

  editor.insertString("Testing selection");
  editor.movePointTo(2);
  editor.toggleSelection();

  equals(editor.selectionStart(), 2,
         "When the selection is active it marks where the selection began");

  editor.movePoint(5);
  equals(editor.selectionStart(), 2,
         "If the point moves it is the earlier point");

  editor.movePoint(-7);
  equals(editor.selectionStart(), 0,
         "It still works if the point moves before the starting point");

  editor.toggleSelection();
  equals(editor.selectionStart(), null,
         "Its cleared when the selection is toggled again");
});

test("selectionEnd", function(){
  equals(editor.selectionEnd(), null,
         "Its null when the selection isn't active");

  editor.insertString("Testing selection");
  editor.movePointTo(2);
  editor.toggleSelection();

  equals(editor.selectionEnd(), 2,
         "When the selection is active it marks where the selection ends");

  editor.movePoint(5);
  equals(editor.selectionEnd(), 7,
         "If the point is moved the end matches the end of the selection");

  editor.movePoint(-7);
  equals(editor.selectionEnd(), 2,
         "Its the later of the two points on the selection");

  editor.toggleSelection();
  equals(editor.selectionEnd(), null,
         "Its cleared when the selection is toggled again");
});

test("selectedText", function(){
  equals(editor.selectedText(), null,
         "Its null when the selection isn't active");

  editor.insertString("Testing selection");
  editor.movePointTo(2);
  editor.toggleSelection();

  equals(editor.selectedText(), "", "Its begins as an empty string");

  editor.movePoint(5);
  equals(editor.selectedText(), "sting", "It returns the contained string");

  editor.movePoint(-7);
  equals(editor.selectedText(), "Te", "It returns the contained string");

  editor.toggleSelection();
  equals(editor.selectedText(), null,
         "Its cleared when the selection is toggled again");
});