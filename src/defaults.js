(function($){
  function insertF(c) {
    return function(e, ev){ e.insertChar(c); };
  }

  var defaultKeys = {
    '<LEFT>' : function(editor) {
      editor.pointBackward();
    },

    '<RIGHT>' : function(editor) {
      editor.pointForward();
    },

    '<BACKSPACE>' : function(editor) {
      editor.backspace();
    },

    '<SPACE>' : insertF(' '),
    '<ENTER>' : insertF('\n'),
    'S-1' : insertF('!'),
    'S-2' : insertF('@'),
    'S-3' : insertF('#'),
    'S-4' : insertF('$'),
    'S-5' : insertF('%'),
    'S-6' : insertF('^'),
    'S-7' : insertF('&'),
    'S-8' : insertF('*'),
    'S-9' : insertF('('),
    'S-0' : insertF(')')
  };
  // Uppercase and lowercase letters
  for (var j=65; j<91; j++) {
    var c = String.fromCharCode(j);
    defaultKeys[c] = insertF(c.toLowerCase());
    defaultKeys['S-' + c] = insertF(c);
  }
  // 0-9
  for (var n=48; n<58; n++) {
    var num = String.fromCharCode(n);
    defaultKeys[num] = insertF(num);
  }

  $.fn.s2e.config.keybindings = defaultKeys;
})(jQuery);