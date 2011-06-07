(function($){
  function Editor(display, initialText) {
    // Callbacks
    this.afterInsertCallbacks = [];

    this.display = display;
    this.buffer = new Buffer(50);
    this.inputManager = new InputManager();
    this.insertString(initialText);
    this.movePoint(-initialText.length);
  }

  Editor.prototype = {
    insertChar: function(character) {
      this.buffer.insertChar(character);
      for (var i=0; i<this.afterInsertCallbacks.length; i++) {
        this.afterInsertCallbacks[i](character);
      }
      this.display.paint(this);
    },

    insertString: function(str) {
      for (var i=0; i<str.length; i++) {
        var c = str.charAt(i);
        this.buffer.insertChar(c);
        for (var j=0; j<this.afterInsertCallbacks.length; j++) {
          this.afterInsertCallbacks[j](c);
        }
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
    },

    // callbacks for client code
    afterInsert : function(f) {
      this.afterInsertCallbacks.push(f);
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
        return bindings[c + modifiers](editor, e);
      };
    }
  };

  function Display(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.padding = 20;
    this.setFont(14, 'Courier New');
  }

  Display.prototype = {
    paint : function(editor) {
      this.clear();
      this.context.fillStyle = 'black';

      var x = this.padding;
      var y = this.padding;
      var currentLineCount = 0;
      var contents = editor.contents();
      for (var i=0; i<contents.length; i++) {
        var c = contents.charAt(i);

        if (c == '\n') {
          if (i == editor.pointPosition()) {
            this.paintCursor(x, y);
          }

          x = this.padding;
          y = y + this.lineHeight;
          currentLineCount = 0;
        } else {
          this.context.fillText(c, x, y);

          if (i == editor.pointPosition()) {
            this.paintCursor(x, y);
          }

          x = x + this.charWidth;
          currentLineCount++;
        
          if (currentLineCount == this.lineLength) {
            this.context.fillStyle = 'grey';
            this.context.fillRect(x, y-(this.lineHeight / 2), 5, 5);
            this.context.fillStyle = 'black';
            x = this.padding;
            y = y + this.lineHeight;
            currentLineCount = 0;
          }
        }
      }
    },

    paintCursor : function(x, y) {
      this.context.fillStyle = 'red';
      this.context.fillText('|', x - (this.charWidth / 2), y);
      this.context.fillStyle = 'black';
    },

    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    width : function() {
      return $(this.canvas).width();
    },

    setFont : function(size, font) {
      this.charWidth = size * 0.8;
      this.lineHeight = size * 1.6;
      this.context.font = "" + size + "px " + font;
      this.lineLength = Math.floor((this.width() - 2 * this.padding) / this.charWidth);
    }
  };

  $.fn.s2e = function(opts) {
    this.each(function(){
      var textarea = $(this);
      var canvas = document.createElement('canvas');
      var areawidth = '' + textarea.width() + 'px';
      var areaheight = '' + textarea.height() + 'px';
      $(canvas).attr('width', areawidth);
      $(canvas).attr('height', areaheight);
      textarea.css({
        position: 'absolute',
        left: '-' + areawidth,
        top: '-' + areaheight
      });
      textarea.after(canvas);

      var options = $.extend({}, $.fn.s2e.defaults, opts);

      var d = new Display(canvas);
      var e = new Editor(d, options.initialText);
      textarea.val(options.initialText);

      $.each(options.keybindings, function(key, binding){
        e.bindKey(key, binding);
      });

      e.afterInsert(function(c) {
        textarea.val(e.contents());
      });
      textarea.keydown(e.inputManager.handler(e));
      textarea.data('s2e.editor', e);
    });
  };

  // Defaults
  $.fn.s2e.defaults = {
    initialText : "",
    keybindings : {}
  };
})(jQuery);