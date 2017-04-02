var config = require('../config');
var transfer = require('./s_transfer');
var game = require('./s_game');
var mysql = require('./s_mysql');
var user = require('./s_user');


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
	/*WORKER_PACKETSIZE[config.P_CREATE_AVATAR_SEND] = 'W_CREATE_AVATAR_SEND';
	WORKER_FUNCTION[config.P_CREATE_AVATAR_SEND] = S_CREATE_AVATAR_SEND;
	WORKER_PACKETSIZE[config.P_DELETE_AVATAR_SEND] = 'W_DELETE_AVATAR_SEND';
	WORKER_FUNCTION[config.P_DELETE_AVATAR_SEND] = S_DELETE_AVATAR_SEND;
	WORKER_PACKETSIZE[config.P_CHANGE_AVATAR_NAME_SEND] = 'W_CHANGE_AVATAR_NAME_SEND';
	WORKER_FUNCTION[config.P_CHANGE_AVATAR_NAME_SEND] = S_CHANGE_AVATAR_NAME_SEND;
	WORKER_PACKETSIZE[config.P_DEMAND_GIFT_SEND] = 'W_DEMAND_GIFT_SEND';
	WORKER_FUNCTION[config.P_DEMAND_GIFT_SEND] = S_DEMAND_GIFT_SEND;
	WORKER_PACKETSIZE[config.P_WANT_GIFT_SEND] = 'W_WANT_GIFT_SEND';
	WORKER_FUNCTION[config.P_WANT_GIFT_SEND] = S_WANT_GIFT_SEND;
	WORKER_PACKETSIZE[config.P_DEMAND_ZONE_SERVER_INFO_1] = 'W_DEMAND_ZONE_SERVER_INFO_1';
	WORKER_FUNCTION[config.P_DEMAND_ZONE_SERVER_INFO_1] = S_DEMAND_ZONE_SERVER_INFO_1;
	WORKER_PACKETSIZE[config.P_FAIL_MOVE_ZONE_1_SEND] = 'W_FAIL_MOVE_ZONE_1_SEND';
	WORKER_FUNCTION[config.P_FAIL_MOVE_ZONE_1_SEND] = S_FAIL_MOVE_ZONE_1_SEND;*/
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
this.W_LOGIN_SEND = function( socket, tUserIndex, tData )
{
	if( user.mUSER[tUserIndex].uCheckValidState )
	{
		socket.destroy();
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = game.GetTickCount();

	var tPacket = Buffer(tData);
	var tID = new Buffer(config.MAX_USER_ID_LENGTH).fill(0);
	var tPassword = new Buffer(config.MAX_USER_PASSWORD_LENGTH).fill(0);
	var tVersion = new Buffer(4).fill(0);
	var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH).fill(0);
	var index01;
	
	tPacket.copy(tID, 0, 0, tID.length );
	tPacket.copy(tPassword, 0, tID.length, ( tID.length + tPassword.length ) );
	tPacket.copy(tVersion, 0, ( tID.length + tPassword.length ), ( tID.length + tPassword.length + tVersion.length ) );
	tVersion = tVersion.readInt32LE();	
	//console.log(tID);
	//console.log(tPassword);
	//console.log(tVersion);
	if( tVersion != config.VERSION )
	{
		transfer.B_LOGIN_RECV(4, tID, 0, 0, "0000");
		user.Send( socket, tUserIndex, true, transfer.packet, transfer.packets );
		for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
		{
			transfer.B_USER_AVATAR_INFO();	
			user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
		}
		transfer.B_RCMD_WORLD_SEND();
		user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
	}
	if( ( game.CheckNameString(tID) === false ) || ( game.CheckNameString(tPassword) === false) )
	{
		transfer.B_LOGIN_RECV( 6, tID, 0, 0, "0000" );
		user.Send( socket, tUserIndex, true, transfer.packet, transfer.packets );
		for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
		{
			transfer.B_USER_AVATAR_INFO();	
			user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
		}
		transfer.B_RCMD_WORLD_SEND();
		user.Send( socket, tUserIndex, true, transfer.packet, transfer.packets );
	}
	
	mysql.DB_PROCESS_02( tUserIndex, game.BufToStr(tID), game.BufToStr(tPassword), user.mUSER[tUserIndex].uIP, function( tResult, uID, uUserSort, uMousePassword )
	{
		if(tResult != 0)
		{
			transfer.B_LOGIN_RECV( tResult, tID, 0, 0, "0000" );
			user.Send(socket, tUserIndex, true, transfer.packet, transfer.packets);
			for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
			{
				transfer.B_USER_AVATAR_INFO();	
				user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
			}
			transfer.B_RCMD_WORLD_SEND();
			user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
			return;
		}
		user.mUSER[tUserIndex].uCheckValidState = true;
		user.mUSER[tUserIndex].uID = uID;
		user.mUSER[tUserIndex].uUserSort = uUserSort;
		user.mUSER[tUserIndex].uMousePassword = uMousePassword;
		user.mUSER[tUserIndex].uSecondLoginSort = 1;
		user.mUSER[tUserIndex].uSecondLoginTryNum = 0;		
		if (user.mUSER[tUserIndex].uMousePassword != '')
		{
			tMousePassword = '****';
		}
		
		//coneolse.log("success to login");
		transfer.B_LOGIN_RECV( 0, user.mUSER[tUserIndex].uID, user.mUSER[tUserIndex].uUserSort, user.mUSER[tUserIndex].uSecondLoginSort, tMousePassword );
		user.Send(socket, tUserIndex, true, transfer.packet, transfer.packets);
		for( index01 = 0 ; index01 < config.MAX_USER_AVATAR_NUM ; index01++ )
		{
			transfer.B_USER_AVATAR_INFO();	
			user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
		}
		transfer.B_RCMD_WORLD_SEND();
		user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
	});
}
this.W_CLIENT_OK_FOR_LOGIN_SEND = function( socket, tUserIndex, tData )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		socket.destroy();
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = game.GetTickCount();
}
this.W_CREATE_MOUSE_PASSWORD_SEND = function( socket, tUserIndex, tData )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		socket.destroy();
		return;
	}
	if ( user.mUSER[tUserIndex].uSecondLoginSort != 1 )
	{
		socket.destroy();
		return;
	}
	if ( user.mUSER[tUserIndex].uMousePassword != '' )
	{
		socket.destroy();
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = game.GetTickCount();
	
	var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH).fill(0);
	var tPacket = Buffer(tData).copy( tMousePassword, 0, 0, (config.MAX_MOUSE_PASSWORD_LENGTH - 1) );

	for (var index01 = 0; index01 < 4; index01++)
	{
		//console.log(parseInt(tMousePassword[index01]));
		if ( ( parseInt( tMousePassword[index01] ) < 48 ) && ( parseInt( tMousePassword[index01] ) > 57 ) ) //0-9
		{
			socket.destroy();
			return;
		}
	}
	
	mysql.DB_PROCESS_03( game.BufToStr(user.uID[tUserIndex]), game.BufToStr(tMousePassword), function( tResult )
	{
		if(tResult != 0)
		{
			transfer.B_CREATE_MOUSE_PASSWORD_RECV( 1, "0000" );
			user.Send( socket, tUserIndex, true, transfer.packet, transfer.packets );
			return;
		}
		user.mUSER[tUserIndex].uMousePassword = tMousePassword;
		user.mUSER[tUserIndex].uSecondLoginSort = 0;
		transfer.B_CREATE_MOUSE_PASSWORD_RECV( 0, user.mUSER[tUserIndex].uMousePassword );
		user.Send( socket, tUserIndex, true, transfer.packet, transfer.packets );
	});
}
this.W_CHANGE_MOUSE_PASSWORD_SEND = function( socket, tUserIndex, tData )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		socket.destroy();
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = game.GetTickCount();
}
this.W_LOGIN_MOUSE_PASSWORD_SEND = function ( socket, tUserIndex, tData )
{
	if( !user.mUSER[tUserIndex].uCheckValidState )
	{
		socket.destroy();
		return;
	}	
	if ( user.mUSER[tUserIndex].uSecondLoginSort != 1 )
	{
		socket.destroy();
		return;
	}
	if ( user.mUSER[tUserIndex].uMousePassword == '' )
	{
		socket.destroy();
		return;
	}
	user.mUSER[tUserIndex].uUsedTime = game.GetTickCount();
	
	var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH).fill(0);
	var tPacket = Buffer(tData).copy( tMousePassword, 0, 0, (config.MAX_MOUSE_PASSWORD_LENGTH - 1) );

	for ( var index01 = 0; index01 < 4; index01++ )
	{
		if ( ( parseInt( tMousePassword[index01] ) < 48 ) && ( parseInt( tMousePassword[index01] ) > 57 ) ) //0-9
		{	
			socket.destroy();
			return;
		}
	}
	
	if ( user.mUSER[tUserIndex].uMousePassword != game.BufToStr(tMousePassword) )
	{
		console.log("mismatch 2nd password : wrong : %s, real : %s",  user.mUSER[tUserIndex].uMousePassword, game.BufToStr(tMousePassword));
		transfer.B_LOGIN_MOUSE_PASSWORD_RECV( 1 );
		user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
		user.mSecondLoginTryNum[tUserIndex]++;
		if (user.mSecondLoginTryNum[tUserIndex] == 3)
		{
			//console.log("wrong 3 times");
			socket.destroy();
			return;
		}
		return;
	}
	//coneolse.log("success to login 2nd password");
	user.mUSER[tUserIndex].uSecondLoginSort = 0;
	transfer.B_LOGIN_MOUSE_PASSWORD_RECV( 0 );
	user.Send( socket,tUserIndex, true, transfer.packet, transfer.packets );
}
module.exports = this;
