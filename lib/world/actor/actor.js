(function (exports) {
     exports.Actor = Actor;

     function Actor(actorInfo, actorManager) {
	 this.id = -1;
	 this.name = null;
	 
	 this.manager = actorManager;
	 this.actorInfo = actorInfo;
	 
	 // If this actor has a physics object only, use this value and Actor methods.
	 this.physicsState = null;
     };
     
     //Actor.prototype = Object.create(Ammo.btMotionState.prototype);
     //Actor.prototype.constructor = exports.Actor;

     // These callbacks are not supported by Ammo.
     /*
      Actor.prototype.setWorldTransform = function(worldTrans) {
      this.physicsObject.transform = new Ammo.btTransform(worldTrans);
      console.log("new set");
      };

      Actor.prototype.getWorldTransform = function(worldTrans) {
      console.log("new get");
      };
      */

     Actor.prototype.setPosition = function(vec) {
	 this.physicsState.setPosition(vec);
     };

     Actor.prototype.updateTransform = function() {
	 this.physicsState.updateTransform();
     };

     Actor.prototype.getTransform = function() {
	 return this.physicsState.getTransform();
     };

     Actor.prototype.getPosition = function() {
	 return this.physicsState.getPosition();
     };

     Actor.prototype.getRotation = function() {
	 return this.physicsState.getRotation();
     };

 })(typeof teien === 'undefined' ? module.exports : teien);