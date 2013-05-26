// The instance of this class is sent throght network. 
teien.SkyBoxActorInfo = function(materials) {
    this.materials = materials;

    this.usePhysics = false;

    this.type = teien.SkyBoxActorInfo.prototype.type;
};
teien.SkyBoxActorInfo.prototype.type = "skybox";

