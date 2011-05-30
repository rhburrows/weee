function Editor(canvas, initialText) {
    this.window = new Window(new CanvasDisplay(canvas));
    this.inputManager = new CanvasInputManager(this.window);
    var chars = initialText.split('');
    for (var i=0; i<chars.length; i++) {
        this.window.insertChar(chars[i]);
    }
}