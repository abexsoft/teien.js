teien.JsonMeshActorView = function(name, actorInfo, userInterface) {
    teien.ActorView.call(this, userInterface);        

    var that = this;
    this.name = name;
    this.actorInfo = actorInfo;
    this.userInterface = userInterface;
    this.object = new THREE.Object3D();
    this.object.useQuaternion = true;
    userInterface.scene.add(this.object);

    var loader = new THREE.JSONLoader();
    loader.load(actorInfo.model, 
		function ( geometry, materials ) {
		    var material = materials[ 0 ];
                    material.morphTargets = true;
                    material.color.setHex( 0xffaaaa );
                    material.ambient.setHex( 0x222222 );
		    //console.log(material);

                    var faceMaterial = new THREE.MeshFaceMaterial( materials );
		    that.mesh = new THREE.MorphAnimMesh( geometry, faceMaterial );
		    
		    // one second duration
                    that.mesh.duration = 1000;
		    
                    // random animation offset
                    that.mesh.time = 1000 * Math.random();
		    
                    var s = THREE.Math.randFloat( 0.00075, 0.001 );
                    that.mesh.scale.set( s, s, s );

		    that.mesh.useQuaternion = true;
		    that.mesh.castShadow = actorInfo.castShadow;
		    that.mesh.receiveShadow = actorInfo.receiveShadow;

		    that.mesh.position.set(actorInfo.viewPositionOffset.x, 
					   actorInfo.viewPositionOffset.y,
					   actorInfo.viewPositionOffset.z);

		    that.object.add(that.mesh)

//		    
		}
	       );
};

teien.JsonMeshActorView.prototype = Object.create(teien.ActorView.prototype);
teien.JsonMeshActorView.prototype.constructor = teien.ActorView;

teien.JsonMeshActorView.prototype.setTransform = function(transform) {

    // takes a little longer to load a mesh.
    if (this.object === undefined)
	return;

    teien.ActorView.prototype.setTransform.call(this, transform);
};

teien.JsonMeshActorView.prototype.updateAnimation = function(delta) {
    this.mesh.updateAnimation(delta);
};


teien.UserInterface.setCreator(
    teien.JsonMeshActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.JsonMeshActorView(name, actorInfo, userInterface);
    }
);
