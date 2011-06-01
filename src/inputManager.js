var InputManager = (function() {

  var KBD_NO_MOD = 0;
  var KBD_SHIFT = 1;
  var KBD_CONTROL = 2;
  var KBD_ALT = 4;

  var bindings = {
  };

  function bindingForEvent(e) {
    var modifiers = 0;
    if (e.shiftKey) {
      modifiers = modifiers | KBD_SHIFT;
    }
    if (e.ctrlKey) {
      modifiers = modifiers | KBD_CONTROL;
    }
    if (e.altKey) {
      modifiers = modifiers | KBD_ALT;
    }

    if (bindings[e.keyCode]) {
      return bindings[e.keyCode][modifiers];
    } else {
      return function(){};
    }
  }

  function bindKey(code, modifiers, f) {
    if (typeof bindings[code] === "undefined") {
      bindings[code] = [];
    }
    bindings[code][modifiers] = f;
  }

  function InputManagerImpl(editor) {
    this.editor = editor;
    document.onkeydown = function(e) {
      bindingForEvent(e)(editor, e);
    };
  }

  InputManagerImpl.prototype = {
    bindKey : function(code, modifiers, f) {
      bindKey(code, modifiers, f);
    }
  };

  // Set up default bindings
  bindKey(37, KBD_NO_MOD, function(editor, e) { editor.pointBackward(); });
  bindKey(38, KBD_NO_MOD, function(editor, e) { editor.pointUp(); });
  bindKey(39, KBD_NO_MOD, function(editor, e) { editor.pointForward(); });
  bindKey(40, KBD_NO_MOD, function(editor, e) { editor.pointDown(); });
  bindKey(8, KBD_NO_MOD, function(editor, e) {
    editor.backspace();
    e.preventDefault();
  });

  function selfInsert(editor, e) {
    if (e.shiftKey) {
      editor.insertChar(String.fromCharCode(e.keyCode));
    } else {
      editor.insertChar(String.fromCharCode(e.keyCode).toLowerCase());
    }
  }
  for (var i=65; i<91; i++) {
    var c = String.fromCharCode(i);
    bindKey(i, KBD_NO_MOD, selfInsert);
    bindKey(i, KBD_SHIFT, selfInsert);
  }

  bindKey(32, KBD_NO_MOD, function(editor, e) { editor.insertChar(' '); });
  bindKey(49, KBD_SHIFT, function(editor, e) { editor.insertChar('!'); });
  bindKey(190, KBD_NO_MOD, function(editor, e) { editor.insertChar('.'); });
  bindKey(191, KBD_SHIFT, function(editor, e) { editor.insertChar('?'); });
  bindKey(191, KBD_NO_MOD, function(editor, e) { editor.insertChar('/'); });

  return InputManagerImpl;
})();