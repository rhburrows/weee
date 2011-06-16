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