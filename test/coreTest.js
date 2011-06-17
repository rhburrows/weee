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

test("click", function(){
  equals($('#editor:focus').size(), 0,
         "The textarea should not be focused to start");

  $("canvas").click();
  equals($('#editor:focus').size(), 1,
         "The textarea should be focused after clicking on the canvas");
});