teien.PhysicsObject = function(physics) {
    this.physics = physics;
    this.rigidBody = null;

    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.acceleration = new teien.Vector3D(0, 0, 0);

    this.maxHorizontalVelocity = 0;
    this.maxVerticalVelocity = 0;
};

teien.PhysicsObject.prototype.createRigidBody = function(actor, actorInfo, cShape, inertia, offset) {
    if (offset === undefined) offset = new teien.Vector3D(0, 0, 0);

    this.pivotShape = new Ammo.btCompoundShape();
    var localTrans = new Ammo.btTransform();
    localTrans.setIdentity();
    localTrans.setOrigin(offset);
    this.pivotShape.addChildShape(localTrans, cShape);
    this.cShape = cShape;
    this.rigidBody = new Ammo.btRigidBody(actorInfo.mass, actor, this.pivotShape, inertia);

    this.rigidBody.setAngularFactor(new Ammo.btVector3(actorInfo.angularFactor.x,
						       actorInfo.angularFactor.y,
						       actorInfo.angularFactor.z));
    this.rigidBody.setRestitution(actorInfo.restitution);
    this.rigidBody.setFriction(actorInfo.friction);
    this.rigidBody.setDamping(actorInfo.linearDamping, 
                              actorInfo.angularDamping);

    return this.rigidBody;
};

