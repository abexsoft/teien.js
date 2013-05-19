teien.SphereActor = function(actorInfo, actorManager) {
    teien.Actor.call(this, actorInfo, actorManager);

    this.physicsObject = new teien.PhysicsObject(actorInfo);
    var cShape = new Ammo.btSphereShape(actorInfo.radius);
    var inertia = new Ammo.btVector3();
    cShape.calculateLocalInertia(actorInfo.mass, inertia);
    this.physicsObject.createRigidBody(this, actorInfo, cShape, inertia);
    
    actorManager.physics.addPhysicsObject(this.physicsObject, actorInfo);
};

teien.SphereActor.prototype = Object.create(teien.Actor.prototype);
teien.SphereActor.prototype.constructor = teien.Actor;

teien.ActorManager.setCreator(
    teien.SphereActorInfo.prototype.type, 
    function(actorInfo, actorManager){
	return new teien.SphereActor(actorInfo, actorManager);
    }
);

