(function (exports) {
     exports.World = World;

     function World(appModel) {
	 var that = this;
	 
	 this.actorManager = new exports.ActorManager();
	 this.application = new appModel(this);
	 
	 this.enableShadow = function(bl) {
	     this.actorManager.defaultShadow = bl;
	     postMessage({type: "shadow", flag: bl});
	 };
	 
	 this.update = function(delta) {
	     var now;
	     var delta;
	     
	     if (delta === undefined) {
		 now = Date.now();
		 delta = now - that.lastTime;
		 that.lastTime = now;
	     }
	     
	     that.actorManager.update(delta);
	     that.application.update(delta);
	     
	     var models = that.getAllModels();
	     postMessage({type: "update", models: models});
	 };
	 
	 onmessage = function(event) {
	     switch(event.data.type){
	     case "setup": 
		 that.setup();
		 break;
	     default:
	     };
	 };
     };
     
     World.prototype.setup = function() {
	 this.application.setup();    
	 
	 this.lastTime = Date.now();
	 setInterval(this.update, 1000 / 30);
     };
     
     
     World.prototype.getAllModels = function() {
	 var models = {};
	 
	 for(key in this.actorManager.actors) {
	     var model = {};
	     
	     model.actorInfo = this.actorManager.actors[key].actorInfo;
	     
	     var transform = this.actorManager.actors[key].getTransform();
	     model.transform = new exports.Transform(
		 exports.Vector3D.createFromAmmo(transform.getOrigin()),
		 exports.Quaternion.createFromAmmo(transform.getRotation()));
	     
	     models[key] = model;
	 }
	 
	 return models;
     };
     
 })(typeof teien === 'undefined' ? module.exports : teien);



