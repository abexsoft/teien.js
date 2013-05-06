teien.PhysicsObject = function(physics) {
    this.physics = physics;
    this.rigidBody = null;

    this.transform = new Ammo.btTransform();
    this.transform.setIdentity();
    this.acceleration = new teien.Vector3D(0, 0, 0);

    this.maxHorizontalVelocity = 0;
    this.maxVerticalVelocity = 0;
};

teien.PhysicsObject.prototype.setRigidBody = function(obj, cShape, inertia, offset) {
    if (offset === undefined) offset = new teien.Vector3D(0, 0, 0);

    this.pivotShape = new Ammo.btCompoundShape();
    var localTrans = new Ammo.btTransform();
    localTrans.setIdentity();
    localTrans.setOrigin(offset);
    this.pivotShape.addChildShape(localTrans, cShape);
    this.cShape = cShape;
    this.rigidBody = new Ammo.btRigidBody(obj.physicsInfo.mass, obj, this.pivotShape, inertia);
    this.rigidBody.setAngularFactor(obj.physicsInfo.angularFactor);
    this.rigidBody.setRestitution(obj.physicsInfo.restitution);
    this.rigidBody.setFriction(obj.physicsInfo.friction);
    this.rigidBody.setDamping(obj.physicsInfo.linearDamping, 
                              obj.physicsInfo.angularDamping);

    return this.rigidBody;
};

