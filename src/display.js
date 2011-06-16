(function($){

  function Display(textarea) {
    this.canvas = document.createElement('canvas');
    var areawidth  = textarea.width();
    var areaheight = textarea.height();
    $(this.canvas).attr('width', '' + areawidth + 'px');
    $(this.canvas).attr('height', '' + areaheight + 'px');
    textarea.css({
      position: 'absolute',
      left: '-' + (2*areawidth) + 'px',
      top: '-' + (2*areaheight) + 'px'
    });
    textarea.after(this.canvas);
    $(this.canvas).click(function(){ textarea.focus(); });

    this.context = this.canvas.getContext('2d');
    this.padding = 20;
    this.faces = [];
    this.defaultFace = new Face({ family : 'Monaco', size : 14 });
    this.applyFace(this.defaultFace);
  }

  Display.prototype = {
    paint : function(editor) {
      this.clear();

      var col = 0, row = 0;
      var currentLineCount = 0;
      var contents = editor.contents();
      for (var i=0; i<contents.length; i++) {
        var c = contents.charAt(i);

        if (this.faceForPosition(i) != this.currentFace) {
          this.applyFace(this.faceForPosition(i));
        }

        if (c == '\n') {
          if (i == editor.pointPosition()) {
            this.paintCursor(col, row);
          }

          col = 0;
          row++;
          currentLineCount = 0;
        } else {
          this.paintCharacter(c, col, row);

          if (i == editor.pointPosition()) {
            this.paintCursor(col, row);
          }

          col++;
          currentLineCount++;
        
          if (currentLineCount == this.lineLength) {
            this.paintLineWrappingMarker(col, row);
            col = 0;
            row++;
            currentLineCount = 0;
          }
        }
      }
    },

    paintCharacter : function(character, col, row) {
      var pixelX = this.columnToX(col);
      var pixelY = this.rowToY(row);
      this.context.fillText(character, pixelX, pixelY);
    },

    paintCursor : function(col, row) {
      var pixelX = this.columnToX(col);
      var pixelY = this.rowToY(row);
      var face = this.currentFace;

      this.context.fillStyle = 'red';
      this.context.fillText('|', pixelX - (this.charWidth / 2), pixelY);
      
      this.applyFace(face);
    },

    paintLineWrappingMarker : function(col, row) {
      var pixelX = this.columnToX(col);
      var pixelY = this.rowToY(row);
      var face = this.currentFace;

      this.context.fillStyle = 'grey';
      this.context.fillRect(pixelX, pixelY-(this.lineHeight /2), 5, 5);

      this.applyFace(face);
    },

    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    width : function() {
      return $(this.canvas).width();
    },

    faceForPosition : function(position) {
      for (var i=0; i<this.faces.length; i++) {
        var faceApplication = this.faces[i];
        if (faceApplication[0] <= position && position <= faceApplication[1]) {
          return faceApplication[2];
        }
      }
      return this.defaultFace;
    },

    setFace : function(from, to, face) {
      this.faces.push([from, to, face]);
    },

    applyFace : function(face) {
      this.context.fillStyle = face.color;
      this.charWidth = face.size * 0.8;
      this.lineHeight = face.size * 1.6;
      this.context.font = face.fontString();
      this.lineLength = Math.floor((this.width() - 2 * this.padding) / this.charWidth);
      this.currentFace = face;
    },

    columnToX : function(col) {
      return this.padding + (col * this.charWidth);
    },

    rowToY : function(row) {
      return this.padding + (row * this.lineHeight);
    }
  };

  function Face(options) {
    this.style      = options['style']       || 'normal';
    this.variant    = options['variant']     || 'normal';
    this.weight     = options['weight']      || 'normal';
    this.size       = options['size']        || 'medium';
    this.lineHeight = options['line-height'] || 'normal';
    this.family     = options['family']      || 'monospace';
    this.color      = options['color']       || 'black';
  }

  Face.prototype = {
    fontString : function() {
      return this.style + ' ' +
        this.variant + ' ' +
        this.weight + ' ' +
        this.size + '/' +
        this.lineHeight + ' ' +
        this.family + ' ';
    }
  };

  $.fn.s2e.config.Display = Display;
})(jQuery);