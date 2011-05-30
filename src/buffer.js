/**
 * A basic text editor framework in javascript
 * 
 * The editor is based on a gap buffer datastructure
 */
function Buffer(size) {
    this.buf = new Array(size);
    this.size = size;
    this.presize = 0;
    this.postsize = 0;
}

Buffer.prototype = {
    pointForward : function() {
        if (this.postsize > 0) {
            this.buf[this.presize] = this.buf[this.size - this.postsize];
            this.presize = this.presize + 1;
            this.postsize = this.postsize - 1;
        }
    },

    pointBackward : function() {
        if (this.presize > 0) {
            var c = this.buf[this.presize - 1];
            this.buf[this.size - this.postsize - 1] = c;
            this.postsize = this.postsize + 1;
            this.presize = this.presize - 1;
        }
    },

    movePoint : function(distance) {
        if (distance > 0) {
            for (var i = 0; i < distance; i++) {
                this.pointForward();
            }
        } else {
            var d = -distance;
            for (var i = 0; i < d; i++) {
                this.pointBackward();
            }
        }
    },

    insertChar : function(character) {
        if (this.presize + this.postsize == this.size) {
            this._expand();
        }
        this.buf[this.presize] = character;
        this.presize = this.presize + 1;
    },

    backspace : function() {
      if (this.presize > 0) {
          this.presize = this.presize - 1;
      }
    },

    toString : function() {
        var start = this.buf.slice(0, this.presize);
        var end = this.buf.slice(this.size - this.postsize, this.size);
        return start.join('') + end.join('');
    },

    pointPosition : function() {
        return this.presize;
    },

    _expand : function() {
        var newsize = this.size * 2;
        var newbuf = new Array(newsize);
        for (var i = 0; i < this.presize; i++) {
            newbuf[i] = this.buf[i];
        }
        for (var j = 0; j < this.postsize; j++) {
            newbuf[newsize - j - 1] = this.buf[this.size - j - 1];
        }
        this.buf = newbuf;
        this.size = newsize;
    }
};
