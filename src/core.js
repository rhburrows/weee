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

      var width = textarea.width();
      var height = textarea.height();

      var display = new $.fn.s2e.config.Display(width, height);
      var editor = new $.fn.s2e.config.Editor(options.initialText);
      var inputManager = new $.fn.s2e.config.InputManager();

      $(display).bind('s2e:click', function(ev){
        textarea.focus();
      });

      textarea.css({
        position: 'absolute',
        left: '-' + (2*width) + 'px',
        top: '-' + (2*height) + 'px'
      });
      textarea.val(options.initialText);
      textarea.after(display.canvas);

      $.each($.fn.s2e.config.keybindings, function(key, binding){
        inputManager.bindKey(key, binding);
      });

      $(editor).bind('s2e:contentsUpdate', function(ev) {
        textarea.val(editor.contents());
      });

      $(editor).bind('s2e:movePoint s2e:contentsUpdate', function(ev) {
        display.paint(editor);
      });
      display.paint(editor);

      $(display).bind('s2e:click', function(ev) {
        editor.movePointTo(ev.position);
      });

      // bubble display events through textarea
      $(display).bind('s2e:click s2e:mousedown s2e:mouseup s2e:repaint', function(e){
        textarea.trigger(e);
      });
      // bubble editor events through textarea
      $(editor).bind('s2e:movePoint s2e:contentsUpdate', function(e){
        textarea.trigger(e);
      });

      textarea.keydown(inputManager.handler(editor));

      return editor;
    });
  };

  $.fn.s2e.config = config;

})(jQuery);
