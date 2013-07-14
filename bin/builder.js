var fs = require('fs');

var libPath  = __dirname + "/../lib/";

var teienBuildFile = __dirname + '/../build/teien.js';
var teienSources = [
    "header.js",
    "util/util.js",
    "world/physics/physics.js",
    "world/physics/physics_state.js",
    "world/actor/actor.js",
    "world/actor/actor_manager.js",
    "world/world.js",
    "world/world_server.js",
    "actors/box/box_actor_info.js",
    "actors/box/box_actor.js",
    "actors/sphere/sphere_actor_info.js",
    "actors/sphere/sphere_actor.js",
    "actors/spot_light/spot_light_actor_info.js",
    "actors/spot_light/spot_light_actor.js",
    "actors/sky_box/sky_box_actor_info.js",
    "actors/sky_box/sky_box_actor.js",
    "actors/json_mesh/json_mesh_actor_info.js",
    "actors/json_mesh/json_mesh_actor.js"
];

var teienProxyBuildFile = __dirname + '/../build/teien_proxy.js';
var teienProxySources = teienSources.concat(
    ["world/world_proxy.js"]
);

var teienBrowserBuildFile = __dirname + '/../build/teien_browser.js';
var teienBrowserSources = [
    "header.js",
    "browser.js",
    "util/util.js",
    "user_interface/user_interface.js",
    "user_interface/actor_view.js",
    "actors/box/box_actor_info.js",
    "actors/box/box_actor_view.js",
    "actors/sphere/sphere_actor_info.js",
    "actors/sphere/sphere_actor_view.js",
    "actors/spot_light/spot_light_actor_info.js",
    "actors/spot_light/spot_light_actor_view.js",
    "actors/sky_box/sky_box_actor_info.js",
    "actors/sky_box/sky_box_actor_view.js",
    "actors/json_mesh/json_mesh_actor_info.js",
    "actors/json_mesh/json_mesh_actor_view.js"
];


var builder = function(buildFile, sourceList){
    var code = "";
    sourceList.forEach(
	function(file){
	    var fileName = libPath + file;
	    try {
		code += fs.readFileSync(fileName, "utf8");
		code += "\n\n";
	    } catch (e) {
		console.log(e.message);
	    }
	}
    );

    try {
	fs.openSync(buildFile, 'w');
	fs.writeFileSync(buildFile, code, 'utf8');
	console.log("created: " + buildFile);
    } catch (e) {
	console.log(e.message);
    }
}

builder(teienBuildFile, teienSources);
builder(teienProxyBuildFile, teienProxySources);
builder(teienBrowserBuildFile, teienBrowserSources);


