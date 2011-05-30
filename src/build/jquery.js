(function($) {
  INCLUDE_SOURCE

  $.fn.s2e = function(initialText) {
    $(this).each(function(_, e){
      new Editor(e, initialText);
    });
  };
})(jQuery);