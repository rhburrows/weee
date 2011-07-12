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

  function setSelectionFace(editor) {
    editor.display.faces = [];
    editor.display.setFace(editor.selectionStart(),
                           editor.selectionEnd()-1,
                           selectedFace);
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
        if (e.display) {
          e.display.faces = [];
        }
        e.selectionBegan = null;
      } else {
        setSelectionFace(e);
      }
    });

    var d = this.display;
    $(d).bind('s2e:mousedown', function(ev){
      if (!e.selectionActive) {
        e.movePointTo(ev.position);
        e.toggleSelection();
      }
    });

    $(d).bind('s2e:mousemove', function(ev){
      if (e.selectionActive) {
        e.movePointTo(ev.position);
      }
    });

    $(d).bind('s2e:mouseup', function(ev){
      if (e.selectionActive) {
        e.toggleSelection();
      }
    });
  });

})(jQuery);