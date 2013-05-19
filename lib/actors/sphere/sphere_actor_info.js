// The instance of this class is sent throght network. 
teien.SphereActorInfo = function(radius) {
    this.radius = radius;

    // for physics
    this.usePhysics = true;
    this.mass = 0;
    this.angularFactor = new teien.Vector3D(1.0, 1.0, 1.0);
    this.restitution = 0.2;
    this.friction = 1.0;
    this.linearDamping = 0.0;
    this.angularDamping = 0.0;
    this.collisionFilter = null;

    // for visual
    this.textureName = null;
    
    this.type = teien.SphereActorInfo.prototype.type;
};
teien.SphereActorInfo.prototype.type = "sphere";

/*
if (teien.Physics !== undefined) {

    teien.Physics.setCreator(
	teien.SphereObjectInfo.prototype.type, 
	
	// Physics Object creator.
	function(obj, physics) {
	    var physicsObject = new teien.PhysicsObject(physics);
	    var cShape = new Ammo.btSphereShape(obj.objectInfo.radius);
	    var inertia = new Ammo.btVector3();
	    cShape.calculateLocalInertia(obj.physicsInfo.mass, inertia);
	    physicsObject.setRigidBody(obj, cShape, inertia);
	    
	    return physicsObject;
	}
    );
}


if (teien.UserInterface !== undefined) {

    teien.UserInterface.setCreator(
	teien.SphereObjectInfo.prototype.type, 
	
	// View Object
	function(name, objectInfo, userInterface) {
	    var obj = new teien.ViewObject(userInterface);
	    obj.name = name;
	    obj.objectInfo = objectInfo;
	    
	    var texture = THREE.ImageUtils.loadTexture(objectInfo.textureName);
	    texture.anisotropy = userInterface.renderer.getMaxAnisotropy();

	    if (objectInfo.castShadow || objectInfo.receiveShadow)
		var material = new THREE.MeshLambertMaterial({ map: texture });
	    else
		var material = new THREE.MeshBasicMaterial( { map: texture } );
	    
	    var geometry = new THREE.SphereGeometry(objectInfo.radius);
	    obj.object = new THREE.Mesh( geometry, material );
	    obj.object.useQuaternion = true;

	    obj.object.castShadow = objectInfo.castShadow;
	    obj.object.receiveShadow = objectInfo.receiveShadow;
	    
	    userInterface.scene.add(obj.object);
	    
	    return obj;
	}
    );
}
*/