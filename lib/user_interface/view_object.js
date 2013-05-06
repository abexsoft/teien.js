teien.ViewObject = function(userInterface) {
    this.userInterface = userInterface;
    this.objectInfo = null;
    this.mesh = null;
};

teien.ViewObject.prototype.setTransform = function(transform) {
    //console.log(transform);

    this.mesh.position.x = transform.position.x;
    this.mesh.position.y = transform.position.y;
    this.mesh.position.z = transform.position.z;

    this.mesh.quaternion.x = transform.rotation.x;
    this.mesh.quaternion.y = transform.rotation.y;
    this.mesh.quaternion.z = transform.rotation.z;
    this.mesh.quaternion.w = transform.rotation.w;
};