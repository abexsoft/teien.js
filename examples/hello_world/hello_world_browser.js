
var HelloWorldBrowser = function() {
    var that = this;

    this.setup = function(world, userInterface) {
	this.world = world;
	this.userInterface = userInterface;

	this.userInterface.renderer.shadowMapEnabled = true;

	this.userInterface.camera.useQuaternion = true;
	this.userInterface.camera.position.set(0, 5, 10);
	this.controls = new THREE.OrbitControls(this.userInterface.camera);


//	this.userInterface.scene.add( new THREE.AmbientLight( 0xcccccc ) );


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

	case 82: /*r*/
	}	
    };

    this.onMouseDown = function(event) {

	event.preventDefault();
	event.stopPropagation();

	switch ( event.button ) {
	case 0: that.leftMouse = true; 
	    var pos = that.userInterface.camera.position;
	    var dir = new THREE.Vector3(0, 0, -1);
	    dir.applyQuaternion(that.userInterface.camera.quaternion);

	    world.postMessage({type: "shotbox",
			       pos: pos,
			       dir: dir
			      });
	    break;
	case 2: that.rightMouse= true; 
	    console.log("right mouse");
	    break;
	}
    };

    document.addEventListener( 'keydown', this.onKeyDown, false );
    document.addEventListener( 'keyup', this.onKeyUp, false );
    document.addEventListener( 'mousedown', this.onMouseDown, false );
};


var ui = new teien.UserInterface(HelloWorldBrowser);
var world = new Worker("./hello_world.js");

var browser = new teien.Browser(world, ui);
browser.run();

