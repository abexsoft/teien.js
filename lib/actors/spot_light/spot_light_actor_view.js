teien.SpotLightActorView = function(name, objectInfo, userInterface) {
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
};

teien.UserInterface.setCreator(
    teien.SpotLightActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.SpotLightActorView(name, actorInfo, userInterface);
    }
);





