(function($){
  var defaultKeys = {
    '<LEFT>' : function(editor) {
      editor.pointBackward();
    },

    '<RIGHT>' : function(editor) {
      editor.pointForward();
    },

    '<DOWN>' : function(editor) {
      editor.nextLine();
    },

    '<UP>' : function(editor) {
      editor.previousLine();
    },

    '<BACKSPACE>' : function(editor) {
      editor.backspace();
    },

    '<TAB>' : function(editor) {
      editor.insertChar('\t');
    },

    '<ENTER>' : function(editor) {
      editor.insertChar('\n');
    },

    'C-f' : function(editor) {
      editor.pointForward();
    },

    'C-b' : function(editor) {
      editor.pointBackward();
    },

    'C-e' : function(editor) {
      editor.endOfLine();
    },

    'C-a' : function(editor) {
      editor.beginningOfLine();
    },

    'C-n' : function(editor) {
      editor.nextLine();
    },

    'C-p' : function(editor) {
      editor.previousLine();
    },

    'C-x' : function(editor) {
      editor.toggleSelection();
    }
  };

  $.fn.weee.config.keybindings = defaultKeys;
})(jQuery);