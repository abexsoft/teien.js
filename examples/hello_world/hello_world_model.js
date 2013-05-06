teienRootPath = "../../";  // teien_model.js need this value to import all libs.
importScripts(teienRootPath + "lib/teien_model.js");

var HelloWorldModel = function(worldModel) {
    var that = this;
    this.worldModel = worldModel;
	 
    this.setup = function(){
	var obj;

	var objectInfo = new teien.BoxObjectInfo(1, 1, 1);
	objectInfo.textureName = "crate.gif";
	obj = this.worldModel.baseObjectManager.createObject("boxText", objectInfo, new teien.PhysicsInfo(10));
	obj.setPosition(new teien.Vector3D(0, 10, 0));

	obj = this.worldModel.baseObjectManager.createObject("boxText2", objectInfo, new teien.PhysicsInfo(10));
	obj.setPosition(new teien.Vector3D(2, 10, 0));

	obj = this.worldModel.baseObjectManager.createObject("boxText3", objectInfo, new teien.PhysicsInfo(10));
	obj.setPosition(new teien.Vector3D(4, 10, 0));

	obj = this.worldModel.baseObjectManager.createObject("boxText4", objectInfo, new teien.PhysicsInfo(10));
	obj.setPosition(new teien.Vector3D(-2, 10, 0));


	var objectInfo = new teien.SphereObjectInfo(0.5);
	objectInfo.textureName = "crate.gif";
	obj = this.worldModel.baseObjectManager.createObject("sphere0", objectInfo, new teien.PhysicsInfo(5));
	obj.setPosition(new teien.Vector3D(0, 15, 0));

	obj = this.worldModel.baseObjectManager.createObject("sphere1", objectInfo, new teien.PhysicsInfo(5));
	obj.setPosition(new teien.Vector3D(0.5, 17, 0));

	obj = this.worldModel.baseObjectManager.createObject("sphere2", objectInfo, new teien.PhysicsInfo(5));
	obj.setPosition(new teien.Vector3D(0, 19, -0.5));


	var objectInfo = new teien.BoxObjectInfo(50, 0.1, 50);
	objectInfo.textureName = "crate.gif";
	obj = this.worldModel.baseObjectManager.createObject("floor", objectInfo, new teien.PhysicsInfo(0));
	obj.setPosition(new teien.Vector3D(0, -10, 0));
    };

    this.update = function(delta){
    };
};

var worldModel = new teien.WorldModel(HelloWorldModel);

