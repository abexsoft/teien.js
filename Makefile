all: build

build:
	node ./bin/builder.js

clean:
	rm -f ./dist/teien.js ./dist/teien_browser.js