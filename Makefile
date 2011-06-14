SRC_DIR = src
PKG_DIR = pkg

MODULES = ${SRC_DIR}/core.js \
	${SRC_DIR}/display.js \
	${SRC_DIR}/input.js \
	${SRC_DIR}/defaults.js \
	${SRC_DIR}/basic.js 

VERSION = $(shell cat version.txt)
S2E = ${PKG_DIR}/jquery.s2e.${VERSION}.js

s2e: ${S2E}

${PKG_DIR}:
	mkdir -p ${PKG_DIR}

${S2E}: ${PKG_DIR}
	echo '(function($$){' > ${S2E};
	cat ${MODULES} | \
		sed 's/(function($$) *{//' | \
		sed 's/})(jQuery);//' >> ${S2E};
	echo '})(jQuery);' >> ${S2E};

clean:
	rm -rf ${PKG_DIR}
