function CanvasInputManager(editor) {
    this.setupBindings(editor);
}

CanvasInputManager.prototype = {
    setupBindings : function(editor) {
        document.onkeydown = function(e) {
            var code = e.keyCode;

            if (code == 37) {
                editor.pointBackward();
            } else if (code == 39) {
                editor.pointForward();
            } else if (code == 32) {
                editor.insertChar(' ');
            } else if (code == 38) {
                editor.pointUp();
            } else if (code == 40) {
                editor.pointDown();
            } else if (code == 8) {
                editor.backspace();
                e.preventDefault();
            } else if (code > 64 && code < 91){
                var c = String.fromCharCode(code);
                if (e.shiftKey) {
                    editor.insertChar(c);
                } else {
                    editor.insertChar(c.toLowerCase());
                }
            } else if (code == 49) {
                editor.insertChar('!');
            } else if (code == 190) {
                editor.insertChar('.');
            } else if (code == 191) {
                if (e.shiftKey) {
                    editor.insertChar('?');
                } else {
                    editor.insertChar('/');
                }
            }
        };
    }
};