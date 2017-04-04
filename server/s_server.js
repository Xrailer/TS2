var net = require('net');
var server = net.createServer();
var config = require('../config.js');
var struct = require('../struct');
var mWORK = require('./s_worker');
var mTRANSFER = require('./s_transfer');
var user = require('./s_user');
var mDB = require('./s_mysql');
var mGAME = require('./s_game');


this.INIT = function( callback )
{
	console.log('server working on %s', config.LOGIN_IP);
	mWORK.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mWORK Init()");
			process.exit(1);
			return;
		}
		console.log("mWORK Init()");
	});
	mTRANSFER.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mTRANSFER Init()");
			process.exit(1);
			return;
		}
		console.log("mTRANSFER Init()");
	});
	user.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mUSER Init()");
			process.exit(1);
			return;
		}
		console.log("mUSER Init()");
	});
	mDB.INIT( config.MY_HOST, config.MY_PORT, config.MY_USER, config.MY_PASS, config.MY_DB, function( callback )
	{
		if(callback == false)
		{
			console.log("Error::mDB Init()");
			process.exit(1);
			return;
		}
		console.log("mDB Init()");
	});
	mGAME.INIT( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mGAME Init()");
			process.exit(1);
			return;
		}
		console.log("mGAME Init()");
	});
	server.listen(config.LOGIN_PO, config.LOGIN_IP);
	server.on('connection', this.Accept);
	return callback(true);
}
this.Accept = function( socket )
{
	var tProtocol;
	var wf;
	var tRecvSizeFromUser;
	var tempUserIndex;
	
	for( tempUserIndex = 0; tempUserIndex < config.MAX_USER_FOR_LOGIN; tempUserIndex++ )
	{
		if( user.mUSER[tempUserIndex].uCheckConnectState === false )
		{
			break;
		}
	}
	if( tempUserIndex >= config.MAX_USER_FOR_LOGIN )
	{
		socket.destroy();
		return;
	}
	socket.setTimeout(0);
	socket.setNoDelay(true);
	user.mUSER[tempUserIndex].uCheckConnectState = true;
	user.mUSER[tempUserIndex].uCheckValidState = false;
	//
	console.log('new client connection from %s , tUI:%d', socket.remoteAddress, tempUserIndex);
	user.mUSER[tempUserIndex].uIP = socket.remoteAddress;
	user.mUSER[tempUserIndex].uSocket = socket;
	user.mUSER[tempUserIndex].mUsedTime = mGAME.GetTickCount();
	
	
	user.mUSER[tempUserIndex].uAvatarInfo[0] = Buffer.alloc( config.SIZE_OF_AVATAR_INFO ).fill( 0 );
	user.mUSER[tempUserIndex].uAvatarInfo[1] = Buffer.alloc( config.SIZE_OF_AVATAR_INFO ).fill( 0 );
	user.mUSER[tempUserIndex].uAvatarInfo[2] = Buffer.alloc( config.SIZE_OF_AVATAR_INFO ).fill( 0 );
	user.mUSER[tempUserIndex].uAvatarInfo[0] = struct.unpack( user.mUSER[tempUserIndex].uAvatarInfo[0] );
	user.mUSER[tempUserIndex].uAvatarInfo[1] = struct.unpack( user.mUSER[tempUserIndex].uAvatarInfo[1] );
	user.mUSER[tempUserIndex].uAvatarInfo[2] = struct.unpack( user.mUSER[tempUserIndex].uAvatarInfo[2] );
	
	mTRANSFER.B_CONNECT_OK( 0, mGAME.mMaxPlayerNum, mGAME.mGagePlayerNum, ( mGAME.mPresentPlayerNum + mGAME.mAddPlayerNum ) );
	user.Send( tempUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	
	//socket.on('close', Close);
	socket.on('error', function(){});
	socket.on('end', Close);
	function Close()
	{
		user.Quit( tempUserIndex );
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
		data.copy( user.mUSER[tempUserIndex].uBUFFER_FOR_RECV, user.mUSER[tempUserIndex].uTotalRecvSize, 0, tRecvSizeFromUser);
		user.mUSER[tempUserIndex].uTotalRecvSize += tRecvSizeFromUser;	
		if( user.mUSER[tempUserIndex].uTotalRecvSize < 9 )
		{
			return;
		}
		tProtocol = parseInt( user.mUSER[tempUserIndex].uBUFFER_FOR_RECV[8] );
		if( mWORK.W_FUNCTION( tProtocol ) === undefined )
		{
			console.log('Undefined = Packet Header: ', tProtocol, ',Length:', user.mUSER[tempUserIndex].uBUFFER_FOR_RECV);
			user.mUSER[tempUserIndex].uSocket.destroy();
			return;
		}
		if( user.mUSER[tempUserIndex].uTotalRecvSize < mWORK.W_SIZE( tProtocol ) )
		{
			//console.log('Error Packet Header: ', tProtocol, ',mWORK Length:', mWORK.W_FUNCTION(tProtocol)[1]);
			//socket.destroy();
			return;
		}
		wf = mWORK.W_FUNCTION( tProtocol );
		if ( wf in mWORK && typeof mWORK[wf] === "function" )
		{
			if( user.mUSER[tempUserIndex].uTotalRecvSize >= mWORK.W_SIZE( tProtocol ) )
			{
				mWORK[wf]( tempUserIndex );
				if( user.mUSER[tempUserIndex].uCheckConnectState )
				{
					user.mUSER[tempUserIndex].uBUFFER_FOR_RECV.copy( user.mUSER[tempUserIndex].uBUFFER_FOR_RECV, 0, mWORK.W_SIZE( tProtocol ), user.mUSER[tempUserIndex].uTotalRecvSize);
					user.mUSER[tempUserIndex].uTotalRecvSize -= mWORK.W_SIZE( tProtocol );
				}
			}
		}		
	}
}
//timer2
setInterval(function()
{	
	mGAME.mTickCount = mGAME.GetTickCount();
	//console.log("mTickCount", mGAME.mTickCount);
	/*for( var index01 = 0 ; index01 < config.MAX_USER_FOR_LOGIN ; index01++ )
	{
		if( !user.mUSER[index01].uCheckConnectState )
		{
			continue;
		}
		if( ( mGAME.mTickCount - user.uUsedTime[index01] ) >= 60 )
		{
			user.Quit(index01);
			continue;
		}
		if( !user.mUSER[index01].uCheckValidState )
		{
			continue;
		}
	}*/
}, 1000);
exports.server = this;