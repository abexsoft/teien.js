
teien.Browser = function(worldWorker, userInterface) {
    var that = this;

    this.worldWorker = worldWorker;
    this.userInterface = userInterface;

    this.fpsCnt = 0;
    this.deltaSum = 0;
    this.deltaMax = 0;
    this.deltaMin = 1000;

    // requestAnimationFrame handler function.
    this.update = function() {
	requestAnimationFrame(that.update);

	var now = Date.now();
	var delta = now - that.lastTime;
	that.lastTime = now;

	that.userInterface.render(delta);

	that.showFps(delta);
    };

    this.worldWorker.onmessage = function(event) {
	switch(event.data.type) {
	case "log":  
	    console.log(event.data.log);
	    break;
	case "update":
	    that.userInterface.update(event.data.actors);
	    break;
	case "shadow":
	    that.userInterface.render.shadowMapEnabled = event.data.flag;
	    break;
	default:
	    console.log(event.data);
	};
    };
};

teien.Browser.prototype.run = function() {

    this.worldWorker.postMessage({type: "setup"});
    this.userInterface.setup(this.worldWorker);

    this.lastTime = Date.now();
    requestAnimationFrame(this.update)
};

teien.Browser.prototype.showFps = function(delta) {

    this.fpsCnt += 1;
    this.deltaSum += delta;

    if (delta > this.deltaMax) this.deltaMax = delta;
    if (delta < this.deltaMin) this.deltaMin = delta;

    if (this.fpsCnt > 60) {
	console.log("Min: " + this.deltaMin + 
		    ", Avg: " + this.deltaSum / this.fpsCnt +
		    ", Max: " + this.deltaMax);

	this.fpsCnt = 0;
	this.deltaSum = 0;
	this.deltaMax = 0;
	this.deltaMin = 1000;
    }
};


