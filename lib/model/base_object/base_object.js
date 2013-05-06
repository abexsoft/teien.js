teien.BaseObject = function() {
    this.id = -1;
/*
    @mode = MODE_FREE
    @attached_objects = Hash.new
*/
    this.manager = null;
    this.physicsObject = null;

    this.name = null;
    this.objectInfo = null;
    this.physicsInfo = null;
};

//teien.BaseObject.prototype = Object.create(Ammo.btMotionState.prototype);
//teien.BaseObject.prototype.constructor = teien.BaseObject;

teien.BaseObject.prototype.setPosition = function(vec) {
    this.physicsObject.transform.setOrigin(new Ammo.btVector3(vec.x(), vec.y(), vec.z()));
    if (this.physicsObject.rigidBody !== null)
	this.physicsObject.rigidBody.setCenterOfMassTransform(this.physicsObject.transform);
};

// These callbacks are not supported by Ammo.
/*
teien.BaseObject.prototype.setWorldTransform = function(worldTrans) {
    this.physicsObject.transform = new Ammo.btTransform(worldTrans);
    console.log("new set");
};

teien.BaseObject.prototype.getWorldTransform = function(worldTrans) {
    console.log("new get");
};
*/

teien.BaseObject.prototype.updateTransform = function() {
    this.physicsObject.transform = this.physicsObject.rigidBody.getCenterOfMassTransform();
};

teien.BaseObject.prototype.getTransform = function() {
    return this.physicsObject.transform;
};

teien.BaseObject.prototype.getPosition = function() {
    this.newPos = this.physicsObject.transform.getOrigin();
//    this.newPos = this.physicsObject.rigidBody.getCenterOfMassTransform().getOrigin();
    return this.newPos;
};