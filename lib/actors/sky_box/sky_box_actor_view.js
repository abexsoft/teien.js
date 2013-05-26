teien.SkyBoxActorView = function(name, objectInfo, userInterface) {
    teien.ActorView.call(this, userInterface);            
    this.name = name;
    this.objectInfo = objectInfo;
    
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
    
    this.object = new THREE.Mesh( new THREE.CubeGeometry( 100, 100, 100 ), material );
    userInterface.scene.add(this.object);
};

teien.SkyBoxActorView.prototype = Object.create(teien.ActorView.prototype);
teien.SkyBoxActorView.prototype.constructor = teien.ActorView;

teien.UserInterface.setCreator(
    teien.SkyBoxActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.SkyBoxActorView(name, actorInfo, userInterface);
    }
);





