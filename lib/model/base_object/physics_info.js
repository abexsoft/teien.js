teien.PhysicsInfo = function(mass) {
    this.mass = mass;
    this.angularFactor = 1.0;
    this.restitution = 0.2;
    this.friction = 1.0;
    this.linearDamping = 0.0;
    this.angularDamping = 0.0;
    this.collisionFilter = null;
};