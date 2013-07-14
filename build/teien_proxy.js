
if (typeof exports === 'undefined'){
    var teien = {};
}

if (typeof importScripts !== 'undefined'){
    function Console() {
	this.log = function(str) {
	    postMessage({type: "log", log: str});
	};
    }
    console = new Console();
}



/**
 * These classes are used for follows.
 * 1. ammo.js-to-three.js communication.
 * 2. browser-to-worker and worker-to-node communications.
 */

(function (exports) {

     //
     // Vector3D
     //
     exports.Vector3D = Vector3D;

     function Vector3D(x, y, z) {
	 this.x = x || 0;
	 this.y = y || 0;
	 this.z = z || 0;
     };

     Vector3D.createFromAmmo = function(vec) {
	 return (new exports.Vector3D()).setFromAmmo(vec);
     };

     Vector3D.prototype.setFromAmmo = function(vec) {
	 this.x = vec.x();
	 this.y = vec.y();
	 this.z = vec.z();  
	 return this;
     };


     //
     // Quaternion
     //
     exports.Quaternion = Quaternion;

     function Quaternion(x, y, z, w) {
	 this.x = x || 0;
	 this.y = y || 0;
	 this.z = z || 0;
	 this.w = ( w !== undefined ) ? w : 1;
     };

     Quaternion.createFromAmmo = function(quat) {
	 return (new exports.Quaternion()).setFromAmmo(quat);
     };

     Quaternion.prototype.setFromAmmo = function(quat) {
	 this.x = quat.x();
	 this.y = quat.y();
	 this.z = quat.z();  
	 this.w = quat.w();  
	 return this;
     };


     //
     // Transform
     //
     exports.Transform = Transform;

     function Transform(position, rotation) {
	 this.position = position || new exports.Vector3D();
	 this.rotation = rotation || new exports.Quaternion();
     };

 })(typeof teien === 'undefined' ? module.exports : teien);



(function (exports) {
     exports.Physics = Physics;

     function Physics(objectManager) {
	 this.objectManager = objectManager;

	 this.rigidBodies = [];
	 this.maxSubSteps = 1;
	 this.fixedTimeStep = 1.0 / 60.0;
	 
	 var collisionConfig = new Ammo.btDefaultCollisionConfiguration();
	 var collisionDispatcher = new Ammo.btCollisionDispatcher(collisionConfig);
	 
	 var worldAabbMin = new Ammo.btVector3(-3000.0,-500.0, -3000.0);
	 var worldAabbMax = new Ammo.btVector3(3000.0, 500.0, 3000.0);
	 var maxProxies = 1024 * 4;
	 var aabbCache = new Ammo.btAxisSweep3(worldAabbMin, worldAabbMax, maxProxies);
	 
	 var solver = new Ammo.btSequentialImpulseConstraintSolver();
	 
	 this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(collisionDispatcher, 
							       aabbCache,
                                                               solver, 
							       collisionConfig);
	 
	 var gravity = new Ammo.btVector3(0.0, -9.8, 0.0);
	 this.dynamicsWorld.setGravity(gravity);
     };

     Physics.prototype.createRigidBody = function(motionState, actorInfo, cShape, inertia) {
	 if (actorInfo.physicsPositionOffset === undefined) 
	     var offset = new exports.Vector3D(0, 0, 0);
	 else
	     var offset = actorInfo.physicsPositionOffset;
	 
	 var localTrans = new Ammo.btTransform();
	 localTrans.setIdentity();
	 localTrans.setOrigin(offset);
	 var pivotShape = new Ammo.btCompoundShape();
	 pivotShape.addChildShape(localTrans, cShape);
	 
	 var rigidBody = new Ammo.btRigidBody(actorInfo.mass, motionState, pivotShape, inertia);
	 rigidBody.setAngularFactor(new Ammo.btVector3(actorInfo.angularFactor.x,
						       actorInfo.angularFactor.y,
						       actorInfo.angularFactor.z));
	 rigidBody.setRestitution(actorInfo.restitution);
	 rigidBody.setFriction(actorInfo.friction);
	 rigidBody.setDamping(actorInfo.linearDamping, 
                              actorInfo.angularDamping);
	 
	 return rigidBody;
     };

     Physics.prototype.addRigidBody = function(rigidBody, actorInfo) {
	 if (actorInfo.usePhysics === false || rigidBody === null)
	     return;
	 
	 if (actorInfo.collisionFilter) {
	     this.dynamicsWorld.addRigidBody(rigidBody, 
					     actorInfo.collisionFilter.group, 
					     actorInfo.collisionFilter.mask);
	 }
	 else
	     this.dynamicsWorld.addRigidBody(rigidBody);
	 
	 this.rigidBodies.push(rigidBody);
     };    
     
     Physics.prototype.delRigidBody = function(rigidBody) {
	 this.rigidBodies.delete(rigidBody);
	 this.dynamicsWorld.removeRigidBody(rigidBody);
     };
     
     Physics.prototype.update = function(delta) {
	 //    console.log(delta);
	 this.dynamicsWorld.stepSimulation(delta / 1000, this.maxSubSteps, this.fixedTimeStep);
     };
     
 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.PhysicsState = PhysicsState;
     
     function PhysicsState(physics) {
	 this.physics = physics;
	 this.rigidBody = null;
	 
	 this.transform = new Ammo.btTransform();
	 this.transform.setIdentity();
	 this.acceleration = new exports.Vector3D(0, 0, 0);
	 
	 this.maxHorizontalVelocity = 0;
	 this.maxVerticalVelocity = 0;
     };

     PhysicsState.prototype.setPosition = function(vec) {
	 this.transform.setOrigin(new Ammo.btVector3(vec.x, vec.y, vec.z));
	 if (this.rigidBody !== null)
	     this.rigidBody.setCenterOfMassTransform(this.transform);
     };

     PhysicsState.prototype.setInterpolatePosition = function(vec) {
	 var oldVec = this.getPosition();
	 var ipVec = new Ammo.btVector3((vec.x + oldVec.x()) / 2, 
					(vec.y + oldVec.y()) / 2, 
					(vec.z + oldVec.z()) / 2);
	 //console.log("(" + ipVec.x() + ", " + ipVec.y() + ", " + ipVec.z() +")");

	 this.transform.setOrigin(ipVec);
	 if (this.rigidBody !== null)
	     this.rigidBody.setCenterOfMassTransform(this.transform);
     };

     PhysicsState.prototype.setLinearVelocity = function(vec) {
	 this.rigidBody.setLinearVelocity(new Ammo.btVector3(vec.x, vec.y, vec.z));
     };

     PhysicsState.prototype.setRotation = function(quat) {
	 this.transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
	 if (this.rigidBody !== null)
	     this.rigidBody.setCenterOfMassTransform(this.transform);
     };

     
     PhysicsState.prototype.updateTransform = function() {
	 this.transform = this.rigidBody.getCenterOfMassTransform();
     };
     
     PhysicsState.prototype.getTransform = function() {
	 return this.transform;
     };
     
     PhysicsState.prototype.getPosition = function() {
	 return this.transform.getOrigin();
     };

     PhysicsState.prototype.getLinearVelocity = function() {
	 return this.rigidBody.getLinearVelocity();
     };

     PhysicsState.prototype.getRotation = function() {
	 return this.transform.getRotation();
     };

     PhysicsState.prototype.applyImpulse= function(imp, rel) {
	 this.rigidBody.activate(true);
	 this.rigidBody.applyImpulse(new Ammo.btVector3(imp.x, imp.y, imp.z),
				     new Ammo.btVector3(rel.x, rel.y, rel.z));
     };

 })(typeof teien === 'undefined' ? module.exports : teien);

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

     // vec: teien.Vector3D
     Actor.prototype.setPosition = function(vec) {
	 this.physicsState.setPosition(vec);
     };

     // vec: teien.Vector3D
     Actor.prototype.setInterpolatePosition = function(vec) {
	 this.physicsState.setInterpolatePosition(vec);
     };

     // quat: teien.Quaternion
     Actor.prototype.setRotation = function(quat) {
	 this.physicsState.setRotation(quat);
     };

     Actor.prototype.setLinearVelocity = function(vec) {
	 this.physicsState.setLinearVelocity(vec);
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

     Actor.prototype.getLinearVelocity = function() {
	 return this.physicsState.getLinearVelocity();
     };

     Actor.prototype.getRotation = function() {
	 return this.physicsState.getRotation();
     };

     Actor.prototype.applyImpulse = function(imp, rel) {
	 if (rel === undefined)
	     rel = new exports.Vector3D(0, 0, 0);

	 this.physicsState.applyImpulse(imp, rel);
     };


 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.ActorManager = ActorManager;

     function ActorManager() {
	 this.physics = new exports.Physics(this);
	 
	 this.defaultShadow = false;
	 this.actorNum = 0;
	 this.actors = {};
     };
     
     ActorManager.creators = {};

     ActorManager.setCreator = function(type, creator) {
	 this.creators[type] = creator;
     };

     ActorManager.prototype.createActor = function(name, actorInfo) {
	 if (this.actors[name] !== undefined) {
	     console.log("There is a object with the same name: " + name);
	     return this.actors[name];
	 }
	 else {
	     if (exports.ActorManager.creators[actorInfo.type] !== undefined) {
		 
		 if (this.defaultShadow) {
		     if (actorInfo.castShadow === undefined)
			 actorInfo.castShadow = true;
		     if (actorInfo.receiveShadow === undefined)
			 actorInfo.receiveShadow = true;
		 }
		 
		 var actor = exports.ActorManager.creators[actorInfo.type](actorInfo, this);	
		 actor.name = name;
		 this.actors[name] = actor;
		 actor.id = this.actorNum;
		 this.actorNum += 1;
		 
		 return actor;
	     }
	     else {
		 console.log("no such class: #{obj.object_info.class}");
		 return null;
		 
	     }
	 }
     };

     ActorManager.prototype.update = function(delta) {
	 this.physics.update(delta);
	 
	 // update each object's transform here,
	 // because set/getWorldTransform callback is not supported by Ammo.
	 for (name in this.actors) {
	     this.actors[name].updateTransform();
	 };
     };

     ActorManager.prototype.merge = function(actors) {
	 for (name in actors) {
	     if (this.actors[name] === undefined){
		 this.actors[name] = this.createActor(name, actors[name].actorInfo);
	     }

	     var transform = actors[name].transform;
	     this.actors[name].setInterpolatePosition(transform.position);
	     //this.actors[name].setPosition(transform.position);
	     this.actors[name].setRotation(transform.rotation);

	     this.actors[name].setLinearVelocity(actors[name].linearVelocity);
	 }
     };

 })(typeof teien === 'undefined' ? module.exports : teien);

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
	     
	     var actors = that.getAllActors();
	     postMessage({type: "update", actors: actors});
	 };

	 this.run = function() {
	     onmessage = function(event) {
		 switch(event.data.type){
		 case "setup": 
		     that.setup();
		     break;
		 default:
		     console.log(event.data.type);
		     that.application.onMessage(event);
		     break;
		 };
	     };
	 };
	 
     };
     
     World.prototype.setup = function() {
	 this.application.setup();    
	 
	 this.lastTime = Date.now();
	 setInterval(this.update, 1000 / 30);
     };
     
     
     World.prototype.getAllActors = function() {
	 var actors = {};
	 
	 for(key in this.actorManager.actors) {
	     var actor = {};
	     
	     actor.actorInfo = this.actorManager.actors[key].actorInfo;
	     
	     var transform = this.actorManager.actors[key].getTransform();
	     actor.transform = new exports.Transform(
		 exports.Vector3D.createFromAmmo(transform.getOrigin()),
		 exports.Quaternion.createFromAmmo(transform.getRotation()));
	     
	     actors[key] = actor;
	 }
	 
	 return actors;
     };
     
 })(typeof teien === 'undefined' ? module.exports : teien);





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
	 this.angularFactor = new exports.Vector3D(1.0, 1.0, 1.0);
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

(function (exports) {
     exports.BoxActor = BoxActor;

     function BoxActor(actorInfo, actorManager) {
	 exports.Actor.call(this, actorInfo, actorManager);
	 
	 var cShape = new Ammo.btBoxShape(new Ammo.btVector3(actorInfo.width / 2,
							     actorInfo.height / 2,
							     actorInfo.depth / 2));
	 var inertia = new Ammo.btVector3();
	 cShape.calculateLocalInertia(actorInfo.mass, inertia);
	 
	 var rb = actorManager.physics.createRigidBody(this, actorInfo, cShape, inertia);
	 actorManager.physics.addRigidBody(rb, actorInfo);
	 
	 this.physicsState = new exports.PhysicsState(actorManager.physics);
	 this.physicsState.rigidBody = rb;
     };

     BoxActor.prototype = Object.create(exports.Actor.prototype);
     BoxActor.prototype.constructor = exports.Actor;

     exports.ActorManager.setCreator(
	 exports.BoxActorInfo.prototype.type, 
	 function(actorInfo, actorManager){
	     return new BoxActor(actorInfo, actorManager);
	 }
     );

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.SphereActorInfo = SphereActorInfo;

     // The instance of this class is sent throght network. 
     function SphereActorInfo(radius) {
	 this.radius = radius;

	 // for physics
	 this.usePhysics = true;
	 this.mass = 0;
	 this.angularFactor = new exports.Vector3D(1.0, 1.0, 1.0);
	 this.restitution = 0.2;
	 this.friction = 1.0;
	 this.linearDamping = 0.0;
	 this.angularDamping = 0.0;
	 this.collisionFilter = null;
	 
	 // for visual
	 this.textureName = null;
	 
	 this.type = exports.SphereActorInfo.prototype.type;
     };
     SphereActorInfo.prototype.type = "sphere";

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.SphereActor = SphereActor;

     function SphereActor(actorInfo, actorManager) {
	 exports.Actor.call(this, actorInfo, actorManager);
	 
	 var cShape = new Ammo.btSphereShape(actorInfo.radius);
	 var inertia = new Ammo.btVector3();
	 cShape.calculateLocalInertia(actorInfo.mass, inertia);
	 
	 var rb = actorManager.physics.createRigidBody(this, actorInfo, cShape, inertia);
	 actorManager.physics.addRigidBody(rb, actorInfo);
	 
	 this.physicsState = new exports.PhysicsState(actorManager.physics);
	 this.physicsState.rigidBody = rb;
     };

     SphereActor.prototype = Object.create(exports.Actor.prototype);
     SphereActor.prototype.constructor = exports.Actor;

     exports.ActorManager.setCreator(
	 exports.SphereActorInfo.prototype.type, 
	 function(actorInfo, actorManager){
	     return new exports.SphereActor(actorInfo, actorManager);
	 }
     );
 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.SpotLightActorInfo = SpotLightActorInfo;

     // The instance of this class is sent throght network. 
     function SpotLightActorInfo(color) {
	 this.color = color;
	 this.usePhysics = false;
	 this.type = exports.SpotLightActorInfo.prototype.type;
     };
     SpotLightActorInfo.prototype.type = "spotlight";

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.SpotLightActor = SpotLightActor;

     // The instance of this class is sent throght network. 
     function SpotLightActor(actorInfo, actorManager) {
	 exports.Actor.call(this, actorInfo, actorManager);

	 var cShape = new Ammo.btSphereShape(1);
	 var inertia = new Ammo.btVector3();
	 cShape.calculateLocalInertia(0, inertia);

	 this.physicsState = new exports.PhysicsState(actorManager.physics);
	 this.physicsState.rigidBody = new Ammo.btRigidBody(0, this, cShape, inertia);
     }

     SpotLightActor.prototype = Object.create(exports.Actor.prototype);
     SpotLightActor.prototype.constructor = exports.Actor;

     exports.ActorManager.setCreator(
	 exports.SpotLightActorInfo.prototype.type, 
	 function(actorInfo, actorManager){
	     return new SpotLightActor(actorInfo, actorManager);
	 }
     );

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.SkyBoxActorInfo = SkyBoxActorInfo;

     // The instance of this class is sent throght network. 
     function SkyBoxActorInfo(materials) {
	 this.materials = materials;
	 this.usePhysics = false;
	 this.type = SkyBoxActorInfo.prototype.type;
     };
     SkyBoxActorInfo.prototype.type = "skybox";

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.SkyBoxActor = SkyBoxActor;

     // The instance of this class is sent throght network. 
     function SkyBoxActor(actorInfo, actorManager) {
	 exports.Actor.call(this, actorInfo, actorManager);

	 var cShape = new Ammo.btSphereShape(1);
	 var inertia = new Ammo.btVector3();
	 cShape.calculateLocalInertia(0, inertia);

	 this.physicsState = new exports.PhysicsState(actorManager.physics);
	 this.physicsState.rigidBody = new Ammo.btRigidBody(0, this, cShape, inertia);
     };

     SkyBoxActor.prototype = Object.create(exports.Actor.prototype);
     SkyBoxActor.prototype.constructor = exports.Actor;

     exports.ActorManager.setCreator(
	 exports.SkyBoxActorInfo.prototype.type, 
	 function(actorInfo, actorManager){
	     return new exports.SkyBoxActor(actorInfo, actorManager);
	 }
     );

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.JsonMeshActorInfo = JsonMeshActorInfo;

     // The instance of this class is sent throght network. 
     function JsonMeshActorInfo(model) {
	 this.model = model;
	 this.width = 1;
	 this.height = 1;
	 this.depth = 1;
	 
	 // for physics
	 this.usePhysics = true;
	 this.mass = 0;
	 this.angularFactor = new exports.Vector3D(1.0, 1.0, 1.0);
	 this.restitution = 0.2;
	 this.friction = 1.0;
	 this.linearDamping = 0.0;
	 this.angularDamping = 0.0;
	 this.collisionFilter = null;
	 
	 // for visual
	 this.textureName = null;
	 
	 this.type = exports.JsonMeshActorInfo.prototype.type;
     };
     JsonMeshActorInfo.prototype.type = "json";

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.JsonMeshActor = JsonMeshActor;

     function JsonMeshActor(actorInfo, actorManager) {
	 exports.Actor.call(this, actorInfo, actorManager);
	 
	 var cShape = new Ammo.btBoxShape(new Ammo.btVector3(actorInfo.width / 2,
							     actorInfo.height / 2,
							     actorInfo.depth / 2));
	 var inertia = new Ammo.btVector3();
	 cShape.calculateLocalInertia(actorInfo.mass, inertia);
	 
	 var rb = actorManager.physics.createRigidBody(this, actorInfo, cShape, inertia);
	 actorManager.physics.addRigidBody(rb, actorInfo);
	 
	 this.physicsState = new exports.PhysicsState(actorManager.physics);
	 this.physicsState.rigidBody = rb;
     };

     JsonMeshActor.prototype = Object.create(exports.Actor.prototype);
     JsonMeshActor.prototype.constructor = exports.Actor;

     exports.ActorManager.setCreator(
	 exports.JsonMeshActorInfo.prototype.type, 
	 function(actorInfo, actorManager){
	     return new exports.JsonMeshActor(actorInfo, actorManager);
	 }
     );

 })(typeof teien === 'undefined' ? module.exports : teien);

(function (exports) {
     exports.WorldProxy = WorldProxy;

     function WorldProxy() {
	 var that = this;
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
	     
	     var actors = that.getAllActors();
	     postMessage({type: "update", actors: actors});
	 };

	 this.merge = function(actors) {
	     that.actorManager.merge(actors);
	 };

	 this.run = function() {
	     var socket = io.connect();

	     socket.on('news', 
		       function (data) {
			   console.log(data);
			   socket.emit('test_event', { proxy: 'hello world' });
		       });

	     socket.on('actors', 
		       function (data) {
			   that.merge(data);
		       });
	 
	     onmessage = function(event) {
		 switch(event.data.type){
		 case "setup": 
		     that.setup();
		     break;
		 default:
		 };
	     };
	 };
	 
     };
     
     WorldProxy.prototype.setup = function() {
	 this.lastTime = Date.now();
	 setInterval(this.update, 1000 / 30);
     };
     
     
     WorldProxy.prototype.getAllActors = function() {
	 var actors = {};
	 
	 for(key in this.actorManager.actors) {
	     var actor = {};
	     
	     actor.actorInfo = this.actorManager.actors[key].actorInfo;
	     
	     var transform = this.actorManager.actors[key].getTransform();
	     actor.transform = new exports.Transform(
		 exports.Vector3D.createFromAmmo(transform.getOrigin()),
		 exports.Quaternion.createFromAmmo(transform.getRotation()));
	     
	     actors[key] = actor;
	 }
	 
	 return actors;
     };
     
 })(typeof teien === 'undefined' ? module.exports : teien);



