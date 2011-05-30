var BufferTest = TestCase("BufferTest");

BufferTest.prototype.testNewBuffer = function() {
    var buf = new Buffer(50);
    assertEquals("It defaults to empty string", "", buf.toString());
    assertEquals("It starts sized at the argument size", 50, buf.size);
    assertEquals("It starts with the point at position 0", 0, buf.pointPosition());
};

BufferTest.prototype.testPointForward = function() {
    var buf = new Buffer(50);
    buf.insertChar("a");
    buf.insertChar("b");
    buf.pointBackward();
    buf.pointBackward();

    buf.pointForward();
    assertEquals("It moves the point forward one", 1, buf.pointPosition());

    buf.pointForward();
    assertEquals("It works multiple times", 2, buf.pointPosition());

    buf.pointForward();
    assertEquals("It does nothing if its add the end of the string", 2, buf.pointPosition());
};

BufferTest.prototype.testPointBackward = function() {
    var buf = new Buffer(50);
    buf.insertChar("a");
    buf.insertChar("b");

    buf.pointBackward();
    assertEquals("It moves the point back one", 1, buf.pointPosition());

    buf.pointBackward();
    assertEquals("It works multiple times", 0, buf.pointPosition());

    buf.pointBackward();
    assertEquals("It does nothing if at the start", 0, buf.pointPosition());
};

BufferTest.prototype.testMovePoint = function() {
    var buf = new Buffer(50);
    buf.insertChar("a");
    buf.insertChar("b");
    buf.insertChar("c");

    buf.movePoint(-3);
    assertEquals("It works moving backwards", 0, buf.pointPosition());

    buf.movePoint(-1);
    assertEquals("It stops at the start of the buffer", 0, buf.pointPosition());

    buf.movePoint(3);
    assertEquals("It works moving forwards", 3, buf.pointPosition());

    buf.movePoint(1);
    assertEquals("It stops at the end of the buffer", 3, buf.pointPosition());
};

BufferTest.prototype.testInsertChar = function() {
    var buf = new Buffer(3);

    buf.insertChar("a");
    assertEquals("It adds the character to the string", "a", buf.toString());
    assertEquals("It moves the point forward one", 1, buf.pointPosition());

    buf.insertChar("b");
    assertEquals("It works multiple times", "ab", buf.toString());
    assertEquals("It continues to update the point", 2, buf.pointPosition());

    buf.pointBackward();
    buf.insertChar("c");
    assertEquals("It puts the character at the point", "acb", buf.toString());
    assertEquals("It keeps the point after the newly entered character", 2, buf.pointPosition());

    buf.insertChar("d");
    assertEquals("It works if it overflows the current buffer size", "acdb", buf.toString());
    assertEquals("It doubles the internal buffer on overflow", 6, buf.size);
    assertEquals("It doesn't move the point of overflow", 3, buf.pointPosition());
};

BufferTest.prototype.testBackspace = function() {
    var buf = new Buffer(50);
    buf.insertChar("a");
    buf.insertChar("b");
    buf.insertChar("c");
    buf.pointBackward();

    buf.backspace();
    assertEquals("It removes the character before the point", "ac", buf.toString());

    buf.backspace();
    assertEquals("It works multiple times", "c", buf.toString());

    buf.backspace();
    assertEquals("It does nothing if the point is at the beginning of the buffer", "c", buf.toString());
};
