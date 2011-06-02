(function($) {
  INCLUDE_SOURCE

  $.fn.s2e = function(initialText) {
    return this.each(function(_, e){
      new Editor(e, initialText);
    });
  };

  window.S2Editor = Editor;
})(jQuery);