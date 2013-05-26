teien.BoxActorView = function(name, actorInfo, userInterface) {
    teien.ActorView.call(this, userInterface);    

    this.name = name;
    this.actorInfo = actorInfo;
    
    var texture = THREE.ImageUtils.loadTexture(actorInfo.textureName);
    texture.anisotropy = userInterface.renderer.getMaxAnisotropy();
    
    if (actorInfo.castShadow || actorInfo.receiveShadow)
	var material = new THREE.MeshLambertMaterial({ map: texture });
    else
	var material = new THREE.MeshBasicMaterial( { map: texture } );
    
    var geometry = new THREE.CubeGeometry(actorInfo.width, actorInfo.height, actorInfo.depth);
    this.object = new THREE.Mesh( geometry, material );
    this.object.useQuaternion = true;
    
    this.object.castShadow = actorInfo.castShadow;
    this.object.receiveShadow = actorInfo.receiveShadow;
    
    userInterface.scene.add(this.object);
};

teien.BoxActorView.prototype = Object.create(teien.ActorView.prototype);
teien.BoxActorView.prototype.constructor = teien.ActorView;

teien.UserInterface.setCreator(
    teien.BoxActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.BoxActorView(name, actorInfo, userInterface);
    }
);
