(function (exports) {
     exports.WorldServer = WorldServer;

     function WorldServer(Apl, indexHtml, publicRoot, port) {
	 var that = this;
	 this.actorManager = new exports.ActorManager();
	 this.application = new Apl(this);

	 this.indexHtml = indexHtml;
	 this.publicRoot = publicRoot;
	 this.port = port;

	 this.syncTimePeriod = 300;
	 this.lastSyncTime = 0;

	 this.firstConnection = true;
	 this.sockets = [];

	 var fs = require('fs');
	 var path = require('path');

	 this.handler = function(req, res) {
	     var filePath;
	     if (req.url == '/') {
		 filePath = that.indexHtml;
	     } 
	     else {
		 filePath = that.publicRoot + req.url;
	     }
	     
	     var extname = path.extname(filePath);
	     var contentType = that.getContentType(extname);
	     
	     path.exists(filePath, 
			 function(exists) {
			     console.log("load: " + filePath);

			     if (exists) {
				 fs.readFile(filePath, 
					     function(error, content) {
						 if (error) {
						     res.writeHead(500);
						     res.end();
						 }
						 else {
						     res.writeHead(200, 
								   { 'Content-Type': contentType });
						     res.end(content, 'utf-8');
						 }
					     });
			     }
			     else {
				 res.writeHead(404);
				 res.end();
			     }
			 });
	 };

	 this.getContentType = function(extname) {
	     var contentType = 'text/plain';

	     switch (extname) {
	     case '.html':
	     case '.htm':
		 contentType = 'text/html';
		 break;
	     case '.js':
		 contentType = 'text/javascript';
		 break;
	     case '.css':
		 contentType = 'text/css';
		 break;
	     case '.jpg':
		 contentType = 'image/jpeg';
		 break;
	     case '.gif':
		 contentType = 'image/gif';
		 break;
	     case '.png':
		 contentType = 'image/png';
		 break;
	     }
	     
	     return contentType;
	 };


	 this.enableShadow = function(bl) {
	     this.actorManager.defaultShadow = bl;
//	     postMessage({type: "shadow", flag: bl});
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

	     if ((now - that.lastSyncTime) > that.syncTimePeriod) {
		 var actors = that.getAllActors();
		 for(var i = 0; i < that.sockets.length; i++ ){
		     that.sockets[i].emit('actors', actors);
		 }
		 that.lastSyncTime = now;
	     }
	 };

	 this.run = function() {
	     var app = require('http').createServer(this.handler);
	     var io = require('socket.io').listen(app, {'log level': 1});
					      
	     app.listen(this.port);
	     console.log("starting server: " + this.port);
	 
	     io.sockets.on('connection', 
			   function (socket) {
			       console.log("connection");
			       socket.emit('news', { server: 'hello world' });
			       socket.on('test_event', 
					 function (data) {
					     console.log(data);
					 });

			       if (that.firstConnection){
				   that.setup();
				   that.firstConnection = false;
			       }
			       that.sockets.push(socket);
			   });
	 };
     };
	 
     WorldServer.prototype.setup = function() {
	 this.application.setup();    
	 
	 this.lastTime = Date.now();
	 setInterval(this.update, 1000 / 30);
     };

     WorldServer.prototype.getAllActors = function() {
	 var actors = {};
	 
	 for(key in this.actorManager.actors) {
	     var actor = {};
	     
	     // actorInfo
	     actor.actorInfo = this.actorManager.actors[key].actorInfo;
	     
	     // transform
	     var transform = this.actorManager.actors[key].getTransform();
	     actor.transform = new exports.Transform(
		 exports.Vector3D.createFromAmmo(transform.getOrigin()),
		 exports.Quaternion.createFromAmmo(transform.getRotation()));

	     // linearVelocity
	     var linearVelocity = this.actorManager.actors[key].getLinearVelocity();
	     actor.linearVelocity = new exports.Vector3D.createFromAmmo(linearVelocity);
	     
	     actors[key] = actor;
	 }
	 
	 return actors;
     };
     

     

 })(typeof teien === 'undefined' ? module.exports : teien);

