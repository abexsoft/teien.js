teienRootPath = "../../";  // teien.js needs this value to import all libs.
importScripts(teienRootPath + "lib/teien.js");

var HelloWorld = function(world) {
    var that = this;
    this.world = world;
	 
    this.setup = function(){
	var obj;
	var actorInfo;

	this.world.enableShadow(true);

	var materials = [
            '../../deps/three.js/examples/textures/cube/skybox/px.jpg' ,
            '../../deps/three.js/examples/textures/cube/skybox/nx.jpg' ,
            '../../deps/three.js/examples/textures/cube/skybox/py.jpg' ,
            '../../deps/three.js/examples/textures/cube/skybox/ny.jpg' ,
            '../../deps/three.js/examples/textures/cube/skybox/pz.jpg' ,
            '../../deps/three.js/examples/textures/cube/skybox/nz.jpg'  
        ];
	actorInfo = new teien.SkyBoxActorInfo(materials);
	obj = this.world.actorManager.createActor("skybox", actorInfo);

	actorInfo = new teien.SpotLightActorInfo(0xffffff);
	obj = this.world.actorManager.createActor("spotLight", actorInfo);
	obj.setPosition(new teien.Vector3D(-60,150,-30));

	actorInfo = new teien.BoxActorInfo(1, 1, 1);
	actorInfo.textureName = "../../deps/three.js/examples/textures/crate.gif";
	actorInfo.mass = 10;
	obj = this.world.actorManager.createActor("boxText", actorInfo);
	obj.setPosition(new teien.Vector3D(0, 10, 0));


	obj = this.world.actorManager.createActor("boxText2", actorInfo);
	obj.setPosition(new teien.Vector3D(2, 10, 0));

	obj = this.world.actorManager.createActor("boxText3", actorInfo);
	obj.setPosition(new teien.Vector3D(4, 10, 0));

	obj = this.world.actorManager.createActor("boxText4", actorInfo);
	obj.setPosition(new teien.Vector3D(-2, 10, 0));


	actorInfo = new teien.SphereActorInfo(0.5);
	actorInfo.mass = 5;
	actorInfo.textureName = "../../deps/three.js/examples/textures/crate.gif";
	obj = this.world.actorManager.createActor("sphere0", actorInfo);
	obj.setPosition(new teien.Vector3D(0, 15, 0));

	obj = this.world.actorManager.createActor("sphere1", actorInfo);
	obj.setPosition(new teien.Vector3D(0.5, 17, 0));

	obj = this.world.actorManager.createActor("sphere2", actorInfo);
	obj.setPosition(new teien.Vector3D(0, 19, -0.5));


	actorInfo = new teien.BoxActorInfo(50, 1, 50);
	actorInfo.textureName = "../../deps/three.js/examples/textures/terrain/grasslight-big.jpg";
	obj = this.world.actorManager.createActor("floor", actorInfo);
	obj.setPosition(new teien.Vector3D(0, -0.5, 0));
    };

    this.update = function(delta){
    };
};

var world = new teien.World(HelloWorld);

