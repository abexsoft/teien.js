all: pack

pack:
	node ./bin/builder.js

clean:
	rm -f ./build/teien.js ./build/teien_browser.js