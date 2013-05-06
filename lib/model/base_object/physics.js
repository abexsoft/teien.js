teien.Physics = function(objectManager) {
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

teien.Physics.creators = {};

teien.Physics.setCreator = function(type, creator) {
    this.creators[type] = creator;
};

teien.Physics.createObject = function(obj) {
    if (this.creators[obj.objectInfo.type] !== undefined) {
	return this.creators[obj.objectInfo.type](obj, this);	
    }
    else {
	console.log("no such class: #{obj.object_info.class}");
	return null;
	
    }
};

teien.Physics.prototype.addPhysicsObject = function(obj) {
    obj.physicsObject = teien.Physics.createObject(obj);

    if (obj.objectInfo.usePhysics &&
        obj.physicsObject.rigidBody !== null) {
	if (obj.physicsInfo.collisionFilter) {
            this.addRigidBody(obj.physicsObject.rigidBody, obj.physicsInfo.collisionFilter);
	}
	else {
	    this.addRigidBody(obj.physicsObject.rigidBody);
	}
    }
};        

teien.Physics.prototype.addRigidBody = function(rigidBody, collisionFilter) {
    this.rigidBodies.push(rigidBody);
    if (collisionFilter)
	this.dynamicsWorld.addRigidBody(rigidBody, collisionFilter.group, collisionFilter.mask);
    else
	this.dynamicsWorld.addRigidBody(rigidBody);
};    

teien.Physics.prototype.delRigidBody = function(rigidBody) {
    this.rigidBodies.delete(rigidBody);
    this.dynamicsWorld.removeRigidBody(rigidBody);
};

teien.Physics.prototype.update = function(delta) {
//    console.log(delta);
    this.dynamicsWorld.stepSimulation(delta / 1000, this.maxSubSteps, this.fixedTimeStep);
};