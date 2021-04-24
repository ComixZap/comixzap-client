binroot = ./node_modules/.bin

default: build/manifest

build/manifest: build/index.js build/index.css build/favicon.ico build/index.html build/fontawesome-webfont.woff
	touch build/manifest

build:
	mkdir -p build

build/index.js: build
	$(binroot)/browserify -t babelify src/index.js -o build/index.js

build/index.css: build
	$(binroot)/postcss styles/index.scss -o build/index.css

build/index.html: build
	$(binroot)/pug views/index.pug -o build/

build/favicon.ico: build
	cp public/favicon.ico build/

build/fontawesome-webfont.woff: build
	cp styles/fontawesome-webfont.woff build

static-files.js: build/manifest
	node makestatic.js

package: static-files.js

clean:
	-rm -rf build
	-rm static-files.js

image: static-files.js
	docker build -f Dockerfile . -t coverslide/comixzap-single:latest

.PHONY: default image clean
