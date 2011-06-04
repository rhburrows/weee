VERSION = 0.1.0

PKG_DIR = pkg
PKG = $(PKG_DIR)/jquery.s2e.$(VERSION).js

build: $(PKG)
$(PKG):
	test -d $(PKG_DIR) || mkdir $(PKG_DIR)
	cp src/jquery.s2e.js $(PKG)

clean:
	rm $(PKG_DIR)/*
