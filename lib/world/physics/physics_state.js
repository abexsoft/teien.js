teien.PhysicsState = function(physics) {
    this.physics = physics;
    this.rigidBody = null;

    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.acceleration = new teien.Vector3D(0, 0, 0);

    this.maxHorizontalVelocity = 0;
    this.maxVerticalVelocity = 0;
};


teien.PhysicsState.prototype.setPosition = function(vec) {
    this.transform.setOrigin(new Ammo.btVector3(vec.x, vec.y, vec.z));
    if (this.rigidBody !== null)
	this.rigidBody.setCenterOfMassTransform(this.transform);
};

teien.PhysicsState.prototype.updateTransform = function() {
    this.transform = this.rigidBody.getCenterOfMassTransform();
};

teien.PhysicsState.prototype.getTransform = function() {
    return this.transform;
};

teien.PhysicsState.prototype.getPosition = function() {
//    this.newPos = this.physicsObject.rigidBody.getCenterOfMassTransform().getOrigin();
    return this.transform.getOrigin();
};

teien.PhysicsState.prototype.getRotation = function() {
    return this.transform.getRotation();
};