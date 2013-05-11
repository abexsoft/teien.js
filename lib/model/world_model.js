teien.WorldModel = function(appModel) {
    var that = this;

    this.baseObjectManager = new teien.BaseObjectManager();
    this.application = new appModel(this);

    this.enableShadow = function(bl) {
	this.baseObjectManager.defaultShadow = bl;
	postMessage({type: "shadow", flag: bl});
    };

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
	model.transform = new teien.Transform(
	    teien.Vector3D.createFromAmmo(transform.getOrigin()),
	    teien.Quaternion.createFromAmmo(transform.getRotation()));

	models[key] = model;
    }

    return models;
};





