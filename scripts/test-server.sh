#!/bin/sh

JS_TEST_DRIVER_VERSION="1.3.2"

start() {
    java -jar test/lib/JsTestDriver-$JS_TEST_DRIVER_VERSION.jar --config \
        jsTestDriver.conf --port 9876 &
    echo "$!" > tmp/test-server.pid
    echo "Test server started."
    echo "Navigate to http://localhost:9876 to capture a browser"
}

stop() {
    test -f tmp/test-server.pid || {
        echo "Can't find 'tmp/test-server.pid"
        echo "Are you sure the test server is running?"
        exit 1
    }

    pid=$(cat tmp/test-server.pid)

    kill "$pid"
    rm tmp/test-server.pid
}

case "$1" in
    start)
        start
    ;;
 
    stop)
        stop
    ;;

    *)
        echo "Usage: $0 {start|stop}"
esac
