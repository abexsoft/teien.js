// The instance of this class is sent throght network. 
teien.SphereObjectInfo = function(radius) {
    this.radius = radius;
    this.textureName = null;

    this.usePhysics = true;

    this.type = teien.SphereObjectInfo.prototype.type;
};
teien.SphereObjectInfo.prototype.type = "sphere";

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