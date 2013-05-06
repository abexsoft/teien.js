/**
 * These classes are used for follows.
 * 1. ammo.js-to-three.js communication.
 * 2. browser-to-worker and worker-to-node communications.
 */

//
// Vector3D
//
teien.Vector3D = function(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

teien.Vector3D.createFromAmmo = function(vec) {
    return (new teien.Vector3D()).setFromAmmo(vec);
};

teien.Vector3D.prototype.setFromAmmo = function(vec) {
    this.x = vec.x();
    this.y = vec.y();
    this.z = vec.z();  
    return this;
};


//
// Quaternion
//
teien.Quaternion = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;
};

teien.Quaternion.createFromAmmo = function(quat) {
    return (new teien.Quaternion()).setFromAmmo(quat);
};

teien.Quaternion.prototype.setFromAmmo = function(quat) {
    this.x = quat.x();
    this.y = quat.y();
    this.z = quat.z();  
    this.w = quat.w();  
    return this;
};


//
// Transform
//
teien.Transform = function(position, rotation) {
    this.position = position || new teien.Vector3D();
    this.rotation = rotation || new teien.Quaternion();
};


