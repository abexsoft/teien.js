teien.WorldModel = function(appModel) {
    var that = this;
    this.baseObjectManager = new teien.BaseObjectManager();
    this.application = new appModel(this);

    this.update = function(delta) {
	var now;
	var delta;
	
	if (delta === undefined) {
	    now = Date.now();
	    delta = now - that.lastTime;
	    that.lastTime = now;
	}
	
	that.baseObjectManager.update(delta);
	that.application.update(delta);

	var models = that.getAllModels();
	postMessage({type: "update", models: models});
    };

    onmessage = function(event) {
	switch(event.data.type){
	case "setup": 
	    that.setup();
	    break;
	default:
	};
    };
};

teien.WorldModel.prototype.setup = function() {
    this.application.setup();    

    this.lastTime = Date.now();
    setInterval(this.update, 1000 / 30);
};


teien.WorldModel.prototype.getAllModels = function() {
    var models = {};

    for(key in this.baseObjectManager.objects) {
	var model = {};
	
	model.objectInfo = this.baseObjectManager.objects[key].objectInfo;

	var transform = this.baseObjectManager.objects[key].getTransform();
	var origin = transform.getOrigin();
	var quat = transform.getRotation();
	var trans = new teien.Transform();
	trans.position.x = origin.x();
	trans.position.y = origin.y();
	trans.position.z = origin.z();
	trans.rotation.x = quat.x();
	trans.rotation.y = quat.y();
	trans.rotation.z = quat.z();
	trans.rotation.w = quat.w();
	model.transform = trans;

	models[key] = model;
    }

    return models;
};





