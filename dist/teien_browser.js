
if (typeof exports === 'undefined'){
    var teien = {};
}

if (typeof importScripts !== 'undefined'){
    function Console() {
	this.log = function(str) {
	    postMessage({type: "log", log: str});
	};
    }
    console = new Console();
}




teien.Browser = function(worldWorker, userInterface) {
    var that = this;

    this.worldWorker = worldWorker;
    this.userInterface = userInterface;

    this.fpsCnt = 0;
    this.deltaSum = 0;
    this.deltaMax = 0;
    this.deltaMin = 1000;

    // requestAnimationFrame handler function.
    this.update = function() {
	requestAnimationFrame(that.update);

	var now = Date.now();
	var delta = now - that.lastTime;
	that.lastTime = now;

	that.userInterface.render(delta);

	that.showFps(delta);
    };

    this.worldWorker.onmessage = function(event) {
	switch(event.data.type) {
	case "log":  
	    console.log(event.data.log);
	    break;
	case "update":
	    that.userInterface.update(event.data.actors);
	    break;
	case "shadow":
	    that.userInterface.render.shadowMapEnabled = event.data.flag;
	    break;
	default:
	    console.log(event.data);
	};
    };
};

teien.Browser.prototype.run = function() {

    this.worldWorker.postMessage({type: "setup"});
    this.userInterface.setup(this.worldWorker);

    this.lastTime = Date.now();
    requestAnimationFrame(this.update)
};

teien.Browser.prototype.showFps = function(delta) {

    this.fpsCnt += 1;
    this.deltaSum += delta;

    if (delta > this.deltaMax) this.deltaMax = delta;
    if (delta < this.deltaMin) this.deltaMin = delta;

    if (this.fpsCnt > 60) {
	console.log("Min: " + this.deltaMin + 
		    ", Avg: " + this.deltaSum / this.fpsCnt +
		    ", Max: " + this.deltaMax);

	this.fpsCnt = 0;
	this.deltaSum = 0;
	this.deltaMax = 0;
	this.deltaMin = 1000;
    }
};




/**
 * These classes are used for follows.
 * 1. ammo.js-to-three.js communication.
 * 2. browser-to-worker and worker-to-node communications.
 */

(function (exports) {

     //
     // Vector3D
     //
     exports.Vector3D = Vector3D;

     function Vector3D(x, y, z) {
	 this.x = x || 0;
	 this.y = y || 0;
	 this.z = z || 0;
     };

     Vector3D.createFromAmmo = function(vec) {
	 return (new exports.Vector3D()).setFromAmmo(vec);
     };

     Vector3D.prototype.setFromAmmo = function(vec) {
	 this.x = vec.x();
	 this.y = vec.y();
	 this.z = vec.z();  
	 return this;
     };


     //
     // Quaternion
     //
     exports.Quaternion = Quaternion;

     function Quaternion(x, y, z, w) {
	 this.x = x || 0;
	 this.y = y || 0;
	 this.z = z || 0;
	 this.w = ( w !== undefined ) ? w : 1;
     };

     Quaternion.createFromAmmo = function(quat) {
	 return (new exports.Quaternion()).setFromAmmo(quat);
     };

     Quaternion.prototype.setFromAmmo = function(quat) {
	 this.x = quat.x();
	 this.y = quat.y();
	 this.z = quat.z();  
	 this.w = quat.w();  
	 return this;
     };


     //
     // Transform
     //
     exports.Transform = Transform;

     function Transform(position, rotation) {
	 this.position = position || new exports.Vector3D();
	 this.rotation = rotation || new exports.Quaternion();
     };

 })(typeof teien === 'undefined' ? module.exports : teien);



teien.UserInterface = function(applicationUi) {
    var that = this;
    this.application = new applicationUi(this);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    
    this.camera = new THREE.PerspectiveCamera(60, 
					      window.innerWidth / window.innerHeight, 
					      1, 1000 );
    this.camera.position.z = 20;
    this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    
    this.scene = new THREE.Scene();

    this.actors = {};
    this.actorNum = 0;

    this.onWindowResize = function() {
	that.camera.aspect = window.innerWidth / window.innerHeight;
	that.camera.updateProjectionMatrix();
    
	that.renderer.setSize( window.innerWidth, window.innerHeight );
    };
    window.addEventListener( 'resize', this.onWindowResize, false );
};

teien.UserInterface.creators = {};

teien.UserInterface.setCreator = function(type, creator) {
    this.creators[type] = creator;
};

///
// prototypes

teien.UserInterface.prototype.createActorView = function(name, actorInfo, transform) {
    if (this.actors[name] !== undefined) {
	console.log("UserInterface: There is a actor with the same name: " + name);
	return this.actors[name];
    }
    else {
	if (teien.UserInterface.creators[actorInfo.type] !== undefined) {
	    var actor = teien.UserInterface.creators[actorInfo.type](name, actorInfo, this);	

	    actor.setTransform(transform);
	    actor.userInterface = this;
	    this.actors[actor.name] = actor;
	    actor.id = this.actorNum;
	    this.actorNum += 1;

	    return actor;
	}
	else {
	    console.log("no such class: " + actorInfo.type);
	    return null;
	}
    }
};

teien.UserInterface.prototype.setup = function(model) {
    this.model = model;
    this.application.setup(model, this);
};

teien.UserInterface.prototype.update = function(models) {
    for (key in models) {
	var model = models[key];
	if (this.actors[key] === undefined) {
	    this.actors[key] = this.createActorView(key, model.actorInfo, model.transform);
	}
	else {
	    this.actors[key].setTransform(model.transform);
	}
    }
};

teien.UserInterface.prototype.render = function(delta) {
    for (key in this.actors) {
	if (this.actors[key].updateAnimation !== undefined)
	    this.actors[key].updateAnimation(delta);
    }

    this.application.update(delta);

    this.renderer.render(this.scene, this.camera);
};

teien.ActorView = function(userInterface) {
    this.userInterface = userInterface;
    this.objectInfo = null;
    this.mesh = null;
};

teien.ActorView.prototype.setTransform = function(transform) {

    this.object.position.x = transform.position.x;
    this.object.position.y = transform.position.y;
    this.object.position.z = transform.position.z;

    this.object.quaternion.x = transform.rotation.x;
    this.object.quaternion.y = transform.rotation.y;
    this.object.quaternion.z = transform.rotation.z;
    this.object.quaternion.w = transform.rotation.w;
};

(function (exports) {
     exports.BoxActorInfo = BoxActorInfo;

     // The instance of this class is sent throght network. 
     function BoxActorInfo(width, height, depth) {
	 this.width = width;
	 this.height = height;
	 this.depth = depth;
	 
	 // for physics
	 this.usePhysics = true;
	 this.mass = 0;
	 this.angularFactor = new exports.Vector3D(1.0, 1.0, 1.0);
	 this.restitution = 0.2;
	 this.friction = 1.0;
	 this.linearDamping = 0.0;
	 this.angularDamping = 0.0;
	 this.collisionFilter = null;
	 
	 // for visual
	 this.textureName = null;
	 
	 this.type = BoxActorInfo.prototype.type;
     };
     BoxActorInfo.prototype.type = "box";

 })(typeof teien === 'undefined' ? module.exports : teien);

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


(function (exports) {
     exports.SphereActorInfo = SphereActorInfo;

     // The instance of this class is sent throght network. 
     function SphereActorInfo(radius) {
	 this.radius = radius;

	 // for physics
	 this.usePhysics = true;
	 this.mass = 0;
	 this.angularFactor = new exports.Vector3D(1.0, 1.0, 1.0);
	 this.restitution = 0.2;
	 this.friction = 1.0;
	 this.linearDamping = 0.0;
	 this.angularDamping = 0.0;
	 this.collisionFilter = null;
	 
	 // for visual
	 this.textureName = null;
	 
	 this.type = exports.SphereActorInfo.prototype.type;
     };
     SphereActorInfo.prototype.type = "sphere";

 })(typeof teien === 'undefined' ? module.exports : teien);

teien.SphereActorView = function(name, actorInfo, userInterface) {
    teien.ActorView.call(this, userInterface);

    this.name = name;
    this.actorInfo = actorInfo;
    
    var texture = THREE.ImageUtils.loadTexture(actorInfo.textureName);
    texture.anisotropy = userInterface.renderer.getMaxAnisotropy();
    
    if (actorInfo.castShadow || actorInfo.receiveShadow)
	var material = new THREE.MeshLambertMaterial({ map: texture });
    else
	var material = new THREE.MeshBasicMaterial( { map: texture } );
    
    var geometry = new THREE.SphereGeometry(actorInfo.radius);
    this.object = new THREE.Mesh( geometry, material );
    this.object.useQuaternion = true;
    
    this.object.castShadow = actorInfo.castShadow;
    this.object.receiveShadow = actorInfo.receiveShadow;
    
    userInterface.scene.add(this.object);
};

teien.SphereActorView.prototype = Object.create(teien.ActorView.prototype);
teien.SphereActorView.prototype.constructor = teien.ActorView;

teien.UserInterface.setCreator(
    teien.SphereActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.SphereActorView(name, actorInfo, userInterface);
    }
);


(function (exports) {
     exports.SpotLightActorInfo = SpotLightActorInfo;

     // The instance of this class is sent throght network. 
     function SpotLightActorInfo(color) {
	 this.color = color;
	 this.usePhysics = false;
	 this.type = exports.SpotLightActorInfo.prototype.type;
     };
     SpotLightActorInfo.prototype.type = "spotlight";

 })(typeof teien === 'undefined' ? module.exports : teien);

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







(function (exports) {
     exports.SkyBoxActorInfo = SkyBoxActorInfo;

     // The instance of this class is sent throght network. 
     function SkyBoxActorInfo(materials) {
	 this.materials = materials;
	 this.usePhysics = false;
	 this.type = SkyBoxActorInfo.prototype.type;
     };
     SkyBoxActorInfo.prototype.type = "skybox";

 })(typeof teien === 'undefined' ? module.exports : teien);

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
    
    this.object = new THREE.Mesh( new THREE.CubeGeometry( 300, 300, 300 ), material );
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







(function (exports) {
     exports.JsonMeshActorInfo = JsonMeshActorInfo;

     // The instance of this class is sent throght network. 
     function JsonMeshActorInfo(model) {
	 this.model = model;
	 this.width = 1;
	 this.height = 1;
	 this.depth = 1;
	 
	 // for physics
	 this.usePhysics = true;
	 this.mass = 0;
	 this.angularFactor = new exports.Vector3D(1.0, 1.0, 1.0);
	 this.restitution = 0.2;
	 this.friction = 1.0;
	 this.linearDamping = 0.0;
	 this.angularDamping = 0.0;
	 this.collisionFilter = null;
	 
	 // for visual
	 this.textureName = null;
	 
	 this.type = exports.JsonMeshActorInfo.prototype.type;
     };
     JsonMeshActorInfo.prototype.type = "json";

 })(typeof teien === 'undefined' ? module.exports : teien);

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
    if (this.mesh)
	this.mesh.updateAnimation(delta);
};


teien.UserInterface.setCreator(
    teien.JsonMeshActorInfo.prototype.type, 
    function(name, actorInfo, userInterface) {
	return new teien.JsonMeshActorView(name, actorInfo, userInterface);
    }
);


