var net = require('net');
var config = require('./config.js');
var Worker = require('./server/s_worker.js');
var Transfer = require('./server/s_transfer.js');
var User = require('./server/s_user.js');
var Mysql = require('./server/s_mysql.js');

var server = net.createServer();
server.listen(11091, config.LOGIN_IP);
console.log('server listening to %j', config.LOGIN_IP);
var worker = new Worker();
if(worker.INIT() == false)
{
	console.log("Error::Worker Init()");
	return;
}
console.log("Worker Init()");

var transfer = new Transfer();
if(transfer.INIT() == false)
{
	console.log("Error::Transfer Init()");
	return;
}
console.log("Transfer Init()");

var user = new User();
if(user.INIT() == false)
{
	console.log("Error::User Init()");
	return;
}
console.log("User Init()");

var mysql = new Mysql();
if(mysql.INIT() == false)
{
	console.log("Error::Mysql Init()");
	return;
}
console.log("Mysql Init()");

server.on('connection', handleConnection);


function handleConnection(socket)
{
	//var remoteAddress = socket.remoteAddress + ':' + socket.remotePort;
	var tID = user.GetConnectPlayer();
	if( tID >= user.maxUser )
	{
		console.log('max user : close socket id', socket.id);
		socket.onclose();
		return;
	}
	user.userIP[tID] = socket.remoteAddress;
	console.log('new client connection from %s , tID:%d', user.userIP[tID], tID);
	transfer.B_CONNECT_OK(0, 1000, 10, 1);
	socket.write(transfer.packet);
	
	socket.on('data', handleDataRecv);
	function handleDataRecv(data) 
	{
		if(data.length < 9)
		{
			console.log('error packet size ', data.length);
			socket.destroy();
		}
		var tProtocol = parseInt(data[8]);
		//console.log(tProtocol);
    	if( worker.W_FUNCTION(tProtocol) === undefined )
    	{
			console.log('Undefined = Packet Header: ', tProtocol, ',Length:', data.length);
			socket.destroy();
			return;
		}
		if(data.length < worker.W_SIZE(tProtocol))
		{
			//console.log('Error Packet Header: ', tProtocol, ',Worker Length:', worker.W_FUNCTION(tProtocol)[1]);
			//socket.destroy();
			return;
		}
		var rDATA = [];
		var rI;
		for(var i = 9; i < data.length; i++)
		{
			rDATA[i-9] = data[i];
		}
		//console.log(rDATA.length);
		//console.log(rDATA);
		var sf = worker.W_FUNCTION(tProtocol);
		if (sf in worker && typeof worker[sf] === "function")
		{
			worker[sf](socket, tID, rDATA);
		}
		//console.log('recv packet size', data.length);
		//console.log('recv packet data', data);
	}
	socket.once('close', mainQuit);
	socket.on('error', mainQuit);
	function mainQuit()
	{
		user.Quit(socket, tID);
	}
}