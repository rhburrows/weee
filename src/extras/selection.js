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
      this.selectionActive = true;

      this.selectionBegan = this.pointPosition();
      $(this).bind('s2e:movePoint s2e:contentsUpdate', setSelectionFace);
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
      return editor.slice(this.selectionBegan, this.pointPosition());
    } else {
      return editor.slice(this.pointPosition(), this.selectionBegan);
    }
  };

  $.fn.s2e.Editor.prototype.clearSelection = function() {
    this.selectionBegan = null;
  };

  function isSelected(editor, position) {
    return position > editor.selectionStart() &&
      position < editor.selectionEnd();
  }

  $.fn.s2e.Editor.addInit(function(){
    this.selectionActive = false;

    var e = this;
    $(this).bind('s2e:movePoint s2e:contentsUpdate', function(){
      if (!e.selectionActive) {
        e.selectionBegan = null;
      }
    });
  });

})(jQuery);