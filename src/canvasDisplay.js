function CanvasDisplay(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.font = '11pt Courier New';
    this.padding = 20;
    this.charWidth = 9;
    this.lineHeight = 25;
}

CanvasDisplay.prototype = {
    paint : function(editor) {
        this.clear();
        this.context.fillStyle = 'black';

        var content = editor.getContents();
        var maxLine = 0;
        for(var x=0, y=this.padding; x<content.length; x=x+editor.lineLength, y=y+this.lineHeight) {
            this.context.fillText(content.slice(x, x+editor.lineLength), this.padding, y);
            maxLine++;
        }

        this.context.fillStyle = 'red';
        this.context.fillText('|',
                              this.padding + ((editor.pointCol() - 0.5) * 9),
                              this.padding + (editor.pointLine() * this.lineHeight));
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};
