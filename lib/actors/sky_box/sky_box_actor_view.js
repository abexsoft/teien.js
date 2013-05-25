teien.SkyBoxActorView = function(name, objectInfo, userInterface) {
    var obj = new teien.ViewObject(userInterface);
    obj.name = name;
    obj.objectInfo = objectInfo;
    
    var materials = objectInfo.materials;
    var textureCube = THREE.ImageUtils.loadTextureCube(materials, new THREE.CubeRefractionMapping());
    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( 
	{
	    fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        } );
    
    obj.object = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), material );
    userInterface.scene.add(obj.object);
    
    return obj;
};

teien.UserInterface.setCreator(
    teien.SkyBoxActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.SkyBoxActorView(name, actorInfo, userInterface);
    }
);





