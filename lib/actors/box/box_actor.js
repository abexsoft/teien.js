teien.BoxActor = function(actorInfo, actorManager) {
    teien.Actor.call(this, actorInfo, actorManager);

    var cShape = new Ammo.btBoxShape(new Ammo.btVector3(actorInfo.width / 2,
							actorInfo.height / 2,
							actorInfo.depth / 2));
    var inertia = new Ammo.btVector3();
    cShape.calculateLocalInertia(actorInfo.mass, inertia);

    var rb = actorManager.physics.createRigidBody(this, actorInfo, cShape, inertia);
    actorManager.physics.addRigidBody(rb, actorInfo);

    this.physicsState = new teien.PhysicsState(actorManager.physics);
    this.physicsState.rigidBody = rb;
};

teien.BoxActor.prototype = Object.create(teien.Actor.prototype);
teien.BoxActor.prototype.constructor = teien.Actor;

teien.ActorManager.setCreator(
    teien.BoxActorInfo.prototype.type, 
    function(actorInfo, actorManager){
	return new teien.BoxActor(actorInfo, actorManager);
    }
);

