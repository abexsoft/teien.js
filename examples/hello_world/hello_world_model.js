teienRootPath = "../../";  // teien_model.js need this value to import all libs.
importScripts(teienRootPath + "lib/teien_model.js");

var HelloWorldModel = function(worldModel) {
    var that = this;
    this.worldModel = worldModel;
	 
    this.setup = function(){
	var objectInfo = new teien.BoxObjectInfo(1, 1, 1);
	objectInfo.textureName = "crate.gif";
	this.box = this.worldModel.baseObjectManager.createObject("boxText", objectInfo, new teien.PhysicsInfo(10));
	this.box.setPosition(new teien.Vector3D(0, 10, 0));

	var objectInfo = new teien.BoxObjectInfo(1, 1, 1);
	objectInfo.textureName = "crate.gif";
	this.box = this.worldModel.baseObjectManager.createObject("boxText2", objectInfo, new teien.PhysicsInfo(10));
	this.box.setPosition(new teien.Vector3D(2, 10, 0));

	var objectInfo = new teien.BoxObjectInfo(1, 1, 1);
	objectInfo.textureName = "crate.gif";
	this.box = this.worldModel.baseObjectManager.createObject("boxText3", objectInfo, new teien.PhysicsInfo(10));
	this.box.setPosition(new teien.Vector3D(4, 10, 0));

	var objectInfo = new teien.BoxObjectInfo(1, 1, 1);
	objectInfo.textureName = "crate.gif";
	this.box = this.worldModel.baseObjectManager.createObject("boxText4", objectInfo, new teien.PhysicsInfo(10));
	this.box.setPosition(new teien.Vector3D(-2, 10, 0));


	var objectInfo = new teien.BoxObjectInfo(50, 0.1, 50);
	objectInfo.textureName = "crate.gif";
	this.box = this.worldModel.baseObjectManager.createObject("floor", objectInfo, new teien.PhysicsInfo(0));
	this.box.setPosition(new teien.Vector3D(0, -10, 0));
	
    };

    this.update = function(delta){
//	this.boxView.setTransform(this.box.getTransform());
//	console.log("box pos: (" + newPos.getX() + ", " + newPos.getY() + ", " + newPos.getZ() + ")");
    };
};

var worldModel = new teien.WorldModel(HelloWorldModel);

