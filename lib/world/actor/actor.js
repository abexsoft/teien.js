teien.Actor = function(actorInfo, actorManager) {
    this.id = -1;
    this.name = null;

    this.manager = actorManager;
    this.actorInfo = actorInfo;

    // If this actor has a physics object only, use this value and Actor methods.
    this.physicsState = null;
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
    this.physicsState.setPosition(vec);
};

teien.Actor.prototype.updateTransform = function() {
    this.physicsState.updateTransform();
};

teien.Actor.prototype.getTransform = function() {
    return this.physicsState.getTransform();
};

teien.Actor.prototype.getPosition = function() {
    return this.physicsState.getPosition();
};

teien.Actor.prototype.getRotation = function() {
    return this.physicsState.getRotation();
};