
var HelloWorldUi = function() {
    var that = this;

    this.setup = function(model, userInterface) {
	this.model = model;
	this.userInterface = userInterface;


	this.userInterface.renderer.shadowMapEnabled = true;


	//var ambient = new THREE.AmbientLight( 0x0 );
        //this.userInterface.scene.add( ambient );

/*
	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set(-60,150,-30);

	spotLight.castShadow = true;

	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;

	spotLight.shadowCameraNear = 10;
	spotLight.shadowCameraFar = 500;
	spotLight.shadowCameraFov = 30;

	spotLight.shadowDarkness = 0.8;

	//spotLight.shadowCameraVisible = true;
	this.userInterface.scene.add(spotLight);
*/
	this.controls = new THREE.OrbitControls(this.userInterface.camera);

	this.movementSpeed = 1.0;
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;
    };

    this.update = function(delta) {

	if (this.freeze) return;

	var actualMoveSpeed = delta * this.movementSpeed;

	if ( this.moveForward )
	    this.controls.pan(new THREE.Vector3(0, 0,  -actualMoveSpeed));

	if ( this.moveBackward ) 
	    this.controls.pan(new THREE.Vector3(0, 0,  actualMoveSpeed));

	if ( this.moveLeft ) 
	    this.controls.pan(new THREE.Vector3(-actualMoveSpeed, 0, 0));

	if ( this.moveRight ) 
	    this.controls.pan(new THREE.Vector3(actualMoveSpeed, 0, 0));

	this.controls.update(delta);
    };


    this.onKeyDown = function ( event ) {
	switch ( event.keyCode ) {
	case 38: /*up*/
	case 87: /*W*/ that.moveForward = true; break;
	    
	case 37: /*left*/
	case 65: /*A*/ that.moveLeft = true; break;
	    
	case 40: /*down*/
	case 83: /*S*/ that.moveBackward = true; break;
	    
	case 39: /*right*/
	case 68: /*D*/ that.moveRight = true; break;
	    
	case 81: /*Q*/ that.freeze = !this.freeze; break;
	}
    };

    this.onKeyUp = function ( event ) {
	switch( event.keyCode ) {
	case 38: /*up*/
	case 87: /*W*/ that.moveForward = false; break;
	    
	case 37: /*left*/
	case 65: /*A*/ that.moveLeft = false; break;
	    
	case 40: /*down*/
	case 83: /*S*/ that.moveBackward = false; break;
	    
	case 39: /*right*/
	case 68: /*D*/ that.moveRight = false; break;
	}	
    };

    document.addEventListener( 'keydown', this.onKeyDown, false );
    document.addEventListener( 'keyup', this.onKeyUp, false );
};


var ui = new teien.UserInterface(HelloWorldUi);
var model = new Worker("./hello_world_model.js");

var browser = new teien.Browser(model, ui);
browser.run();

