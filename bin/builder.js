var fs = require('fs');

var libPath  = __dirname + "/../lib/";

var teienDistFile = __dirname + '/../dist/teien.js';
var teienSources = [
    "teien_header.js",
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

var teienBrowserDistFile = __dirname + '/../dist/teien_browser.js';
var teienBrowserSources = [
    "teien_header.js",
    "teien_browser.js",
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


var builder = function(distFile, sourceList){
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
	fs.openSync(distFile, 'w');
	fs.writeFileSync(distFile, code, 'utf8');
	console.log("created: " + distFile);
    } catch (e) {
	console.log(e.message);
    }
}

builder(teienDistFile, teienSources);
builder(teienBrowserDistFile, teienBrowserSources);


