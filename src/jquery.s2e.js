(function($){
  function Editor(display, initialText) {
    this.display = display;
    this.buffer = new Buffer(50);
    this.inputManager = new InputManager();
    this.insertString(initialText);
    this.movePoint(-initialText.length);
  }

  Editor.prototype = {
    insertChar: function(character) {
      this.buffer.insertChar(character);
      this.display.paint(this);
    },

    insertString: function(str) {
      for (var i=0; i<str.length; i++) {
        this.buffer.insertChar(str.charAt(i));
      }
      this.display.paint(this);
    },

    backspace: function() {
      this.buffer.backspace();
      this.display.paint(this);
    },

    pointForward: function() {
      this.buffer.pointForward();
      this.display.paint(this);
    },

    pointBackward: function() {
      this.buffer.pointBackward();
      this.display.paint(this);
    },

    movePoint : function(distance) {
      this.buffer.movePoint(distance);
      this.display.paint(this);
    },

    bindKey : function(command, f) {
      this.inputManager.bindKey(command, f);
      this.display.paint(this);
    },

    contents : function() {
      return this.buffer.toString();
    },

    pointPosition : function() {
      return this.buffer.pointPosition();
    },

    charAtPoint : function() {
      return this.buffer.rightChar();
    }
  };

  function Buffer(size) {
    this.buf = new Array(size);
    this.size = size;
    this.presize = 0;
    this.postsize = 0;
  }

  Buffer.prototype = {
    pointForward : function() {
      if (this.postsize > 0) {
        this.buf[this.presize] = this.rightChar();
        this.presize = this.presize + 1;
        this.postsize = this.postsize - 1;
      }
    },

    pointBackward : function() {
      if (this.presize > 0) {
        this.buf[this.size - this.postsize - 1] = this.leftChar();
        this.postsize = this.postsize + 1;
        this.presize = this.presize - 1;
      }
    },

    movePoint : function(distance) {
      if (distance > 0) {
        for (var i = 0; i < distance; i++) {
          this.pointForward();
        }
      } else {
        var d = -distance;
        for (var i = 0; i < d; i++) {
          this.pointBackward();
        }
      }
    },

    insertChar : function(character) {
      if (this.presize + this.postsize == this.size) {
        this._expand();
      }
      this.buf[this.presize] = character;
      this.presize = this.presize + 1;
    },

    backspace : function() {
      if (this.presize > 0) {
        this.presize = this.presize - 1;
      }
    },

    toString : function() {
      var start = this.buf.slice(0, this.presize);
      var end = this.buf.slice(this.size - this.postsize, this.size);
      return start.join('') + end.join('');
    },

    pointPosition : function() {
      return this.presize;
    },

    rightChar : function() {
      if (this.postsize > 0) {
        return this.buf[this.size - this.postsize];
      } else {
        return "";
      }
    },

    leftChar : function() {
      return this.buf[this.presize - 1];
    },

    _expand : function() {
      var newsize = this.size * 2;
      var newbuf = new Array(newsize);
      for (var i = 0; i < this.presize; i++) {
        newbuf[i] = this.buf[i];
      }
      for (var j = 0; j < this.postsize; j++) {
        newbuf[newsize - j - 1] = this.buf[this.size - j - 1];
      }
      this.buf = newbuf;
      this.size = newsize;
    }
  };

  function InputManager(editor) {
    this.bindings = {};
    this.handleInput = function(e) {
      var c = String.fromCharCode(e.keyCode);
      bindings[c](editor);
    };
  }

  var EMPTY = 0;
  var KBD_SHIFT = 1;
  var KBD_CONTROL = 2;
  var KBD_ALT = 4;
  var KBD_META = 8;

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
        if (mod == 'M') {
          modifiers = modifiers | KBD_META;
        }
      }

      // There's probably a better way to do this
      var character = keys[0].toUpperCase();
      this.bindings[character + modifiers] = f;
    },

    handler : function(editor) {
      var bindings = this.bindings;
      return function(e) {
        var c = String.fromCharCode(e.keyCode);
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
        if (e.metaKey) {
          modifiers = modifiers | KBD_META;
        }
        return bindings[c + modifiers](editor);
      };
    }
  };

  function Display(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.font = '11pt Courier New';
    this.padding = 20;
    this.charWidth = 9;
    this.lineHeight = 25;
    this.lineLength = 53;
  }

  Display.prototype = {
    paint : function(editor) {
      this.clear();
      this.context.fillStyle = 'black';

      var content = editor.contents();
      var maxLine = 0;
      for(var x=0, y=this.padding; x<content.length; x=x+this.lineLength, y=y+this.lineHeight) {
        this.context.fillText(content.slice(x, x+this.lineLength), this.padding, y);
        maxLine++;
      }

      this.context.fillStyle = 'red';
      this.context.fillText('|',
                            this.padding + ((this.pointCol(editor) - 0.5) * 9),
                            this.padding + (this.pointLine(editor) * this.lineHeight));
    },

    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    pointCol : function(editor) {
      return editor.pointPosition() - (this.pointLine(editor) * this.lineLength);
    },

    pointLine : function(editor) {
      return Math.floor(editor.pointPosition() / this.lineLength);
    }
  };

  $.fn.s2e = function(opts) {
    this.each(function(){
      var d = new Display(this);
      var e = new Editor(d, opts.initialText);
      $(this).keydown(e.inputManager.handler(e));
      $(this).data('s2e.editor', e);
    });
  };
})(jQuery);