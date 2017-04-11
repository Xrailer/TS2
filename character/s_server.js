global.Net = require('net');
var Server = Net.createServer();
var Config = require('../config');
var Struct = require('../struct');
var Worker = require('./s_worker');
var Transfer = require('./s_transfer');
var User = require('./s_user');
var Game = require('./s_game');
var mDB = require('./s_mysql');
global.sprintf = require('sprintf-js').sprintf;

this.INIT = function( callback )
{
	console.log('server working on ip:%s, port:%s', CHAR_IP, CHAR_PO);
	WorkInit( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mWORK Init()");
			process.exit(1);
			return;
		}
		console.log("mWORK Init()");
	});
	TransferInit( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mTRANSFER Init()");
			process.exit(1);
			return;
		}
		console.log("mTRANSFER Init()");
	});
	UserInit( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mUSER Init()");
			process.exit(1);
			return;
		}
		console.log("mUSER Init()");
	});
	MysqlInit( MY_HOST, MY_PORT, MY_USER, MY_PASS, MY_DB, function( callback )
	{
		if(callback == false)
		{
			console.log("Error::mDB Init()");
			process.exit(1);
			return;
		}
		console.log("mDB Init()");
	});
	GameInit( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mGAME Init()");
			process.exit(1);
			return;
		}
		console.log("mGAME Init()");
	});
	Server.listen(CHAR_PO, CHAR_IP);
	Server.on('connection', this.Accept);
	return callback(true);
}
this.Accept = function( socket )
{
	var tProtocol;
	var tRecvSizeFromUser;
	var tempUserIndex;
	
	for( tempUserIndex = 0; tempUserIndex < MAX_USER_FOR_LOGIN; tempUserIndex++ )
	{
		if( mUSER[tempUserIndex].uCheckConnectState == false )
		{
			break;
		}
	}
	if( tempUserIndex >= MAX_USER_FOR_CHARACTER )
	{
		socket.destroy();
		return;
	}
	socket.setTimeout(0);
	socket.setNoDelay(true);
	mUSER[tempUserIndex].uCheckConnectState = true;
	//
	console.log('new client connection from %s , tUI:%d', socket.remoteAddress, tempUserIndex);
	mUSER[tempUserIndex].uCheckServerType = 0;
	mUSER[tempUserIndex].uIP = socket.remoteAddress;
	mUSER[tempUserIndex].uSocket = socket;
	mUSER[tempUserIndex].uUsedTime = mGAME.GetTickCount();
	
	mTRANSFER.B_CONNECT_OK( 0 );
	mUSER[tempUserIndex].Send( tempUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	
	//socket.on('close', function(){});
	socket.on('error', Close);
	socket.on('end', Close);
	function Close()
	{
		mUSER[tempUserIndex].Quit( tempUserIndex, 0 );
	}
	
	socket.on('data', Write);
	function Write( data )
	{
		//console.log('recv packet size', data.length);
		//console.log('recv packet data', data);
		tRecvSizeFromUser = data.length;
		if( tRecvSizeFromUser <= 0 )
		{
			//console.log('error packet size ', tRecvSizeFromUser);
			socket.destroy();
			return;
		}
		data.copy( mUSER[tempUserIndex].uBUFFER_FOR_RECV, mUSER[tempUserIndex].uTotalRecvSize, 0, tRecvSizeFromUser);
		mUSER[tempUserIndex].uTotalRecvSize += tRecvSizeFromUser;	
		if( mUSER[tempUserIndex].uTotalRecvSize < 1 )
		{
			return;
		}
		tProtocol = parseInt( mUSER[tempUserIndex].uBUFFER_FOR_RECV[0] );
		if( mWORK[tProtocol].PROC == undefined )
		{
			console.log( 'Undefined = Packet Header: ', tProtocol, ',Length:', tRecvSizeFromUser );
			mUSER[tempUserIndex].Quit( tempUserIndex );
			return;
		}
		if( mUSER[tempUserIndex].uTotalRecvSize < mWORK[tProtocol].SIZE )
		{
			//console.log('Error Packet Header: ', tProtocol, ',mWORK Length:', mWORK.W_FUNCTION(tProtocol)[1]);
			//socket.destroy();
			return;
		}
		if( mUSER[tempUserIndex].uTotalRecvSize >= mWORK[tProtocol].SIZE )
		{
			mWORK[tProtocol].PROC( tempUserIndex );
			if( mUSER[tempUserIndex].uCheckConnectState )
			{
				mUSER[tempUserIndex].uBUFFER_FOR_RECV.copy( mUSER[tempUserIndex].uBUFFER_FOR_RECV, 0, mWORK[tProtocol].SIZE, mUSER[tempUserIndex].uTotalRecvSize);
				mUSER[tempUserIndex].uTotalRecvSize -= mWORK[tProtocol].SIZE;
			}
		}	
	}
}
//timer2
setInterval(function()
{
	var tPresentTime = mGAME.GetTickCount();
	for( var index01 = 0 ; index01 < MAX_USER_FOR_CHARACTER ; index01++ )
	{
		if( !mUSER[index01].uCheckConnectState )
		{
			continue;
		}
		if( ( tPresentTime - mUSER[index01].uUsedTime ) > 180 ) //if zone not connect with char server every 3mins will get dc
		{			
			mUSER[index01].Quit( index01, 1003 );
		}
	}	
	mGAME.mTickCount++;
	if( ( mGAME.mTickCount % 6 ) == 0 )
	{
		mGAME.ProcessForCharSrv();
	}
}, 1000);
exports.server = this;
