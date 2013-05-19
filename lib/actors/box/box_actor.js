teien.BoxActor = function(actorInfo, actorManager) {
    teien.Actor.call(this, actorInfo, actorManager);

    this.physicsObject = new teien.PhysicsObject(actorInfo);
    var cShape = new Ammo.btBoxShape(new Ammo.btVector3(actorInfo.width / 2,
							actorInfo.height / 2,
							actorInfo.depth / 2));
    var inertia = new Ammo.btVector3();
    cShape.calculateLocalInertia(actorInfo.mass, inertia);
    this.physicsObject.createRigidBody(this, actorInfo, cShape, inertia);
    
    actorManager.physics.addPhysicsObject(this.physicsObject, actorInfo);
};

teien.BoxActor.prototype = Object.create(teien.Actor.prototype);
teien.BoxActor.prototype.constructor = teien.Actor;

teien.ActorManager.setCreator(
    teien.BoxActorInfo.prototype.type, 
    function(actorInfo, actorManager){
	return new teien.BoxActor(actorInfo, actorManager);
    }
);

