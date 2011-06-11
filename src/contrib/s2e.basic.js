(function($){
  var Editor = $.fn.s2e.Editor;

  Editor.prototype.endOfLine = function() {
    while(this.buffer.rightChar() != '\n' && !this.buffer.postsize == 0) {
      this.buffer.pointForward();
    }
    this.display.paint(this);
  };

  Editor.prototype.beginningOfLine = function() {
    while(this.buffer.leftChar() != '\n' && !this.buffer.presize == 0) {
      this.buffer.pointBackward();
    }
    this.display.paint(this);
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
})(jQuery);