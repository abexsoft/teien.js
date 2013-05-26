teien.SpotLightActorView = function(name, objectInfo, userInterface) {
    teien.ActorView.call(this, userInterface);            
    this.name = name;
    this.objectInfo = objectInfo;
    
    this.object = new THREE.SpotLight(this.objectInfo.color);
    this.object.castShadow = this.objectInfo.castShadow;
    
    this.object.shadowMapWidth = 1024;
    this.object.shadowMapHeight = 1024;
    
    this.object.shadowCameraNear = 10;
    this.object.shadowCameraFar = 500;
    this.object.shadowCameraFov = 30;
    
    this.object.shadowDarkness = 0.8;
    
    this.object.shadowCameraVisible = this.objectInfo.shadowCameraVisible || false;
    
    userInterface.scene.add(this.object);
};

teien.SpotLightActorView.prototype = Object.create(teien.ActorView.prototype);
teien.SpotLightActorView.prototype.constructor = teien.ActorView;

teien.UserInterface.setCreator(
    teien.SpotLightActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.SpotLightActorView(name, actorInfo, userInterface);
    }
);





