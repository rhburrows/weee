(function($){

  var config = {
    initialText  : "",
    keybindings  : {},
    keybindings  : {}    
  };

  function extendEvent(e, editor, display) {
    e.editor = editor;
    e.display = display;
    return e;
  }

  $.fn.weee = function(opts) {
    return this.map(function(){
      var textarea = $(this);
      var options = $.extend({ initialText: "" }, opts);

      var width = textarea.width();
      var height = textarea.height();

      var display = new $.fn.weee.Display(width, height);
      var editor = new $.fn.weee.Editor(options.initialText, display);
      var inputManager = new $.fn.weee.InputManager();

      textarea.css({
         position: 'absolute',
         left: '-' + (2*width) + 'px',
         top: '-' + (2*height) + 'px'
      });
      textarea.val(options.initialText);
      display.insertAfter(textarea);
      inputManager.insertAfter(textarea);
      inputManager.bindKeys($.fn.weee.config.keybindings);

      $(editor).bind('weee:contentsUpdate', function(ev) {
        textarea.val(editor.contents());
      });

      $(editor).bind('weee:movePoint weee:contentsUpdate', function(e) {
        display.repaint(editor);
        textarea.trigger(extendEvent(e, editor, display));
      });
      display.repaint(editor);

      $(display).bind('weee:click', function(ev) {
        inputManager.focus();
        editor.movePointTo(ev.position);
      });

      // bubble display events through textarea
      $(display).bind('weee:click weee:mousedown weee:mouseup weee:repaint', function(e){
        textarea.trigger(extendEvent(e, editor, display));
      });

      inputManager.keydown(inputManager.handler(editor));

      return editor;
    });
  };

  $.fn.weee.config = config;

})(jQuery);
