var net = require('net');
var server = net.createServer();
var config = require('../config');
var Struct = require('../struct');
var Worker = require('./s_worker');
var Transfer = require('./s_transfer');
var User = require('./s_user');
var Game = require('./s_game');
var mDB = require('./s_mysql');


this.INIT = function( callback )
{
	console.log('server working on %s', LOGIN_IP);
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
	server.listen(LOGIN_PO, LOGIN_IP);
	server.on('connection', this.Accept);	
	return callback(true);
}
this.Accept = function( socket )
{
	var tProtocol;
	var wf;
	var tRecvSizeFromUser;
	var tempUserIndex;
	
	for( tempUserIndex = 0; tempUserIndex < MAX_USER_FOR_LOGIN; tempUserIndex++ )
	{
		if( mUSER[tempUserIndex].uCheckConnectState === false )
		{
			break;
		}
	}
	if( tempUserIndex >= MAX_USER_FOR_LOGIN )
	{
		socket.destroy();
		return;
	}
	socket.setTimeout(0);
	socket.setNoDelay(true);
	mUSER[tempUserIndex].uCheckConnectState = true;
	mUSER[tempUserIndex].uCheckValidState = false;
	//
	console.log('new client connection from %s , tUI:%d', socket.remoteAddress, tempUserIndex);
	mUSER[tempUserIndex].uIP = socket.remoteAddress;
	mUSER[tempUserIndex].uSocket = socket;
	mUSER[tempUserIndex].mUsedTime = mGAME.GetTickCount();
		
	mUSER[tempUserIndex].uAvatarInfo[0] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
	mUSER[tempUserIndex].uAvatarInfo[1] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
	mUSER[tempUserIndex].uAvatarInfo[2] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
	mUSER[tempUserIndex].uAvatarInfo[0] = pAvatar( 0, mUSER[tempUserIndex].uAvatarInfo[0] );
	mUSER[tempUserIndex].uAvatarInfo[1] = pAvatar( 0, mUSER[tempUserIndex].uAvatarInfo[1] );
	mUSER[tempUserIndex].uAvatarInfo[2] = pAvatar( 0, mUSER[tempUserIndex].uAvatarInfo[2] );
	
	mTRANSFER.B_CONNECT_OK( 0, mGAME.mMaxPlayerNum, mGAME.mGagePlayerNum, ( mGAME.mPresentPlayerNum + mGAME.mAddPlayerNum ) );
	mUSER[tempUserIndex].Send( tempUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	
	//socket.on('close', Close);
	socket.on('error', function(){});
	socket.on('end', Close);
	function Close()
	{
		mUSER[tempUserIndex].Quit( tempUserIndex );
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
		if( mUSER[tempUserIndex].uTotalRecvSize < 9 )
		{
			return;
		}
		tProtocol = parseInt( mUSER[tempUserIndex].uBUFFER_FOR_RECV[8] );
		if( mWORK[tProtocol].PROC == undefined )
		{
			console.log('Undefined = Packet Header: ', tProtocol, ',Length:', mUSER[tempUserIndex].uBUFFER_FOR_RECV);
			mUSER[tempUserIndex].uSocket.destroy();
			return;
		}
		if( mUSER[tempUserIndex].uTotalRecvSize < mWORK[tProtocol].SIZE )
		{
			//console.log('Error Packet Header: ', tProtocol, ',mWORK Length:', mWORK.W_FUNCTION(tProtocol)[1]);
			//socket.destroy();
			return;
		}
		//wf = mWORK.W_FUNCTION( tProtocol );
		//if ( wf in mWORK && typeof mWORK[wf] === "function" )
		//{
			if( mUSER[tempUserIndex].uTotalRecvSize >= mWORK[tProtocol].SIZE )
			{
				mWORK[tProtocol].PROC( tempUserIndex );
				if( mUSER[tempUserIndex].uCheckConnectState )
				{
					mUSER[tempUserIndex].uBUFFER_FOR_RECV.copy( mUSER[tempUserIndex].uBUFFER_FOR_RECV, 0, mWORK[tProtocol].SIZE, mUSER[tempUserIndex].uTotalRecvSize);
					mUSER[tempUserIndex].uTotalRecvSize -= mWORK[tProtocol].SIZE;
				}
			}
		//}		
	}
}
//timer2
setInterval(function()
{	
	mGAME.mTickCount = mGAME.GetTickCount();
	//console.log("mTickCount", mGAME.mTickCount);
	/*for( var index01 = 0 ; index01 < MAX_USER_FOR_LOGIN ; index01++ )
	{
		if( !mUSER[index01].uCheckConnectState )
		{
			continue;
		}
		if( ( mGAME.mTickCount - uUsedTime[index01] ) >= 60 )
		{
			Quit(index01);
			continue;
		}
		if( !mUSER[index01].uCheckValidState )
		{
			continue;
		}
	}*/
}, 1000);
exports.server = this;