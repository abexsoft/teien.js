// The instance of this class is sent throght network. 
teien.SpotLightActor = function(actorInfo, actorManager) {
    teien.Actor.call(this, actorInfo, actorManager);

    this.physicsObject = new teien.PhysicsObject(actorInfo);
    var cShape = new Ammo.btSphereShape(1);
    var inertia = new Ammo.btVector3();
    cShape.calculateLocalInertia(0, inertia);
    this.physicsObject.rigidBody = new Ammo.btRigidBody(0, this, cShape, inertia);
}

teien.SpotLightActor.prototype = Object.create(teien.Actor.prototype);
teien.SpotLightActor.prototype.constructor = teien.Actor;

teien.ActorManager.setCreator(
    teien.SpotLightActorInfo.prototype.type, 
    function(actorInfo, actorManager){
	return new teien.SpotLightActor(actorInfo, actorManager);
    }
);
