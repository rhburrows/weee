(function($){

  function Display(width, height) {
    this.canvas = document.createElement('canvas');
    $(this.canvas).attr('width', '' + width + 'px');
    $(this.canvas).attr('height', '' + height + 'px');

    $(this.canvas).click(mouseHandler('s2e:click', this));
    $(this.canvas).mousedown(mouseHandler('s2e:mousedown', this));
    $(this.canvas).mouseup(mouseHandler('s2e:mouseup', this));

    this.context = this.canvas.getContext('2d');
    this.padding = 20;
    this.faces = [];
    this.defaultFace = new Face({ family : 'Monaco', size : 14 });
    applyFace(this, this.defaultFace);
    // Used for line wrapping. Messy? Yes
    this.lineLengths = [];
  }

  function mouseHandler(event, display) {
    return function(ev) {
      var e = $.Event(event);
      e.pageX = ev.pageX;
      e.pageY = ev.pageY;
      e.position = clickToPosition(display, e.pageX, e.pageY);
      $(display).trigger(e);
    };
  }

  function clickToPosition(display, x, y) {
    var line = yToLine(display, y);
    var position = 0, i = 0;
    while (i < line - 1) {
      position += display.lineLengths[i];
      line = line - Math.ceil(display.lineLengths[i] / display.lineLength);
    }
    var col = xToCol(display, x);
    return position + (col - 1);
  }

  function yToLine(display, y) {
    var adjustedY = y - $(display.canvas).position().top;
    return Math.floor(adjustedY / display.lineHeight) + 1;
  }

  function xToCol(display, x) {
    var adjustedX = x - $(display.canvas).position().left;
    return Math.floor((adjustedX - display.padding) / display.charWidth) + 1;
  }

  function paintCharacter(display, character, col, row) {
    var pixelX = columnToX(display, col);
    var pixelY = rowToY(display, row);
    display.context.fillText(character, pixelX, pixelY);
  }

  function paintCursor(display, col, row) {
    var pixelX = columnToX(display, col);
    var pixelY = rowToY(display, row);
    var face = display.currentFace;

    display.context.fillStyle = 'red';
    display.context.fillText('|', pixelX - (display.charWidth / 2), pixelY);

    applyFace(display, face);
  }

  function paintLineWrappingMarker(display, col, row) {
    var pixelX = columnToX(display, col);
    var pixelY = rowToY(display, row);
    var face = display.currentFace;

    display.context.fillStyle = 'grey';
    display.context.fillRect(pixelX, pixelY - (this.lineHeight / 2), 5, 5);

    applyFace(display, face);
  }

  function applyFace(display, face) {
    display.context.fillStyle = face.color;
    display.charWidth = face.size * 0.8;
    display.lineHeight = face.size * 1.6;
    display.context.font = face.fontString();
    display.lineLength = Math.floor((display.width() - 2 * display.padding) / display.charWidth);
    display.currentFace = face;
  }

  function columnToX(display, col) {
    return display.padding + (col * display.charWidth);
  }

  function rowToY(display, row) {
    return display.padding + (row * display.lineHeight);
  }

  Display.prototype = {
    paint : function(editor) {
      this.clear();

      var col = 0, row = 0, line = 0;
      var currentLineCount = 0;
      var contents = editor.contents();
      this.lineLengths[line] = 0;
      for (var i=0; i<contents.length; i++) {
        var c = contents.charAt(i);

        if (this.faceForPosition(i) != this.currentFace) {
          applyFace(this, this.faceForPosition(i));
        }

        this.lineLengths[line]++;

        if (i == editor.pointPosition()) {
          paintCursor(this, col, row);
        }

        if (c == '\n') {
          col = 0;
          row++;
          line++;
          this.lineLengths[line] = 0;
          currentLineCount = 0;
        } else {
          paintCharacter(this, c, col, row);
          col++;
          currentLineCount++;
        
          if (currentLineCount == this.lineLength) {
            paintLineWrappingMarker(this, col, row);
            col = 0;
            row++;
            currentLineCount = 0;
          }
        }
      }

      if (editor.pointPosition() == contents.length) {
        paintCursor(this, col, row);
      }
      $(this).trigger('s2e:repaint');
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