
if (typeof exports === 'undefined'){
    var teien = {};
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
     
     PhysicsState.prototype.updateTransform = function() {
	 this.transform = this.rigidBody.getCenterOfMassTransform();
     };
     
     PhysicsState.prototype.getTransform = function() {
	 return this.transform;
     };
     
     PhysicsState.prototype.getPosition = function() {
	 //    this.newPos = this.physicsObject.rigidBody.getCenterOfMassTransform().getOrigin();
	 return this.transform.getOrigin();
     };

     PhysicsState.prototype.getRotation = function() {
	 return this.transform.getRotation();
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
	     //console.log("There is a object with the same name: " + name);
	     postMessage({type: "log", log: "There is a object with the same name: " + name});
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
	 for (key in this.actors) {
	     this.actors[key].updateTransform();
	 };
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





(function (exports) {
     exports.WorldServer = WorldServer;

     function WorldServer(apl, indexHtml, publicRoot) {
	 var that = this;
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
	     var contentType = 'text/html';
	     
	     switch (extname) {
	     case '.js':
		 contentType = 'text/javascript';
		 break;
	     case '.css':
		 contentType = 'text/css';
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
			   socket.emit('news', { server: 'hello world' });
			   socket.on('my other event', function (data) {
					 console.log(data);
				     });
		       });
	 
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

(function (exports) {
     exports.BoxActor = BoxActor;

     function BoxActor(actorInfo, actorManager) {
	 teien.Actor.call(this, actorInfo, actorManager);
	 
	 var cShape = new Ammo.btBoxShape(new Ammo.btVector3(actorInfo.width / 2,
							     actorInfo.height / 2,
							     actorInfo.depth / 2));
	 var inertia = new Ammo.btVector3();
	 cShape.calculateLocalInertia(actorInfo.mass, inertia);
	 
	 var rb = actorManager.physics.createRigidBody(this, actorInfo, cShape, inertia);
	 actorManager.physics.addRigidBody(rb, actorInfo);
	 
	 this.physicsState = new teien.PhysicsState(actorManager.physics);
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

