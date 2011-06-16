(function($){

  function Editor(initialText) {
    this.buffer = new Array(50);
    this.size = 50;
    this.presize = 0;
    this.postsize = 0;

    initialText = initialText || "";
    this.insertString(initialText);
    movePoint(this, -initialText.length);
  }

  function pointForward(e) {
    if (e.postsize > 0) {
      e.buffer[e.presize] = e.charAtPoint();
      e.presize = e.presize + 1;
      e.postsize = e.postsize - 1;
    }
  }

  function pointBackward(e) {
    if (e.presize > 0) {
      e.buffer[e.size - e.postsize - 1] = e.previousChar();
      e.postsize = e.postsize + 1;
      e.presize = e.presize - 1;
    }
  }

  function endOfLine(e) {
    while(e.charAtPoint() != '\n' && e.postsize != 0) {
      pointForward(e);
    }
  }

  function beginningOfLine(e) {
    while(e.previousChar() != '\n' && e.presize != 0) {
      pointBackward(e);
    }
  }

  function movePoint(e, distance) {
    if (distance > 0) {
      for (var i = 0; i < distance; i++) {
        pointForward(e);
      }
    } else {
      var d = -distance;
      for (var i = 0; i < d; i++) {
        pointBackward(e);
      }
    }
  }

  function insertChar(e, c) {
    if (e.presize + e.postsize == e.size) {
      expandBuffer(e);
    }
    e.buffer[e.presize] = c;
    e.presize = e.presize + 1;
  }

  function expandBuffer(e) {
    var newsize = e.size * 2;
    var newbuf = new Array(newsize);
    for (var i = 0; i < e.presize; i++) {
      newbuf[i] = e.buffer[i];
    }
    for (var j = 0; j < e.postsize; j++) {
      newbuf[newsize - j - 1] = e.buffer[e.size - j - 1];
    }
    e.buffer = newbuf;
    e.size = newsize;
  }

  Editor.prototype = {
    insertChar : function(character) {
      insertChar(this, character);
      $(this).trigger('s2e:contentsUpdate');
    },

    insertString : function(str) {
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        insertChar(this, c);
      }
      $(this).trigger('s2e:contentsUpdate');
    },

    backspace : function() {
      if (this.presize > 0) {
        this.presize = this.presize - 1;
      }
      $(this).trigger('s2e:contentsUpdate');
    },

    delChar : function() {
      pointForward(this);
      this.backspace();
    },

    pointForward : function() {
      pointForward(this);
      $(this).trigger('s2e:movePoint');
    },

    pointBackward : function() {
      pointBackward(this);
      $(this).trigger('s2e:movePoint');
    },

    endOfLine : function() {
      endOfLine(this);
      $(this).trigger('s2e:movePoint');
    },

    beginningOfLine : function() {
      beginningOfLine(this);
      $(this).trigger('s2e:movePoint');
    },

    nextLine : function() {
      var newlineFound = false;
      for(var i=(this.size - this.postsize); i<this.size; i++) {
        if (this.buffer[i] == '\n') {
          newlineFound = true;
          break;
        };
      }

      if (newlineFound) {
        var linePosition = 0;
        while(this.previousChar() != '\n' && this.presize != 0) {
          pointBackward(this);
          linePosition++;
        }

        endOfLine(this);
        pointForward(this);
        while(this.charAtPoint() != '\n' && this.postsize != 0 &&
              linePosition > 0) {
          pointForward(this);
          linePosition--;
        }
      }
      $(this).trigger('s2e:movePoint');
    },

    previousLine : function() {
      var newlineFound = false;
      for(var i=this.presize-1; i>=0; i--) {
        if(this.buffer[i] == '\n') {
          newlineFound = true;
          break;
        }
      }

      if (newlineFound) {
        var linePosition = 0;
        while (this.previousChar() != '\n' && this.presize != 0) {
          pointBackward(this);
          linePosition++;
        }

        pointBackward(this);
        beginningOfLine(this);
        while (this.charAtPoint() != '\n' && linePosition != 0) {
          pointForward(this);
          linePosition--;
        }
      }

      $(this).trigger('s2e:movePoint');
    },

    gotoLine : function(line) {
      var currentLine = 1;
      movePoint(this, -this.presize);
      while(currentLine < line) {
        endOfLine(this);
        pointForward(this);
        currentLine++;
      }
      $(this).trigger('s2e:movePoint');
    },

    movePoint : function(distance) {
      movePoint(this, distance);
      $(this).trigger('s2e:movePoint');
    },

    movePointTo : function(position) {
      movePoint(this, position - this.presize);
      $(this).trigger('s2e:movePoint');
    },

    contents : function() {
      var start = this.buffer.slice(0, this.presize);
      var end = this.buffer.slice(this.size - this.postsize, this.size);
      return start.join('') + end.join('');
    },

    pointPosition : function() {
      return this.presize;
    },

    charAtPoint : function() {
      if (this.postsize > 0) {
        return this.buffer[this.size - this.postsize];
      } else {
        return "";
      }
    },

    previousChar : function() {
      if (this.presize > 0) {
        return this.buffer[this.presize - 1];
      } else {
        return "";
      }
    }
  };

  $.fn.s2e.config.Editor = Editor;
})(jQuery);