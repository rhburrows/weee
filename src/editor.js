(function($){

  var extraInitializers = [];

  function Editor(initialText) {
    this.buffer = new Array(50);
    this.size = 50;
    this.presize = 0;
    this.postsize = 0;

    this.insertString(initialText);
    movePoint(this, -initialText.length);

    var edit = this;
    $.each(extraInitializers, function(_, i){
      i.call(edit);
    });
  }

  Editor.addInit = function(init) {
    extraInitializers.push(init);
  };

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

  function watchPoint(editor, f) {
    var pointFrom = editor.pointPosition();
    f();
    var pointTo = editor.pointPosition();
    if (pointFrom != pointTo) {
      var e = $.Event('s2e:movePoint');
      e.pointFrom = pointFrom;
      e.pointTo = pointTo;
      $(editor).trigger(e);
    }
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
        $(this).trigger('s2e:contentsUpdate');
      }
    },

    delChar : function() {
      pointForward(this);
      this.backspace();
    },

    pointForward : function() {
      var e = this;
      watchPoint(e, function(){
        pointForward(e);
      });
    },

    pointBackward : function() {
      var e = this;
      watchPoint(e, function(){
        pointBackward(e);
      });
    },

    endOfLine : function() {
      var e = this;
      watchPoint(e, function(){
        endOfLine(e);
      });
    },

    beginningOfLine : function() {
      var e = this;
      watchPoint(e, function(){
        beginningOfLine(e);
      });
    },

    nextLine : function() {
      var e = this;
      watchPoint(e, function(){
        var newlineFound = false;
        for(var i=(e.size - e.postsize); i<e.size; i++) {
          if (e.buffer[i] == '\n') {
            newlineFound = true;
            break;
          };
        }

        if (newlineFound) {
          var linePosition = 0;
          while(e.previousChar() != '\n' && e.presize != 0) {
            pointBackward(e);
            linePosition++;
          }

          endOfLine(e);
          pointForward(e);
          while(e.charAtPoint() != '\n' && e.postsize != 0 &&
                linePosition > 0) {
            pointForward(e);
            linePosition--;
          }
        }
      });
    },

    previousLine : function() {
      var e = this;
      watchPoint(e, function(){
        var newlineFound = false;
        for(var i=e.presize-1; i>=0; i--) {
          if(e.buffer[i] == '\n') {
            newlineFound = true;
            break;
          }
        }

        if (newlineFound) {
          var linePosition = 0;
          while (e.previousChar() != '\n' && e.presize != 0) {
            pointBackward(e);
            linePosition++;
          }

          pointBackward(e);
          beginningOfLine(e);
          while (e.charAtPoint() != '\n' && linePosition != 0) {
            pointForward(e);
            linePosition--;
          }
        }
      });
    },

    gotoLine : function(line) {
      var e = this;
      watchPoint(e, function(){
        var currentLine = 1;
        movePoint(e, -e.presize);
        while(currentLine < line) {
          endOfLine(e);
          pointForward(e);
          currentLine++;
        }
      });
    },

    movePoint : function(distance) {
      var e = this;
      watchPoint(e, function(){
        movePoint(e, distance);
      });
    },

    movePointTo : function(position) {
      var e = this;
      watchPoint(e, function(){
        movePoint(e, position - e.presize);
      });
    },

    contents : function() {
      var start = this.buffer.slice(0, this.presize);
      var end = this.buffer.slice(this.size - this.postsize, this.size);
      return start.join('') + end.join('');
    },

    lineCount : function() {
      if (this.contents().length == 0) {
        return 0;
      }
      return this.contents().split('\n').length;
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

  $.fn.s2e.Editor = Editor;
})(jQuery);