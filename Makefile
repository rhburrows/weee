VERSION = 0.1.0

JS_TEST_VERSION = 1.3.2
PKG_DIR = pkg
PKG = $(PKG_DIR)/jquery.s2e.$(VERSION).js

build: $(PKG)
$(PKG):
	cp src/jquery.s2e.js "$(VERSION)"

clean:
	rm $(PKG_DIR)/*
