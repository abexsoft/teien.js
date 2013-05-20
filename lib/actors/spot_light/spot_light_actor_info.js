// The instance of this class is sent throght network. 
teien.SpotLightActorInfo = function(color) {
    this.color = color;

    this.usePhysics = false;

    this.type = teien.SpotLightActorInfo.prototype.type;
};
teien.SpotLightActorInfo.prototype.type = "spotlight";

