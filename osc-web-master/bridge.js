var osc = require('node-osc'),
    io = require('socket.io').listen(8081);

var oscServer, oscClient;

io.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    oscServer = new osc.Server(obj.server.port, obj.server.host);
    oscClient = new osc.Client(obj.client.host, obj.client.port);
	
    oscClient.send('/status', socket.sessionId + ' connected');
    oscServer.on('message', function(msg, rinfo) {
      //console.log(msg, rinfo);
      socket.emit("message", msg);
    });
  });
  socket.on("message", function (obj) {
	var address = socket.handshake.address;
	var ipArr = address.address.toString()
	var messArr = obj.toString()
	ipArr = ipArr.split(".");
    
    var arr = messArr.split(" ");
	//console.log("/" + ipArr[3] + arr[0],parseInt(arr[1]));
	oscClient.send("/" + ipArr[3] + arr[0],parseInt(arr[1]));
	//oscClient.send("/20/orange/x 23");
	//oscClient.send("/20/orange/y 5");
	//oscClient.send("/20/orange/z 1");
	
  });
});