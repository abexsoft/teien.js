
if (typeof exports === 'undefined'){
    var teien = {};
}

if (typeof importScripts !== 'undefined'){
    function Console() {
	this.log = function(str) {
	    postMessage({type: "log", log: str});
	};
    }
    console = new Console();
}

