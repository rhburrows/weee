var EditorTest = TestCase('EditorTest');

function MockCanvas2(){}
MockCanvas2.prototype.getContext = function(){
    return "Context";
};

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

EditorTest.prototype.testInsertChar = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;
    editor.display = view;

    editor.insertChar("a");
    assertEquals("It delegates the insert to the internal buffer", "a", buffer.lastInsertCharCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.insertChar("b");
    assertEquals("It works multiple times", "b", buffer.lastInsertCharCall);
    assertEquals("It repaints each time", 2, view.paintCount);
};

EditorTest.prototype.testBackspace = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;
    editor.display = view;

    editor.backspace();
    assertEquals("It delegates backspace to the internal buffer", 1, buffer.backspaceCount);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.backspace();
    assertEquals("It works multiple times", 2, buffer.backspaceCount);
    assertEquals("It repaints each time", 2, view.paintCount);
};

EditorTest.prototype.testPointForward = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;
    editor.display = view;

    editor.pointForward();
    assertEquals("It delegates pointForward to the internal buffer", 1, buffer.pointForwardCount);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.pointForward();
    assertEquals("It works multiple times", 2, buffer.pointForwardCount);
    assertEquals("It repaints each time", 2, view.paintCount);
};

EditorTest.prototype.testPointBackward = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;
    editor.display = view;

    editor.pointBackward();
    assertEquals("It delegates pointBackward to the internal buffer", 1, buffer.pointBackCount);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.pointBackward();
    assertEquals("It works multiple times", 2, buffer.pointBackCount);
    assertEquals("It repaints each time", 2, view.paintCount);
};

EditorTest.prototype.testPointUp = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;
    editor.display = view;
    editor.lineLength = 10;

    editor.pointUp();
    assertEquals("It moves the point back exactly one line length", -10, buffer.lastMovePointCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);
};

EditorTest.prototype.testPointDown = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, ""e);
    editor.buffer = buffer;
    editor.display = view;
    editor.lineLength = 10;

    editor.pointDown();
    assertEquals("It moves the point forward exactly one line length", 10, buffer.lastMovePointCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);
};

EditorTest.prototype.testMovePoint = function() {
    var buffer = new MockBuffer("");
    var view = new MockView();
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;
    editor.display = view;

    editor.movePoint(1337);
    assertEquals("It delegates movePoint to the internal buffer", 1337, buffer.lastMovePointCall);
    assertEquals("It paints itself to the view", 1, view.paintCount);

    editor.movePoint(-5);
    assertEquals("It works multiple times", -5, buffer.lastMovePointCall);
    assertEquals("It repaints each time", 2, view.paintCount);
};

EditorTest.prototype.testGetContents = function() {
    var buffer = new MockBuffer("A Mock Buffer");
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;

    assertEquals("It returns the toString of the buffer", "A Mock Buffer", editor.getContents());
};

EditorTest.prototype.testPointLine = function() {
    var buffer = new MockBuffer("");
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;

    buffer.pointPos = 1;
    editor.lineLength = 5;
    assertEquals("It returns 0 if the point is before the line length", 0, editor.pointLine());

    buffer.pointPos = 7;
    assertEquals("It goes to the next line if the point is past the wrapping point", 1, editor.pointLine());

    buffer.pointPos = 21;
    assertEquals("It goes beyond two lines", 4, editor.pointLine());
};

EditorTest.prototype.testPointCol = function() {
    var buffer = new MockBuffer("");
    var canvas = new MockCanvas2();
    var editor = new Editor(canvas, "");
    editor.buffer = buffer;

    buffer.pointPos = 1;
    editor.lineLength = 5;
    assertEquals("It is the same as the position if on the first line", 1, editor.pointCol());

    buffer.pointPos = 6;
    assertEquals("It wraps back on the second line", 1, editor.pointCol());

    buffer.pointPos = 20;
    assertEquals("It works beyond two lines", 0, editor.pointCol());
};
