(function($){
  function Editor(options) {
    this.buffer = new Buffer(50);
    this.insertString(options.initialText);
    this.movePoint(-options.initialText.length);
  }

  Editor.prototype = {
    insertChar: function(character) {
      this.buffer.insertChar(character);
      $(this).trigger('s2e:contentsUpdate');
    },

    insertString: function(str) {
      for (var i=0; i<str.length; i++) {
        var c = str.charAt(i);
        this.buffer.insertChar(c);
      }
      $(this).trigger('s2e:contentsUpdate');
    },

    backspace: function() {
      var c = this.buffer.leftChar();
      this.buffer.backspace();
      $(this).trigger('s2e:contentsUpdate');
    },

    pointForward: function() {
      this.buffer.pointForward();
      $(this).trigger('s2e:movePoint');
    },

    pointBackward: function() {
      this.buffer.pointBackward();
      $(this).trigger('s2e:movePoint');
    },

    movePoint : function(distance) {
      this.buffer.movePoint(distance);
      $(this).trigger('s2e:movePoint');
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

  $.fn.s2e = function(opts) {
    this.each(function(){
      var textarea = $(this);

      var options = $.extend({}, $.fn.s2e.defaults, opts);

      var d = new options['display'](textarea);
      var e = new Editor({ initialText: options.initialText });
      var i = new options['inputManager'](e);
      textarea.val(options.initialText);

      $.each(options.keybindings, function(key, binding){
        i.bindKey(key, binding);
      });

      $(e).bind('s2e:contentsUpdate', function(ev) {
        textarea.val(e.contents());
      });
      $(e).bind('s2e:movePoint s2e:contentsUpdate', function(ev) {
        d.paint(e);
      });
      d.paint(e);

      textarea.keydown(i.handler(e));
      textarea.data('s2e.editor', e);
    });
  };

  function NullDisplay() {}
  NullDisplay.prototype.paint = function(editor) {};

  function NullInputManager() {}
  NullInputManager.prototype = {
    bindKey : function(command, f) {},
    handler : function(editor) {}
  };

  // Defaults
  $.fn.s2e.defaults = {
    initialText  : "",
    keybindings  : {},
    display      : NullDisplay,
    inputManager : NullInputManager
  };

  // Export extension points
  $.fn.s2e.Editor = Editor;
})(jQuery);
