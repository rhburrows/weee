function Editor(canvas, initialText) {
    this.display = new Display(canvas);
    this.buffer = new Buffer(50);
    this.lineLength = 53;
    this.inputManager = new InputManager(this);
    var chars = initialText.split('');
    for (var i=0; i<chars.length; i++) {
        this.buffer.insertChar(chars[i]);
    }
}

Editor.prototype = {
    insertChar: function(character) {
        this.buffer.insertChar(character);
        this.display.paint(this);
    },

    backspace: function() {
        this.buffer.backspace();
        this.display.paint(this);
    },

    pointForward: function() {
        this.buffer.pointForward();
        this.display.paint(this);
    },

    pointBackward: function() {
        this.buffer.pointBackward();
        this.display.paint(this);
    },

    pointUp: function() {
        this.movePoint(-this.lineLength);
    },

    pointDown: function() {
        this.movePoint(this.lineLength);
    },

    movePoint : function(distance) {
        this.buffer.movePoint(distance);
        this.display.paint(this);
    },

    getContents : function() {
        return this.buffer.toString();
    },

    pointLine : function() {
        return Math.floor(this.buffer.pointPosition() / this.lineLength);
    },

    pointCol : function() {
        return this.buffer.pointPosition() - (this.pointLine() * this.lineLength);
    }
};
