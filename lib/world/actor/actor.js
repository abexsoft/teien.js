teien.Actor = function(actorInfo, actorManager) {
    this.id = -1;
    this.name = null;

    this.manager = actorManager;
    this.actorInfo = actorInfo;

    // If this actor has a physics object only, use this value and Actor methods.
    this.physicsObject = null;
};

//teien.Actor.prototype = Object.create(Ammo.btMotionState.prototype);
//teien.Actor.prototype.constructor = teien.Actor;

// These callbacks are not supported by Ammo.
/*
teien.Actor.prototype.setWorldTransform = function(worldTrans) {
    this.physicsObject.transform = new Ammo.btTransform(worldTrans);
    console.log("new set");
};

teien.Actor.prototype.getWorldTransform = function(worldTrans) {
    console.log("new get");
};
*/

teien.Actor.prototype.setPosition = function(vec) {
    this.physicsObject.transform.setOrigin(new Ammo.btVector3(vec.x, vec.y, vec.z));
    if (this.physicsObject.rigidBody !== null)
	this.physicsObject.rigidBody.setCenterOfMassTransform(this.physicsObject.transform);
};

teien.Actor.prototype.updateTransform = function() {
    this.physicsObject.transform = this.physicsObject.rigidBody.getCenterOfMassTransform();
};

teien.Actor.prototype.getTransform = function() {
    return this.physicsObject.transform;
};

teien.Actor.prototype.getPosition = function() {
    this.newPos = this.physicsObject.transform.getOrigin();
//    this.newPos = this.physicsObject.rigidBody.getCenterOfMassTransform().getOrigin();
    return this.newPos;
};

teien.Actor.prototype.getRotation = function() {
    return this.physicsObject.transform.getRotation();
};