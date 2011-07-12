(function($){

  function defaultFace() {
    return new Face({
      family : 'Monaco',
      size   : 14
    });
  }

  function Display(width, height) {
    this.canvas = document.createElement('canvas');
    $(this.canvas).attr('width', '' + width + 'px');
    $(this.canvas).attr('height', '' + height + 'px');

    $(this.canvas).click(mouseHandler('s2e:click', this));
    $(this.canvas).mousedown(mouseHandler('s2e:mousedown', this));
    $(this.canvas).mouseup(mouseHandler('s2e:mouseup', this));
    $(this.canvas).mousemove(mouseHandler('s2e:mousemove', this));

    this.context = this.canvas.getContext('2d');
    this.padding = 20;
    this.faces = [];
    this.defaultFace = defaultFace();
    applyFace(this, this.defaultFace);
    this.lineLengths = [];

    this.visibleFrame = new VisibleFrame(this, 0, height/this.lineHeight);
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
    var position = 0,
        i = 0;
    while (i < line - 1) {
      position += display.lineLengths[i];
      i++;
    }
    var col = xToCol(display, x);

    if (col > display.lineLengths[line-1]) {
      col = display.lineLengths[line-1];
    }
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

  function paintScrollbar(display, from, to, max) {
    var face = display.currentFace;

    display.context.fillStyle = 'gray';
    var left = $(display.canvas).position().left + $(display.canvas).width() - 20;
    var top = $(display.canvas).position().top;
    var height = $(display.canvas).height();
    var width = 15;
    display.context.fillRect(left, top, width, height);

    display.context.fillStyle = '#ddd';
    width = 8;
    left = left + 2;

    var percentage = (to - from) / max;
    var maxHeight = height - 20;
    height = Math.round(maxHeight * percentage);
    top = top + 10 + Math.round(maxHeight * (from / max));
    display.context.fillRect(left, top, width, height);
    
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
    repaint : function(editor) {
      this.clear();

      var col = 0,
          row = 0,
          currentLine = 0;
      var contents = editor.contents();
      var tooLong = false,
          cursorPainted = false;

      this.lineLengths[row] = 0;
      for (var i=0; i<contents.length; i++) {
        var c = contents.charAt(i);

        while (!this.visibleFrame.visible(row)) {
          if (c == '\n') {
            row++;
            this.lineLengths[row] = 0;
          }

          if (editor.pointPosition() == i) {
            this.visibleFrame.scrollTo(row);
            return this.repaint();            
          }
          i++;
          c = contents.charAt(i);
        }

        if (this.faceForPosition(i) != this.currentFace) {
          applyFace(this, this.faceForPosition(i));
        }

        this.lineLengths[row]++;

        if (i == editor.pointPosition()) {
          cursorPainted = true;
          paintCursor(this, col, currentLine);
        }

        if (c == '\n') {
          col = 0;
          row++;
          currentLine++;
          this.lineLengths[row] = 0;
        } else {
          paintCharacter(this, c, col, currentLine);
          col++;
        }

        if (!this.visibleFrame.visible(row)) {
          tooLong = true;
          while (!cursorPainted && i < contents.length) {
            i++;
            c = contents.charAt(i);
            if (c == '\n') {
              row++;
            }
            if (i == editor.pointPosition()) {
              this.visibleFrame.scrollTo(row);
              return this.repaint(editor);
            }
          }
          break;
        }
      }

      if (editor.pointPosition() == contents.length) {
        paintCursor(this, col, row);
      }

      if (tooLong || this.visibleFrame.first > 0) {
        paintScrollbar(this,
                       this.visibleFrame.first,
                       this.visibleFrame.last,
                       editor.lineCount());
      }

      $(this).trigger('s2e:repaint');
      return true;
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

    insertAfter : function(e) {
      e.after(this.canvas);
    },

    scrollDown : function(editor, n) {
      this.visibleFrame.scrollUp(n);
      this.repaint(editor);
    },

    scrollUp : function(editor, n) {
      this.visibleFrame.scrollUp(n);
      this.repaint(editor);
    }
  };

  function Face(options) {
    this.style      = options['style']       || 'normal';
    this.variant    = options['variant']     || 'normal';
    this.weight     = options['weight']      || 'normal';
    this.size       = options['size']        || '14';
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
        this.family;
    }
  };

  function VisibleFrame(display, from, to) {
    this.maxLines = Math.floor($(display.canvas).height() / display.lineHeight);
    this.first = from || 0;
    this.last = to || (this.maxLines);
  }

  VisibleFrame.prototype = {
    scrollDown : function(n) {
      this.first = this.first + n;
      this.last = this.last + n;
    },

    scrollUp : function(n) {
      this.first = this.first - n;
      this.last = this.last - n;
    },

    scrollTo : function(row) {
      if (row > this.last) {
        this.scrollDown(row - this.last);
      } else if (row < this.first) {
        this.scrollUp(this.first - row);
      }
    },

    visible : function(row) {
      return (row >= this.first && row <= this.last);
    }
  };

  Display.Events = [
    's2e:mousedown',
    's2e:mousemove',
    's2e:mouseup',
    's2e:click'
  ];

  $.fn.s2e.Display = Display;
})(jQuery);