teien.ViewObject = function(userInterface) {
    this.userInterface = userInterface;
    this.objectInfo = null;
    this.mesh = null;
};

teien.ViewObject.prototype.setTransform = function(transform) {
    //console.log(transform);

    this.object.position.x = transform.position.x;
    this.object.position.y = transform.position.y;
    this.object.position.z = transform.position.z;

    this.object.quaternion.x = transform.rotation.x;
    this.object.quaternion.y = transform.rotation.y;
    this.object.quaternion.z = transform.rotation.z;
    this.object.quaternion.w = transform.rotation.w;
};