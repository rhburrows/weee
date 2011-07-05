(function($){

  $.fn.s2e.Editor.prototype.toggleSelection = function() {
    if (this.selectionActive) {
      this.selectionActive = false;
    } else {
      this.selectionBegan = this.pointPosition();
      this.selectionActive = true;
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

    var contents = this.contents();
    if (this.selectionBegan < this.pointPosition()) {
      return contents.slice(this.selectionBegan, this.pointPosition());
    } else {
      return contents.slice(this.pointPosition(), this.selectionBegan);
    }
  };

  $.fn.s2e.Editor.addInit(function(){
    this.selectionActive = false;
  });

})(jQuery);