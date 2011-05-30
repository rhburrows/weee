var WindowTest = TestCase('WindowTest');

function MockBuffer(contents) {
    this.lastInsertCharCall = null;
    this.backspaceCount = 0;
    this.pointForwardCount = 0;
    this.pointBackCount = 0;
    this.lastMovePointCall = null;
    this.contents = contents;
    this.pointPos = 0;
}

MockBuffer.prototype = {
    insertChar : function(character) {
        this.lastInsertCharCall = character;
    },
    backspace : function() {
        this.backspaceCount++;
    },
    pointForward : function() {
        this.pointForwardCount++;
    },
    pointBackward : function() {
        this.pointBackCount++;
    },
    movePoint : function(distance) {
        this.lastMovePointCall = distance;
    },
    toString : function() {
        return this.contents;
    },
    pointPosition : function() {
        return this.pointPos;
    }
};

function MockView() {
    this.paintCount = 0;
}

MockView.prototype = {
    paint : function(editor) {
        this.paintCount++;
    }
};

WindowTest.prototype.testInsertChar = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;

    editor.insertChar("a");
    assertEquals("It delegates the insert to the internal buffer", "a", buffer.lastInsertCharCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.insertChar("b");
    assertEquals("It works multiple times", "b", buffer.lastInsertCharCall);
    assertEquals("It repaints each time", 2, view.paintCount);
};

WindowTest.prototype.testBackspace = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;

    editor.backspace();
    assertEquals("It delegates backspace to the internal buffer", 1, buffer.backspaceCount);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.backspace();
    assertEquals("It works multiple times", 2, buffer.backspaceCount);
    assertEquals("It repaints each time", 2, view.paintCount);
};

WindowTest.prototype.testPointForward = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;

    editor.pointForward();
    assertEquals("It delegates pointForward to the internal buffer", 1, buffer.pointForwardCount);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.pointForward();
    assertEquals("It works multiple times", 2, buffer.pointForwardCount);
    assertEquals("It repaints each time", 2, view.paintCount);
};

WindowTest.prototype.testPointBackward = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;

    editor.pointBackward();
    assertEquals("It delegates pointBackward to the internal buffer", 1, buffer.pointBackCount);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.pointBackward();
    assertEquals("It works multiple times", 2, buffer.pointBackCount);
    assertEquals("It repaints each time", 2, view.paintCount);
};

WindowTest.prototype.testPointUp = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;
    editor.lineLength = 10;

    editor.pointUp();
    assertEquals("It moves the point back exactly one line length", -10, buffer.lastMovePointCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);
};

WindowTest.prototype.testPointDown = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;
    editor.lineLength = 10;

    editor.pointDown();
    assertEquals("It moves the point forward exactly one line length", 10, buffer.lastMovePointCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);
};

WindowTest.prototype.testMovePoint = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var editor = new Window(view);
    editor.buffer = buffer;

    editor.movePoint(1337);
    assertEquals("It delegates movePoint to the internal buffer", 1337, buffer.lastMovePointCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.movePoint(-5);
    assertEquals("It works multiple times", -5, buffer.lastMovePointCall);
    assertEquals("It repaints each time", 2, view.paintCount);
};

WindowTest.prototype.testGetContents = function() {
    var buffer = new MockBuffer("A Mock Buffer");
    var editor = new Window(null);
    editor.buffer = buffer;

    assertEquals("It returns the toString of the buffer", "A Mock Buffer", editor.getContents());
};

WindowTest.prototype.testPointLine = function() {
    var buffer = new MockBuffer("");
    var editor = new Window(null);
    editor.buffer = buffer;

    buffer.pointPos = 1;
    editor.lineLength = 5;
    assertEquals("It returns 0 if the point is before the line length", 0, editor.pointLine());

    buffer.pointPos = 7;
    assertEquals("It goes to the next line if the point is past the wrapping point", 1, editor.pointLine());

    buffer.pointPos = 21;
    assertEquals("It goes beyond two lines", 4, editor.pointLine());
};

WindowTest.prototype.testPointCol = function() {
    var buffer = new MockBuffer("");
    var editor = new Window(null);
    editor.buffer = buffer;

    buffer.pointPos = 1;
    editor.lineLength = 5;
    assertEquals("It is the same as the position if on the first line", 1, editor.pointCol());

    buffer.pointPos = 6;
    assertEquals("It wraps back on the second line", 1, editor.pointCol());

    buffer.pointPos = 20;
    assertEquals("It works beyond two lines", 0, editor.pointCol());
};
