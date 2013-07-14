importScripts("/deps/ammo.js/builds/ammo.asm.js");
importScripts("/socket.io/socket.io.js");
importScripts("/build/teien_proxy.js");

var world = new teien.WorldProxy();
world.run();
