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

teien.UserInterface.createActor = function(name, actorInfo, userInterface) {
    if (this.creators[actorInfo.type] !== undefined) {
	return this.creators[actorInfo.type](name, actorInfo, userInterface);	
    }
    else {
	console.log("no such class: " + actorInfo.type);
	return null;
	
    }
};


// prototypes

teien.UserInterface.prototype.setup = function(model) {
    this.model = model;
    this.application.setup(model, this);
};

teien.UserInterface.prototype.createActorView = function(name, actorInfo, transform) {
    if (this.actors[name] !== undefined) {
	console.log("UserInterface: There is a actor with the same name: " + name);
	return this.actors[name];
    }
    else {
	var obj = teien.UserInterface.createActor(name, actorInfo, this);
	obj.setTransform(transform);
	obj.userInterface = this;
	this.actors[obj.name] = obj;
	obj.id = this.actorNum;
	this.actorNum += 1;

	return obj;
    }
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