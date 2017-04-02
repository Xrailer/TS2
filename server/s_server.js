var net = require('net');
var server = net.createServer();
var config = require('../config.js');
var worker = require('./s_worker');
var transfer = require('./s_transfer');
var user = require('./s_user');
var mysql = require('./s_mysql');
var game = require('./s_game');

this.INIT = function( callback )
{
	console.log('server working on %s', config.LOGIN_IP);
	worker.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::Worker Init()");
			process.exit(1);
			return;
		}
		console.log("Worker Init()");
	});
	transfer.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::Transfer Init()");
			process.exit(1);
			return;
		}
		console.log("Transfer Init()");
	});
	user.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::User Init()");
			process.exit(1);
			return;
		}
		console.log("User Init()");
	});
	mysql.INIT( config.MY_HOST, config.MY_PORT, config.MY_USER, config.MY_PASS, config.MY_DB, function( callback )
	{
		if(callback == false)
		{
			console.log("Error::Mysql Init()");
			process.exit(1);
			return;
		}
		console.log("Mysql Init()");
	});
	game.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::Game Init()");
			process.exit(1);
			return;
		}
		console.log("Game Init()");
	});
	server.listen(config.LOGIN_PO, config.LOGIN_IP);
	server.on('connection', this.Accept);
	return callback(true);
}
this.Accept = function( socket )
{
	var tID = user.GetConnectPlayer();
	if( tID >= user.maxUser )
	{
		console.log('max user', tID);
		socket.destroy();
		return;
	}
	//
	user.mUSER[tID].uIP = socket.remoteAddress;
	console.log('new client connection from %s , tID:%d', user.mUSER[tID].uIP, tID);
	Buffer(user.mUSER[tID].uAvatar[0]).fill(0);
	Buffer(user.mUSER[tID].uAvatar[1]).fill(0);
	Buffer(user.mUSER[tID].uAvatar[2]).fill(0);	
	transfer.B_CONNECT_OK( 0, game.mMaxPlayerNum, game.mGagePlayerNum, (game.mPresentPlayerNum + game.mAddPlayerNum) );
	user.Send( socket, tID, true, transfer.packet, transfer.packets );
	socket.on('data', Write);	
	socket.on('close', Close);
	socket.on('error', Close);
	function Close()
	{
		user.Quit( tID );
	}
	
	function Write(data)
	{
		if(data.length < 9)
		{
			//console.log('error packet size ', data.length);
			//socket.destroy();
			return;
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
		var datas = [];
		for(var i = 9; i < data.length; i++)
		{
			datas[i-9] = data[i];
		}
		//console.log(datas.length);
		//console.log(datas);
		var sf = worker.W_FUNCTION(tProtocol);
		if (sf in worker && typeof worker[sf] === "function")
		{
			if( user.mUSER[tID].uCheckConnectState )
			{
				worker[sf]( socket, tID, datas );
			}
		}
		//console.log('recv packet size', data.length);
		//console.log('recv packet data', data);
	}
}
//timer
setInterval(function(){
	game.mTickCount = game.GetTickCount();
	//console.log("mTickCount", game.mTickCount);
	/*for( var index01 = 0 ; index01 < user.maxUser ; index01++ )
	{
		if( !user.mCheckConnectState[index01] )
		{
			continue;
		}
		if( ( game.mTickCount - user.uUsedTime[index01] ) >= 60 )
		{
			user.Quit(index01);
			continue;
		}
		if( !user.mCheckValidState[index01] )
		{
			continue;
		}
	}*/
}, 1000);
exports.server = this;