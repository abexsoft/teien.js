(function (exports) {
     exports.WorldServer = WorldServer;

     function WorldServer(Apl, indexHtml, publicRoot) {
	 var that = this;
	 this.actorManager = new exports.ActorManager();
	 this.application = new Apl(this);

	 var fs = require('fs');
	 var path = require('path');

	 var handler = function(req, res) {
	     var filePath;
	     if (req.url == '/') {
		 filePath = indexHtml;
	     } else {
		 filePath = publicRoot + req.url;
	     }
	     
	     var extname = path.extname(filePath);
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

	 var app = require('http').createServer(handler);
	 var io = require('socket.io').listen(app, {'log level': 1});
					      
	 app.listen(8080);
	 
	 io.sockets.on('connection', 
		       function (socket) {
			   console.log("connection");
			   socket.emit('news', { server: 'hello world' });
			   socket.on('test_event', function (data) {
					 console.log(data);
				     });

			   that.setup();
			   that.socket = socket;
		       });

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
	     
	     var models = that.getAllModels();
	     that.socket.emit('models', models);
//	     postMessage({type: "update", models: models});
	 };


     };

	 
     WorldServer.prototype.setup = function() {
	 this.application.setup();    
	 
	 this.lastTime = Date.now();
	 setInterval(this.update, 1000 / 30);
     };

     WorldServer.prototype.getAllModels = function() {
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

