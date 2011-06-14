(function($){
  function Editor(options) {
    this.afterInsertCallbacks = [];
    this.display = options.display;
    this.buffer = new Buffer(50);
    this.inputManager = new options['inputManager'](this);
    this.insertString(options.initialText);
    this.movePoint(-options.initialText.length);
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

    movePointTo : function(position) {
      this.movePoint(position - this.presize);
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

    restorePointAfter : function(f) {
      var location = this.presize;
      f();
      this.movePointTo(location);
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

  function NullDisplay() {}
  NullDisplay.prototype.paint = function(editor) {
    // noop display
  };

  function NullInputManager() {}
  NullInputManager.prototype = {
    bindKey : function(command, f) {},
    handler : function(editor) {}
  };

  $.fn.s2e = function(opts) {
    this.each(function(){
      var textarea = $(this);
      var canvas = document.createElement('canvas');
      var areawidth = textarea.width();
      var areaheight = textarea.height();
      $(canvas).attr('width', '' + areawidth + 'px');
      $(canvas).attr('height', '' + areaheight + 'px');
      textarea.css({
        position: 'absolute',
        left: '-' + (2*areawidth) + 'px',
        top: '-' + (2*areaheight) + 'px'
      });
      textarea.after(canvas);

      var options = $.extend({}, $.fn.s2e.defaults, opts);

      var d = new options['display'](canvas);
      var e = new Editor({ display: d,
                           initialText: options.initialText,
                           inputManager: options.inputManager });
      textarea.val(options.initialText);

      $.each(options.keybindings, function(key, binding){
        e.bindKey(key, binding);
      });

      e.afterInsert(function(c) {
        textarea.val(e.contents());
      });
      textarea.keydown(e.inputManager.handler(e));
      textarea.data('s2e.editor', e);

      $(canvas).click(function(){ textarea.focus(); });
    });
  };

  function insertF(c) {
    return function(e, ev){ e.insertChar(c); };
  }

  var defaultKeys = {
    '<LEFT>' : function(editor) {
      editor.pointBackward();
    },

    '<RIGHT>' : function(editor) {
      editor.pointForward();
    },

    '<BACKSPACE>' : function(editor) {
      editor.backspace();
    },

    '<SPACE>' : insertF(' '),
    '<ENTER>' : insertF('\n'),
    'S-1' : insertF('!'),
    'S-2' : insertF('@'),
    'S-3' : insertF('#'),
    'S-4' : insertF('$'),
    'S-5' : insertF('%'),
    'S-6' : insertF('^'),
    'S-7' : insertF('&'),
    'S-8' : insertF('*'),
    'S-9' : insertF('('),
    'S-0' : insertF(')')
  };
  // Uppercase and lowercase letters
  for (var j=65; j<91; j++) {
    var c = String.fromCharCode(j);
    defaultKeys[c] = insertF(c.toLowerCase());
    defaultKeys['S-' + c] = insertF(c);
  }
  // 0-9
  for (var n=48; n<58; n++) {
    var num = String.fromCharCode(n);
    defaultKeys[num] = insertF(num);
  }

  // Defaults
  $.fn.s2e.defaults = {
    initialText  : "",
    keybindings  : defaultKeys,
    display      : NullDisplay,
    inputManager : NullInputManager
  };

  // Export extension points
  $.fn.s2e.Editor = Editor;
})(jQuery);