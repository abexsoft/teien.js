teien.BoxActorView = function(name, actorInfo, userInterface) {
    var obj = new teien.ViewObject(userInterface);
    obj.name = name;
    obj.actorInfo = actorInfo;
    
    var texture = THREE.ImageUtils.loadTexture(actorInfo.textureName);
    texture.anisotropy = userInterface.renderer.getMaxAnisotropy();
    
    if (actorInfo.castShadow || actorInfo.receiveShadow)
	var material = new THREE.MeshLambertMaterial({ map: texture });
    else
	var material = new THREE.MeshBasicMaterial( { map: texture } );
    
    var geometry = new THREE.CubeGeometry(actorInfo.width, actorInfo.height, actorInfo.depth);
    obj.object = new THREE.Mesh( geometry, material );
    obj.object.useQuaternion = true;
    
    obj.object.castShadow = actorInfo.castShadow;
    obj.object.receiveShadow = actorInfo.receiveShadow;
    
    userInterface.scene.add(obj.object);
    
    return obj;
};

teien.UserInterface.setCreator(
    teien.BoxActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.BoxActorView(name, actorInfo, userInterface);
    }
);
