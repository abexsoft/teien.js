// The instance of this class is sent throght network. 
teien.SpotLightObjectInfo = function(color) {
    this.color = color;

    this.usePhysics = false;

    this.type = teien.SpotLightObjectInfo.prototype.type;
};
teien.SpotLightObjectInfo.prototype.type = "spotlight";

if (teien.Physics !== undefined) {

    teien.Physics.setCreator(
	teien.SpotLightObjectInfo.prototype.type, 
	
	// Physics Object creator.
	function(obj, physics) {

	    var physicsObject = new teien.PhysicsObject(new teien.PhysicsInfo(0));
	    var cShape = new Ammo.btSphereShape(new Ammo.btVector3(1, 1, 1));
	    var inertia = new Ammo.btVector3();
	    cShape.calculateLocalInertia(0, inertia);
	    //physicsObject.setRigidBody(obj, cShape, inertia);
	    physicsObject.rigidBody = new Ammo.btRigidBody(0, 
							   obj, 
							   cShape, 
							   inertia);
	    return physicsObject;
	}
    );
}

if (teien.UserInterface !== undefined) {

    teien.UserInterface.setCreator(
	teien.SpotLightObjectInfo.prototype.type, 
	
	// View Object
	function(name, objectInfo, userInterface) {
	    var obj = new teien.ViewObject(userInterface);
	    obj.name = name;
	    obj.objectInfo = objectInfo;
	    
	    obj.object = new THREE.SpotLight(obj.objectInfo.color);
	    obj.object.castShadow = obj.objectInfo.castShadow;

	    obj.object.shadowMapWidth = 1024;
	    obj.object.shadowMapHeight = 1024;

	    obj.object.shadowCameraNear = 10;
	    obj.object.shadowCameraFar = 500;
	    obj.object.shadowCameraFov = 30;

	    obj.object.shadowDarkness = 0.8;

	    obj.object.shadowCameraVisible = obj.objectInfo.shadowCameraVisible || false;

	    userInterface.scene.add(obj.object);
	    
	    return obj;
	}
    );
}