teien.ActorManager = function() {
    this.physics = new teien.Physics(this);

    this.defaultShadow = false;
    this.actorNum = 0;
    this.actors = {};
};

teien.ActorManager.creators = {};

teien.ActorManager.setCreator = function(type, creator) {
    this.creators[type] = creator;
};

teien.ActorManager.prototype.createActor = function(name, actorInfo) {

    if (this.actors[name] !== undefined) {
	//console.log("There is a object with the same name: " + name);
	postMessage({type: "log", log: "There is a object with the same name: " + name});
	return this.actors[name];
    }
    else {
	if (teien.ActorManager.creators[actorInfo.type] !== undefined) {

	    if (this.defaultShadow) {
		if (actorInfo.castShadow === undefined)
		    actorInfo.castShadow = true;
		if (actorInfo.receiveShadow === undefined)
		    actorInfo.receiveShadow = true;
	    }

	    var actor = teien.ActorManager.creators[actorInfo.type](actorInfo, this);	
	    actor.name = name;
	    this.actors[name] = actor;
	    actor.id = this.actorNum;
	    this.actorNum += 1;

	    return actor;
	}
	else {
	    console.log("no such class: #{obj.object_info.class}");
	    return null;
	
	}
    }
};

teien.ActorManager.prototype.update = function(delta) {
    this.physics.update(delta);

    // update each object's transform here,
    // because set/getWorldTransform callback is not supported by Ammo.
    for (key in this.actors) {
	this.actors[key].updateTransform();
    };
};
