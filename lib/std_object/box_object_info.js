teien.Transform = function() {
    this.position = {x: 0, y: 0, z:0};  
    this.rotation = {x: 0, y: 0, z:0, w: 1};  
};


// The instance of this class is sent throght network. 
teien.BoxObjectInfo = function(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.textureName = null;

    this.usePhysics = true;

    this.type = "box";
};
teien.BoxObjectInfo.prototype.type = "box";

if (teien.Physics !== undefined) {

    teien.Physics.setCreator(
	teien.BoxObjectInfo.prototype.type, 
	
	// Physics Object creator.
	function(obj, physics) {
	    var physicsObject = new teien.PhysicsObject(physics);
	    var cShape = new Ammo.btBoxShape(new Ammo.btVector3(obj.objectInfo.width,
								obj.objectInfo.height,
								obj.objectInfo.depth));
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
	    var material = new THREE.MeshBasicMaterial( { map: texture } );
	    
	    var geometry = new THREE.CubeGeometry(objectInfo.width, objectInfo.height, objectInfo.depth);
	    obj.mesh = new THREE.Mesh( geometry, material );
	    obj.mesh.useQuaternion = true;
	    
	    userInterface.scene.add(obj.mesh);
	    
	    return obj;
	}
    );
}