(function($){
  function InputManager() {
    this.bindings = {};
  }

  var EMPTY = 0;
  var KBD_SHIFT = 1;
  var KBD_CONTROL = 2;
  var KBD_ALT = 4;

  var SPECIAL_KEY_STRINGS = {
     8 : '<BACKSPACE>',
     9 : '<TAB>',
    13 : '<ENTER>',
    27 : '<ESC>',
    32 : '<SPACE>',
    37 : '<LEFT>',
    38 : '<UP>',
    39 : '<RIGHT>',
    40 : '<DOWN>',
    46 : '<DELETE>'
  };
  for (var i=1; i<124; i++) {
    SPECIAL_KEY_STRINGS[111 + i] = '<F' + i + '>';
  }

  InputManager.prototype = {
    bindKey : function(command, f) {
      var keys = command.split('-');
      var modifiers = EMPTY;
      while (keys.length > 1) {
        var mod = keys.shift();
        if (mod == 'S') {
          modifiers = modifiers | KBD_SHIFT;
        }
        if (mod == 'C') {
          modifiers = modifiers | KBD_CONTROL;
        }
        if (mod == 'A') {
          modifiers = modifiers | KBD_ALT;
        }
      }

      // There's probably a better way to do this
      var keyString = keys[0];
      if (keyString.indexOf('\\') == 0) {
        keyString = keyString.slice(1);
      } else if (typeof SPECIAL_KEY_STRINGS[keyString] === "undefined") {
        keyString = keyString.toUpperCase();
      }

      this.bindings[keyString + modifiers] = f;
    },

    bindKeys : function(bindings) {
      var self = this;
      $.each(bindings, function(key, binding){
        self.bindKey(key, binding);
      });
    },

    handler : function(editor) {
      var bindings = this.bindings;
      return function(e) {
        var keyString;
        if (typeof SPECIAL_KEY_STRINGS[e.which] !== 'undefined') {
          keyString = SPECIAL_KEY_STRINGS[e.which];
        } else {
          keyString = String.fromCharCode(e.which);
        }

        var modifiers = EMPTY;
        if (e.shiftKey) {
          modifiers = modifiers | KBD_SHIFT;
        }
        if (e.ctrlKey) {
          modifiers = modifiers | KBD_CONTROL;
        }
        if (e.altKey) {
          modifiers = modifiers | KBD_ALT;
        }

        if (typeof bindings[keyString + modifiers] !== "undefined") {
          e.preventDefault();
          return bindings[keyString + modifiers](editor, e);
        } else if (typeof bindings["" + e.which + modifiers] !== "undefined") {
          e.preventDefault();
          return bindings["" + e.which + modifiers](editor, e);
        } else {
          e.preventDefault();
          return true;
        }
      };
    }
  };

  $.fn.s2e.config.InputManager = InputManager;
})(jQuery);