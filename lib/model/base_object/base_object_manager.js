teien.BaseObjectManager = function() {
    this.physics = new teien.Physics(this);

    this.defaultShadow = false;
    this.objectNum = 0;
    this.objects = {};
};

teien.BaseObjectManager.prototype.createObject = function(name, objectInfo, physicsInfo) {
    if (physicsInfo === undefined) physicsInfo = null;

    if (this.objects[name] !== undefined) {
	//console.log("There is a object with the same name: " + name);
	postMessage({type: "log", log: "There is a object with the same name: " + name});
	return this.objects[name];
    }
    else {
	var obj = new teien.BaseObject();
	obj.name = name;
	obj.objectInfo = objectInfo;
	obj.physicsInfo = physicsInfo;

	if (this.defaultShadow) {
	    if (obj.objectInfo.castShadow === undefined)
		obj.objectInfo.castShadow = true;
	    if (obj.objectInfo.receiveShadow === undefined)
		obj.objectInfo.receiveShadow = true;
	}

	obj.manager = this;
	this.objects[obj.name] = obj;
	obj.id = this.objectNum;
	this.objectNum += 1;
	this.physics.addPhysicsObject(obj);


	//notify(:create_object, obj)

	return obj;
    }
};

teien.BaseObjectManager.prototype.update = function(delta) {
    this.physics.update(delta);

    // update each object's transform here,
    // because set/getWorldTransform callback is not supported by Ammo.
    for (key in this.objects) {
	this.objects[key].updateTransform();
    };
};

