VERSION = 0.1.0

JS_TEST_VERSION = 1.3.2
PKG_DIR = pkg
PKG = $(PKG_DIR)/jquery.s2e.$(VERSION).js

build: $(PKG)
$(PKG):
	scripts/build.sh "$(VERSION)"

test: tmp/test-server.pid
	java -jar test/lib/JsTestDriver-$(JS_TEST_VERSION).jar --tests all

tmp/test-server.pid:
	@echo "Test server not found!"
	@echo "try: 'scripts/test-server.sh start'"
	exit 1

clean:
	rm pkg/*
