teien.UserInterface = function(appUi) {
    var that = this;
    this.application = new appUi(this);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    
    this.camera = new THREE.PerspectiveCamera(60, 
					      window.innerWidth / window.innerHeight, 
					      1, 1000 );
    this.camera.position.z = 20;
    this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    
    this.scene = new THREE.Scene();

    this.objects = {};
    this.objectNum = 0;



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

teien.UserInterface.createObject = function(name, objectInfo, userInterface) {
    if (this.creators[objectInfo.type] !== undefined) {
	return this.creators[objectInfo.type](name, objectInfo, userInterface);	
    }
    else {
	console.log("no such class: " + objectInfo.type);
	return null;
	
    }
};


// prototypes

teien.UserInterface.prototype.setup = function(model) {
    this.model = model;
    this.application.setup(model, this);
};

teien.UserInterface.prototype.createViewObject = function(name, objectInfo, transform) {
    if (this.objects[name] !== undefined) {
	console.log("UserInterface: There is a object with the same name: " + name);
	return this.objects[name];
    }
    else {
	var obj = teien.UserInterface.createObject(name, objectInfo, this);
	obj.setTransform(transform);
	obj.userInterface = this;
	this.objects[obj.name] = obj;
	obj.id = this.objectNum;
	this.objectNum += 1;

	return obj;
    }
};

//teien.UserInterface.prototype.update = function(worldModel) {
teien.UserInterface.prototype.update = function(models) {

    for (key in models) {
	var model = models[key];

	if (this.objects[key] === undefined) {
	    this.objects[key] = this.createViewObject(key, model.objectInfo, model.transform);
	}
	else {
	    this.objects[key].setTransform(model.transform);
	}
    }
};

teien.UserInterface.prototype.render = function(delta) {
    //console.log("render");
    this.renderer.render(this.scene, this.camera);
    this.application.update(delta);
};