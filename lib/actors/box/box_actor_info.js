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
	 this.angularFactor = new teien.Vector3D(1.0, 1.0, 1.0);
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