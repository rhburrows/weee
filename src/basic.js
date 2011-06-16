(function($){
  var Editor = $.fn.s2e.config.Editor;

  function pointToEndOfLine(buffer) {
    while(buffer.rightChar() != '\n' && !buffer.postsize == 0) {
      buffer.pointForward();
    }
  }

  Editor.prototype.endOfLine = function() {
    pointToEndOfLine(this.buffer);
    $(this).trigger('s2e:movePoint');
  };

  Editor.prototype.beginningOfLine = function() {
    while(this.buffer.leftChar() != '\n' && !this.buffer.presize == 0) {
      this.buffer.pointBackward();
    }
    $(this).trigger('s2e:movePoint');
  };

  Editor.prototype.positionToLine = function(position) {
    var line = 1;
    var editor = this;
    this.buffer.restorePointAfter(function() {
      editor.buffer.movePointTo(0);
      for(var i=0; i<position; i++) {
        editor.buffer.pointForward();
        if (editor.buffer.leftChar() == '\n') {
          line++;
        }
      }
    });
    return line;
  };

  Editor.prototype.positionToColumn = function(position) {
    var col = 1;
    var editor = this;
    this.buffer.restorePointAfter(function() {
      editor.buffer.movePointTo(0);
      for(var i=0; i<position; i++) {
        editor.buffer.pointForward();
        if (editor.buffer.leftChar() == '\n') {
          col = 1;
        } else {
          col++;
        }
      }
    });
    return col;
  };

  Editor.prototype.gotoLine = function(line) {
    var currentLine = 1;
    this.buffer.movePointTo(0);
    while(currentLine < line) {
      pointToEndOfLine(this.buffer);
      this.buffer.pointForward();
      currentLine++;
    }
    $(this).trigger('s2e:movePoint');
  };

  Editor.prototype.delChar = function() {
    this.buffer.pointForward();
    this.backspace();
  };
})(jQuery);