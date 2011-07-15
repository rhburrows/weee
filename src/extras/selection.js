(function($){

  var selectedFace = {
    color : 'red'
  };

  var lastSelectStart, lastSelectEnd;

  function setSelectionFace(editor) {
    if (lastSelectStart && lastSelectEnd) {
      editor.display.clearFace(lastSelectStart, lastSelectEnd);
    }

    lastSelectStart = editor.selectionStart();
    lastSelectEnd = editor.selectionEnd() - 1;
    editor.display.setFace(lastSelectStart, lastSelectEnd, selectedFace);
  }

  $.fn.s2e.Editor.prototype.toggleSelection = function() {
    if (this.selectionActive) {
      this.selectionActive = false;
    } else {
      this.selectionActive = true;

      this.selectionBegan = this.pointPosition();

    }
  };

  $.fn.s2e.Editor.prototype.selectionStart = function() {
    if (this.selectionBegan == null) {
      return null;
    }

    if (this.selectionBegan < this.pointPosition()) {
      return this.selectionBegan;
    } else {
      return this.pointPosition();
    }
  };

  $.fn.s2e.Editor.prototype.selectionEnd = function() {
    if (this.selectionBegan == null) {
      return null;
    }

    if (this.selectionBegan > this.pointPosition()) {
      return this.selectionBegan;
    } else {
      return this.pointPosition();
    }
  };

  $.fn.s2e.Editor.prototype.selectedText = function() {
    if (this.selectionBegan == null) {
      return null;
    }

    if (this.selectionBegan < this.pointPosition()) {
      return this.slice(this.selectionBegan, this.pointPosition());
    } else {
      return this.slice(this.pointPosition(), this.selectionBegan);
    }
  };

  $.fn.s2e.Editor.prototype.clearSelection = function() {
    if (this.display) {
      this.display.clearFace(this.selectionStart(), this.selectionEnd()-1);
    }
    this.selectionBegan = null;
  };

  function isSelected(editor, position) {
    return position > editor.selectionStart() &&
      position < editor.selectionEnd();
  }

  $.fn.s2e.Editor.addInit(function(){
    this.selectionActive = false;

    var e = this;
    $(e).bind('s2e:movePoint s2e:contentsUpdate', function(){
      if (!e.selectionActive) {
        e.clearSelection();
      } else {
        setSelectionFace(e);
      }
    });

    $(e).bind('s2e:mousedown', function(ev){
      if (!e.selectionActive) {
        e.movePointTo(ev.position);
        e.toggleSelection();
      }
    });

    $(e).bind('s2e:mousemove', function(ev){
      if (e.selectionActive) {
        e.movePointTo(ev.position);
      }
    });

    $(e).bind('s2e:mouseup', function(ev){
      if (e.selectionActive) {
        e.toggleSelection();
      }
    });
  });

})(jQuery);