(function (exports) {
     exports.WorldServer = WorldServer;

     function WorldServer(apl, indexHtml, publicRoot) {
	 var that = this;
	 var fs = require('fs');
	 var path = require('path');

	 var handler = function(req, res) {
	     var filePath;
	     if (req.url == '/') {
		 filePath = indexHtml;
	     } else {
		 filePath = publicRoot + req.url;
	     }
	     
	     var extname = path.extname(filePath);
	     var contentType = 'text/html';
	     
	     switch (extname) {
	     case '.js':
		 contentType = 'text/javascript';
		 break;
	     case '.css':
		 contentType = 'text/css';
		 break;
	     }
	     
	     path.exists(filePath, 
			 function(exists) {
			     console.log("load: " + filePath);

			     if (exists) {
				 fs.readFile(filePath, 
					     function(error, content) {
						 if (error) {
						     res.writeHead(500);
						     res.end();
						 }
						 else {
						     res.writeHead(200, 
								   { 'Content-Type': contentType });
						     res.end(content, 'utf-8');
						 }
					     });
			     }
			     else {
				 res.writeHead(404);
				 res.end();
			     }
			 });
	 };

	 var app = require('http').createServer(handler);
	 var io = require('socket.io').listen(app, {'log level': 1});
					      
	 app.listen(8080);
	 
	 io.sockets.on('connection', 
		       function (socket) {
			   socket.emit('news', { server: 'hello world' });
			   socket.on('my other event', function (data) {
					 console.log(data);
				     });
		       });
	 
     };

 })(typeof teien === 'undefined' ? module.exports : teien);

