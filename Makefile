SRC_DIR = src
PKG_DIR = pkg

MODULES = ${SRC_DIR}/core.js \
        ${SRC_DIR}/editor.js \
	${SRC_DIR}/display.js \
	${SRC_DIR}/input.js \
	${SRC_DIR}/defaults.js \

VERSION = $(shell cat version.txt)
WEEE = ${PKG_DIR}/jquery.weee.${VERSION}.js

weee: ${WEEE}

${PKG_DIR}:
	mkdir -p ${PKG_DIR}

${WEEE}: ${PKG_DIR}
	echo '(function($$){' > ${WEEE};
	cat ${MODULES} | \
		sed 's/(function($$) *{//' | \
		sed 's/})(jQuery);//' >> ${WEEE};
	echo '})(jQuery);' >> ${WEEE};

clean:
	rm -rf ${PKG_DIR}
