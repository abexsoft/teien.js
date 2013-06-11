(function (exports) {
     exports.WorldProxy = WorldProxy;

     function WorldProxy() {
	 var that = this;
	 var socket = io.connect('http://localhost');

	 socket.on('news', 
		   function (data) {
		       socket.emit('test_event', { proxy: 'hello world' });
		   });
	 
	 this.actorManager = new exports.ActorManager();
	 
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
     
     WorldProxy.prototype.setup = function() {
	 
	 this.lastTime = Date.now();
	 setInterval(this.update, 1000 / 30);
     };
     
     
     WorldProxy.prototype.getAllModels = function() {
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

