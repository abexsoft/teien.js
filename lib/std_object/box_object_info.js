// The instance of this class is sent throght network. 
teien.BoxObjectInfo = function(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.textureName = null;

    this.usePhysics = true;

    this.type = teien.BoxObjectInfo.prototype.type;
};
teien.BoxObjectInfo.prototype.type = "box";

if (teien.Physics !== undefined) {

    teien.Physics.setCreator(
	teien.BoxObjectInfo.prototype.type, 
	
	// Physics Object creator.
	function(obj, physics) {
	    var physicsObject = new teien.PhysicsObject(physics);
	    var cShape = new Ammo.btBoxShape(new Ammo.btVector3(obj.objectInfo.width / 2,
								obj.objectInfo.height / 2,
								obj.objectInfo.depth / 2));
	    var inertia = new Ammo.btVector3();
	    cShape.calculateLocalInertia(obj.physicsInfo.mass, inertia);
	    physicsObject.setRigidBody(obj, cShape, inertia);
	    
	    return physicsObject;
	}
    );
}


if (teien.UserInterface !== undefined) {

    teien.UserInterface.setCreator(
	teien.BoxObjectInfo.prototype.type, 
	
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
	    	    
	    var geometry = new THREE.CubeGeometry(objectInfo.width, objectInfo.height, objectInfo.depth);
	    obj.object = new THREE.Mesh( geometry, material );
	    obj.object.useQuaternion = true;

	    obj.object.castShadow = objectInfo.castShadow;
	    obj.object.receiveShadow = objectInfo.receiveShadow;
	    
	    userInterface.scene.add(obj.object);
	    
	    return obj;
	}
    );
}