(function($){

  var config = {
    initialText  : "",
    keybindings  : {},
    Display      : null,
    InputManager : null,
    Editor       : null,
    keybindings  : {}    
  };

  $.fn.s2e = function(opts) {
    return this.map(function(){
      var textarea = $(this);
      var options = $.extend({ initialText: "" }, opts);

      var d = new $.fn.s2e.config.Display(textarea);
      var e = new $.fn.s2e.config.Editor(options.initialText);
      var i = new $.fn.s2e.config.InputManager();

      textarea.val(options.initialText);

      $.each($.fn.s2e.config.keybindings, function(key, binding){
        i.bindKey(key, binding);
      });

      $(e).bind('s2e:contentsUpdate', function(ev) {
        textarea.val(e.contents());
      });

      $(e).bind('s2e:movePoint s2e:contentsUpdate', function(ev) {
        d.paint(e);
      });
      d.paint(e);

      textarea.keydown(i.handler(e));

      return e;
    });
  };

  $.fn.s2e.config = config;

})(jQuery);
