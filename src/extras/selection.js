(function($){

  // TODO: HACK HACK HACK!
  // Make this more configurable or something
  // And make it use an actual face
  var selectedFace = {
    style : 'normal',
    variant : 'normal',
    weight : 'bold',
    size : '14',
    lineHeight : 'normal',
    family : 'monospace',
    color : 'red',
    fontString : function() {
      return this.style + ' ' +
        this.variant + ' ' +
        this.weight + ' ' +
        this.size + '/' +
        this.lineHeight + ' ' +
        this.family;
    }
  };

  function setSelectionFace(e) {
    var editor = e.editor;
    // TODO: HACK AGAIN!!!!
    editor.display.faces = [];
    editor.display.setFace(editor.selectionStart(),
                           editor.selectionEnd(),
                           selectedFace);
  }

  $.fn.s2e.Editor.prototype.toggleSelection = function() {
    if (this.selectionActive) {
      this.selectionActive = false;

      this.display.faces = [];
      $(this).unbind('s2e:movePoint s2e:contentsUpdate', setSelectionFace);
    } else {
      this.selectionBegan = this.pointPosition();
      this.selectionActive = true;

      $(this).bind('s2e:movePoint s2e:contentsUpdate', setSelectionFace);
    }
  };

  $.fn.s2e.Editor.prototype.selectionStart = function() {
    if (!this.selectionActive) {
      return null;
    }

    if (this.selectionBegan < this.pointPosition()) {
      return this.selectionBegan;
    } else {
      return this.pointPosition();
    }
  };

  $.fn.s2e.Editor.prototype.selectionEnd = function() {
    if (!this.selectionActive) {
      return null;
    }

    if (this.selectionBegan > this.pointPosition()) {
      return this.selectionBegan;
    } else {
      return this.pointPosition();
    }
  };

  $.fn.s2e.Editor.prototype.selectedText = function() {
    if (!this.selectionActive) {
      return null;
    }

    if (this.selectionBegan < this.pointPosition()) {
      return editor.slice(this.selectionBegan, this.pointPosition());
    } else {
      return editor.slice(this.pointPosition(), this.selectionBegan);
    }
  };

  function isSelected(editor, position) {
    return position > editor.selectionStart() &&
      position < editor.selectionEnd();
  }

  $.fn.s2e.Editor.addInit(function(){
    this.selectionActive = false;
  });

})(jQuery);