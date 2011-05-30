JSTESTDRIVERVERSION = 1.3.2

test: tmp/test-server.pid
	java -jar test/lib/JsTestDriver-$(JSTESTDRIVERVERSION).jar --tests all

tmp/test-server.pid:
	@echo "Test server not found!"
	@echo "try: 'scripts/test-server.sh start'"
	exit 1
