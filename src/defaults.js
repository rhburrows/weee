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
    'S-0' : insertF(')'),

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
    }
  };

  // some keys on my keyboard don't match js defaults
  // Bind these by hand because javascript thinks they are extended characters
  var extra = {
    '\\187' : ['=', '+'],
    '\\188' : [',', '<'],
    '\\190' : ['.', '>'],
    '\\191' : ['/', '?'],
    '\\219' : ['[', '{'],
    '\\220' : ['\\', '|'],
    '\\221' : [']', '}'],
    '\\222' : ['\'', '"']
  };
  $.each(extra, function(code, values) {
    defaultKeys[code] = function(e){ e.insertChar(values[0]); };
    defaultKeys['S-'+code] = function(e){ e.insertChar(values[1]); };
  });

  // Uppercase and lowercase letters
  for (var j=65; j<91; j++) {
    var c = String.fromCharCode(j);
    defaultKeys[c] = insertF(c.toLowerCase());
    defaultKeys['S-' + c] = insertF(c);
  }
  // 0-9
  for (var n=48; n<58; n++) {
    var num = String.fromCharCode(n);
    defaultKeys['\\' + n] = insertF(num);
  }

  $.fn.s2e.config.keybindings = defaultKeys;
})(jQuery);