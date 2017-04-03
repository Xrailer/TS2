var config = require('../config');
var mTRANSFER = require('./s_transfer');
var mGAME = require('./s_game');
var mDB = require('./s_mysql');
var user = require('./s_user');
var struct = require('../struct');

this.INIT = function( callback )
{
	this.WORKER_PACKETSIZE = [];
	this.WORKER_FUNCTION = [];
	for( var index01 = 0 ; index01 < config.WORKER_SIZE ; index01++ )
	{
		this.WORKER_FUNCTION[index01] = undefined;
		this.WORKER_PACKETSIZE[index01] = 0;
	}
	this.WORKER_FUNCTION[config.P_LOGIN_SEND] = 'W_LOGIN_SEND';
	this.WORKER_PACKETSIZE[config.P_LOGIN_SEND] = config.S_LOGIN_SEND;
	this.WORKER_FUNCTION[config.P_CLIENT_OK_FOR_LOGIN_SEND] = 'W_CLIENT_OK_FOR_LOGIN_SEND';
	this.WORKER_PACKETSIZE[config.P_CLIENT_OK_FOR_LOGIN_SEND] = config.S_CLIENT_OK_FOR_LOGIN_SEND;
	this.WORKER_FUNCTION[config.P_CREATE_MOUSE_PASSWORD_SEND] = 'W_CREATE_MOUSE_PASSWORD_SEND';
	this.WORKER_PACKETSIZE[config.P_CREATE_MOUSE_PASSWORD_SEND] = config.S_CREATE_MOUSE_PASSWORD_SEND;
	this.WORKER_FUNCTION[config.P_CHANGE_MOUSE_PASSWORD_SEND] = 'W_CHANGE_MOUSE_PASSWORD_SEND';
	this.WORKER_PACKETSIZE[config.P_CHANGE_MOUSE_PASSWORD_SEND] = config.S_CHANGE_MOUSE_PASSWORD_SEND;
	this.WORKER_FUNCTION[config.P_LOGIN_MOUSE_PASSWORD_SEND] = 'W_LOGIN_MOUSE_PASSWORD_SEND';
	this.WORKER_PACKETSIZE[config.P_LOGIN_MOUSE_PASSWORD_SEND] = config.S_LOGIN_MOUSE_PASSWORD_SEND;
	this.WORKER_FUNCTION[config.P_CREATE_AVATAR_SEND] = 'W_CREATE_AVATAR_SEND';
	this.WORKER_PACKETSIZE[config.P_CREATE_AVATAR_SEND] = config.S_CREATE_AVATAR_SEND;
	/*WORKER_FUNCTION[config.P_DELETE_AVATAR_SEND] = 'W_DELETE_AVATAR_SEND';
	WORKER_PACKETSIZE[config.P_DELETE_AVATAR_SEND] = config.S_DELETE_AVATAR_SEND;
	WORKER_FUNCTION[config.P_CHANGE_AVATAR_NAME_SEND] = 'W_CHANGE_AVATAR_NAME_SEND';
	WORKER_PACKETSIZE[config.P_CHANGE_AVATAR_NAME_SEND] = config.S_CHANGE_AVATAR_NAME_SEND;
	WORKER_FUNCTION[config.P_DEMAND_GIFT_SEND] = 'W_DEMAND_GIFT_SEND';
	WORKER_PACKETSIZE[config.P_DEMAND_GIFT_SEND] = config.S_DEMAND_GIFT_SEND;
	WORKER_FUNCTION[config.P_WANT_GIFT_SEND] = 'W_WANT_GIFT_SEND';
	WORKER_PACKETSIZE[config.P_WANT_GIFT_SEND] = config.S_WANT_GIFT_SEND;
	WORKER_FUNCTION[config.P_DEMAND_ZONE_SERVER_INFO_1] = 'W_DEMAND_ZONE_SERVER_INFO_1';
	WORKER_PACKETSIZE[config.P_DEMAND_ZONE_SERVER_INFO_1] = config.S_DEMAND_ZONE_SERVER_INFO_1;
	WORKER_FUNCTION[config.P_FAIL_MOVE_ZONE_1_SEND] = 'W_FAIL_MOVE_ZONE_1_SEND';
	WORKER_PACKETSIZE[config.P_FAIL_MOVE_ZONE_1_SEND] = config.S_FAIL_MOVE_ZONE_1_SEND;*/
	return callback(true);
}
this.W_FUNCTION = function(workerID)
{
	return this.WORKER_FUNCTION[workerID];
}
this.W_SIZE = function(workerID)
{
	return this.WORKER_PACKETSIZE[workerID];
}
this.W_LOGIN_SEND = function( tUserIndex )
{
	if( user.mUSER[tUserIndex].uCheckValidState )
	{
		user.Quit( tUserIndex );
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();

	var tID = new Buffer( config.MAX_USER_ID_LENGTH ).fill( 0 );
	var tPassword = new Buffer(config.MAX_USER_PASSWORD_LENGTH).fill( 0 );
	var tVersion = new Buffer( 4 ).fill( 0 );
	var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH).fill( 0 );
	var index01;
	
	var tPacket = Buffer( user.mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy(tID, 0, 0, tID.length );
	tPacket.copy(tPassword, 0, tID.length, ( tID.length + tPassword.length ) );
	tPacket.copy(tVersion, 0, ( tID.length + tPassword.length ), ( tID.length + tPassword.length + tVersion.length ) );
	tVersion = tVersion.readInt32LE();	
	//console.log(tID);
	//console.log(tPassword);
	//console.log(tVersion);
	if( tVersion != config.VERSION )
	{
		mTRANSFER.B_LOGIN_RECV(4, tID, 0, 0, "0000");
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
		{
			mTRANSFER.B_USER_AVATAR_INFO();	
			user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		}
		mTRANSFER.B_RCMD_WORLD_SEND();
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
	}
	if( ( mGAME.CheckNameString(tID) === false ) || ( mGAME.CheckNameString(tPassword) === false) )
	{
		mTRANSFER.B_LOGIN_RECV( 6, tID, 0, 0, "0000" );
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
		{
			mTRANSFER.B_USER_AVATAR_INFO();	
			user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		}
		mTRANSFER.B_RCMD_WORLD_SEND();
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
	}
	
	mDB.DB_PROCESS_02( tUserIndex, mGAME.BufToStr(tID), mGAME.BufToStr(tPassword), user.mUSER[tUserIndex].uIP, function( tResult, uID, uUserSort, uMousePassword )
	{
		if(tResult != 0)
		{
			mTRANSFER.B_LOGIN_RECV( tResult, tID, 0, 0, "0000" );
			user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
			for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
			{
				mTRANSFER.B_USER_AVATAR_INFO();	
				user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
			}
			mTRANSFER.B_RCMD_WORLD_SEND();
			user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
			return;
		}
		user.mUSER[tUserIndex].uCheckValidState = true;
		user.mUSER[tUserIndex].uID = uID;
		user.mUSER[tUserIndex].uUserSort = uUserSort;
		user.mUSER[tUserIndex].uMousePassword = uMousePassword;
		user.mUSER[tUserIndex].uSecondLoginSort = 1;
		user.mUSER[tUserIndex].uSecondLoginTryNum = 0;
		user.mUSER[tUserIndex].uMoveZoneResult = 0;
		if (user.mUSER[tUserIndex].uMousePassword != '')
		{
			tMousePassword = '****';
		}
		
		//coneolse.log("success to login");
		mTRANSFER.B_LOGIN_RECV( 0, user.mUSER[tUserIndex].uID, user.mUSER[tUserIndex].uUserSort, user.mUSER[tUserIndex].uSecondLoginSort, tMousePassword );
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
		{
			mTRANSFER.B_USER_AVATAR_INFO();	
			user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		}
		mTRANSFER.B_RCMD_WORLD_SEND();
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
	});
}
this.W_CLIENT_OK_FOR_LOGIN_SEND = function( tUserIndex )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		user.Quit( tUserIndex );
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
}
this.W_CREATE_MOUSE_PASSWORD_SEND = function( tUserIndex )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		user.Quit( tUserIndex );
		return;
	}
	if ( user.mUSER[tUserIndex].uSecondLoginSort != 1 )
	{
		user.Quit( tUserIndex );
		return;
	}
	if ( user.mUSER[tUserIndex].uMousePassword != '' )
	{
		user.Quit( tUserIndex );
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
	
	var tMousePassword = new Buffer( config.MAX_MOUSE_PASSWORD_LENGTH ).fill( 0 );
	var tPacket = Buffer( user.mUSER[tUserIndex].uBUFFER_FOR_RECV )
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tMousePassword, 0, 0, (config.MAX_MOUSE_PASSWORD_LENGTH - 1) );

	for (var index01 = 0; index01 < 4; index01++)
	{
		if ( ( parseInt( tMousePassword[index01] ) < 48 ) && ( parseInt( tMousePassword[index01] ) > 57 ) ) //0-9
		{
			user.Quit( tUserIndex );
			return;
		}
	}
	
	mDB.DB_PROCESS_03( mGAME.BufToStr(user.uID[tUserIndex]), mGAME.BufToStr(tMousePassword), function( tResult )
	{
		if(tResult != 0)
		{
			mTRANSFER.B_CREATE_MOUSE_PASSWORD_RECV( 1, "0000" );
			user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
			return;
		}
		user.mUSER[tUserIndex].uMousePassword = tMousePassword;
		user.mUSER[tUserIndex].uSecondLoginSort = 0;
		mTRANSFER.B_CREATE_MOUSE_PASSWORD_RECV( 0, user.mUSER[tUserIndex].uMousePassword );
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
	});
}
this.W_CHANGE_MOUSE_PASSWORD_SEND = function( tUserIndex )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		user.Quit( tUserIndex );
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
}
this.W_LOGIN_MOUSE_PASSWORD_SEND = function ( tUserIndex )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		user.Quit( tUserIndex );
		return;
	}	
	if ( user.mUSER[tUserIndex].uSecondLoginSort != 1 )
	{
		user.Quit( tUserIndex );
		return;
	}
	if ( user.mUSER[tUserIndex].uMousePassword == '' )
	{
		user.Quit( tUserIndex );
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
	
	var tMousePassword = new Buffer( config.MAX_MOUSE_PASSWORD_LENGTH ).fill( 0 );
	var tPacket = Buffer( user.mUSER[tUserIndex].uBUFFER_FOR_RECV )
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tMousePassword, 0, 0, ( config.MAX_MOUSE_PASSWORD_LENGTH - 1 ) );
	
	for ( var index01 = 0; index01 < 4; index01++ )
	{
		if ( ( parseInt( tMousePassword[index01] ) < 48 ) && ( parseInt( tMousePassword[index01] ) > 57 ) ) //0-9
		{	
			user.Quit( tUserIndex );
			return;
		}
	}
	
	if ( user.mUSER[tUserIndex].uMousePassword != mGAME.BufToStr( tMousePassword ) )
	{
		console.log( "mismatch 2nd password : wrong : %s, real : %s",  user.mUSER[tUserIndex].uMousePassword, mGAME.BufToStr( tMousePassword ) );
		mTRANSFER.B_LOGIN_MOUSE_PASSWORD_RECV( 1 );
		user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
		user.mUSER[tUserIndex].uSecondLoginTryNum++;
		if ( user.mUSER[tUserIndex].uSecondLoginTryNum == 3 )
		{
			//console.log("wrong 3 times");
			user.Quit( tUserIndex );
			return;
		}
		return;
	}
	//coneolse.log("success to login 2nd password");
	user.mUSER[tUserIndex].uSecondLoginSort = 0;
	mTRANSFER.B_LOGIN_MOUSE_PASSWORD_RECV( 0 );
	user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
}
this.W_CREATE_AVATAR_SEND = function( tUserIndex )
{
	if ( !user.mUSER[tUserIndex].uCheckValidState )
	{
		user.Quit( tUserIndex );
		return;
	}
	if ( user.mUSER[tUserIndex].uSecondLoginSort != 0 )
	{
		user.Quit( tUserIndex );
		return;
	}
	if ( user.mUSER[tUserIndex].uMoveZoneResult == 1 )
	{
		user.Quit( tUserIndex );
		return;
	}
	user.mUSER[tUserIndex].mUsedTime = mGAME.GetTickCount();
	
	var tAvatarPost = new Buffer( 4 ).fill( 0 );
	var AVATAR_INFO = Buffer.alloc( config.SIZE_OF_AVATAR_INFO ).fill( 0 );
	var tPacket = Buffer( user.mUSER[tUserIndex].uBUFFER_FOR_RECV )
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tAvatarPost, 0, 0, 4 );
	tPacket.copy( AVATAR_INFO, 0, 4, config.SIZE_OF_AVATAR_INFO );

	var tAvatarInfo = struct._.unpackSync( 'AVATAR_INFO', AVATAR_INFO );
	//tAvatarInfo.copy( tAvatarInfo, 0, 0, config.SIZE_OF_AVATAR_INFO );
	console.log("aName", tAvatarInfo.aName);
	//console.log("aName", tAvatarInfoss.aVisibleState);
	/*console.log("aName", struct.AVATAR_INFO1[4]);
	console.log("aName", struct.AVATAR_INFO1[8]);
	console.log("aName", struct.AVATAR_INFO1[12]);
	console.log("aName", struct.AVATAR_INFO1[16]);
	console.log("aName", struct.AVATAR_INFO1[20]);*/
	
	tAvatarPost = tAvatarPost.readInt32LE();
	console.log("tAvatarPost",tAvatarPost);
	if( ( tAvatarPost < 0 ) || ( tAvatarPost > 2 ) )//|| ( user.mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aName != '' ) )
	{
		user.Quit( tUserIndex );
		return;
	}
	mTRANSFER.B_CREATE_AVATAR_RECV( 0, AVATAR_INFO );
	user.Send( tUserIndex, true, mTRANSFER.packet, mTRANSFER.packets );
}
module.exports = this;