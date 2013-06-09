Ammo = require("../../deps/ammo.js/builds/ammo.asm.js").Ammo;
teien = require("../../dist/teien.js");

var App = function(){
    this.getPath = function(){
	return __dirname;
    };
};

var indexHtml = __dirname + "/hello_world_browser.html";
var publicRoot = __dirname + "/../..";

var server = new teien.WorldServer(new App(), indexHtml, publicRoot);





