module("S2E");

test("point movement", function(){
  $('#editor').s2e({
    initialText : "Some sample text"
  });

  var editor = $('#editor').data('s2e.editor');

  equals(editor.pointPosition(), 0, "The cursor starts at the beginning of the text");

  editor.pointForward();
  equals(editor.pointPosition(), 1, "pointForward() advances the point");

  editor.pointBackward();
  equals(editor.pointPosition(), 0, "pointBackward() moves the point back");
});