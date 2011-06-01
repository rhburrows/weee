var DisplayTest = TestCase('DisplayTest');

function MockCanvas(width, height) {
    this.width = width;
    this.height = height;
    this.context = this;
}
MockCanvas.prototype.clearRect = function() {
    this.clearRectArgs = arguments;
};
MockCanvas.prototype.getContext = function() {
    return this.context;
};

DisplayTest.prototype.testNew = function() {
    var canvas = new MockCanvas();
    var context = {};
    canvas.context = context;

    var display = new Display(canvas);
    assertEquals("It sets the canvas to the parameter", canvas, display.canvas);
    assertEquals("It sets the context to the canvas' context", context, display.context);
    assertEquals("It sets the default font on the context", '11pt Courier New', display.context.font);
    assertEquals("It sets the default padding", 20, display.padding);
    assertEquals("It sets the character width", 9, display.charWidth);
    assertEquals("It sets the lineHeight", 25, display.lineHeight);
};

DisplayTest.prototype.testClear = function() {
    var canvas = new MockCanvas(5, 10);
    var display = new Display(canvas);

    display.clear();
    assertEquals("It clears a rectangle the size of the canvas",
                 [0, 0, 5, 10], canvas.clearRectArgs);
};
