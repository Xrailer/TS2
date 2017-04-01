"use strict";
var config = require('../config.js');
var Transfer = require('./s_transfer.js');
var User = require('./s_user.js');
var Game = require('./s_game.js');
var Mysql = require('./s_mysql.js');


var transfer = new Transfer();
var user = new User();
var game = new Game();
var mysql = new Mysql();

user.INIT();

var WORKER_PACKETSIZE = [];
var WORKER_FUNCTION = [];
class Worker 
{
	INIT()
	{
		for( var index01 = 0 ; index01 < config.WORKER_SIZE ; index01++ )
		{
			WORKER_FUNCTION[index01] = undefined;
			WORKER_PACKETSIZE[index01] = 0;
		}
		WORKER_FUNCTION[config.P_LOGIN_SEND] = 'W_LOGIN_SEND';
		WORKER_PACKETSIZE[config.P_LOGIN_SEND] = config.S_LOGIN_SEND;
		WORKER_FUNCTION[config.P_CLIENT_OK_FOR_LOGIN_SEND] = 'W_CLIENT_OK_FOR_LOGIN_SEND';
		WORKER_PACKETSIZE[config.P_CLIENT_OK_FOR_LOGIN_SEND] = config.S_CLIENT_OK_FOR_LOGIN_SEND;
		WORKER_FUNCTION[config.P_CREATE_MOUSE_PASSWORD_SEND] = 'W_CREATE_MOUSE_PASSWORD_SEND';
		WORKER_PACKETSIZE[config.P_CREATE_MOUSE_PASSWORD_SEND] = config.S_CREATE_MOUSE_PASSWORD_SEND;
		WORKER_FUNCTION[config.P_CHANGE_MOUSE_PASSWORD_SEND] = 'W_CHANGE_MOUSE_PASSWORD_SEND';
		WORKER_PACKETSIZE[config.P_CHANGE_MOUSE_PASSWORD_SEND] = config.S_CHANGE_MOUSE_PASSWORD_SEND;
		WORKER_FUNCTION[config.P_LOGIN_MOUSE_PASSWORD_SEND] = 'W_LOGIN_MOUSE_PASSWORD_SEND';
		WORKER_PACKETSIZE[config.P_LOGIN_MOUSE_PASSWORD_SEND] = config.S_LOGIN_MOUSE_PASSWORD_SEND;
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
		return true;
	}
	W_FUNCTION(workerID)
	{
		return WORKER_FUNCTION[workerID];
	}
	W_SIZE(workerID)
	{
		return WORKER_PACKETSIZE[workerID];
	}
	W_LOGIN_SEND(socket, tUserIndex, tData)
	{
		//console.log("working W_LOGIN_SEND");	
		var tPacket = Buffer(tData);
		var tID = new Buffer(config.MAX_USER_ID_LENGTH);
		var tPassword = new Buffer(config.MAX_USER_PASSWORD_LENGTH);
		var tVersion = new Buffer(4);
		var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH);
		var tResult;
		var index01;
		
		tID.fill(0);
		tPassword.fill(0);
		tMousePassword.fill(0);

		tPacket.copy(tID, 0, 0, tID.length );
		tPacket.copy(tPassword, 0, tID.length, ( tID.length + tPassword.length ) );
		tPacket.copy(tVersion, 0, ( tID.length + tPassword.length ), ( tID.length + tPassword.length + tVersion.length ) );
		tVersion = tVersion.readInt32LE();	
		//console.log(tID);
		//console.log(tPassword);
		//console.log(tVersion);
		if(tVersion != config.VERSION)
		{
			transfer.B_LOGIN_RECV(4, tID, 0, 0, "0000");
			user.Send(socket, tUserIndex, true, transfer.packet, transfer.packets);
			for( index01 = 0 ; index01 < 3 ; index01++ )
			{
				transfer.B_USER_AVATAR_INFO();	
				user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
			}
			transfer.B_RCMD_WORLD_SEND();
			user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
		}
		if(game.CheckNameString(tID) === false || game.CheckNameString(tPassword) === false)
		{
			transfer.B_LOGIN_RECV(6, tID, 0, 0, "0000");
			user.Send(socket, tUserIndex, true, transfer.packet, transfer.packets);
			for( index01 = 0 ; index01 < 3 ; index01++ )
			{
				transfer.B_USER_AVATAR_INFO();	
				user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
			}
			transfer.B_RCMD_WORLD_SEND();
			user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
		}
		//
		//mysql.DB_PROCESS_02(tUserIndex, tID.toString('utf8').replace(/\0/g, ''), tPassword.toString('utf8').replace(/\0/g, ''));
		mysql.DB_PROCESS_02(game.BufToStr(tID), function(err,data){
			if (err) {
				console.log("Query Login ERROR : ", err);
				tResult = 6;
			} else {
				//console.log("result from db is : ",data);
				if(data == undefined)
				{
					tResult = 6;
					console.log("Wrong Account");
				}
				else
				{
					if(data.uPassword != game.BufToStr(tPassword))
					{
						console.log("Wrong Password ", game.BufToStr(tPassword),": Real Password is : ", data.uPassword);	
						tResult = 7;
					}
					else
					{
						console.log("The account and password are correct");	
						tResult = 0;
						user.uMousePassword[tUserIndex] = data.uMousePassword;
						user.uID[tUserIndex] = game.StrToBuf(data.uID);
					}
				}
			}
			if(tResult != 0)
			{
				transfer.B_LOGIN_RECV(tResult, tID, 0, 0, "0000");
				user.Send(socket, tUserIndex, true, transfer.packet, transfer.packets);
				for( index01 = 0 ; index01 < 3 ; index01++ )
				{
					transfer.B_USER_AVATAR_INFO();	
					user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
				}
				transfer.B_RCMD_WORLD_SEND();
				user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
				return;
			}
						
			user.mSecondLoginSort[tUserIndex] = 1;
			user.mSecondLoginTryNum[tUserIndex] = 0;
			if (user.uMousePassword[tUserIndex] !== "")
			{
				tMousePassword = "****";
			}
			//success
			transfer.B_LOGIN_RECV(0, user.uID[tUserIndex], 0, user.mSecondLoginSort[tUserIndex], tMousePassword);
			user.Send(socket, tUserIndex, true, transfer.packet, transfer.packets);
			for( index01 = 0 ; index01 < 3 ; index01++ )
			{
				transfer.B_USER_AVATAR_INFO();	
				user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
			}
			transfer.B_RCMD_WORLD_SEND();
			user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
		});	
	}
	W_CLIENT_OK_FOR_LOGIN_SEND(socket, tUserIndex, tData)
	{	
		
	}
	W_CREATE_MOUSE_PASSWORD_SEND(socket, tUserIndex, tData)
	{
		if (user.mSecondLoginSort[tUserIndex] != 1)
		{
			user.Quit(socket, tUserIndex);
			return;
		}
		if (user.uMousePassword[tUserIndex] != "")
		{
			user.Quit(socket, tUserIndex);
			return;
		}
		
		var tPacket = Buffer(tData);
		var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH);
		tMousePassword.fill(0);
		tPacket.copy(tMousePassword, 0, 0, (config.MAX_MOUSE_PASSWORD_LENGTH - 1) );
		//console.log(tMousePassword);
		for (var index01 = 0; index01 < 4; index01++)
		{
			//console.log(parseInt(tMousePassword[index01]));
			if ( (parseInt(tMousePassword[index01]) < 48) && (parseInt(tMousePassword[index01]) > 57) ) //0-9
			{
				user.Quit(socket, tUserIndex);
				return;
			}
		}
		var tResult;
		mysql.DB_PROCESS_03(game.BufToStr(user.uID[tUserIndex]), game.BufToStr(tMousePassword), function(err,data){
			if (err) {
				console.log("Create tMousePassword ERROR : ", err);
				tResult = 1;
			} else {
				tResult = 0;
			}
			if(tResult != 0)
			{
				transfer.B_CREATE_MOUSE_PASSWORD_RECV(1, "0000");
				user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
				return;
			}
			user.uMousePassword[tUserIndex] = tMousePassword;
			user.mSecondLoginSort[tUserIndex] = 0;
			transfer.B_CREATE_MOUSE_PASSWORD_RECV(0, user.uMousePassword[tUserIndex]);
			user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
		});
	}
	W_CHANGE_MOUSE_PASSWORD_SEND(socket, tUserIndex, tData)
	{
		
	}
	W_LOGIN_MOUSE_PASSWORD_SEND(socket, tUserIndex, tData)
	{
		if (user.mSecondLoginSort[tUserIndex] != 1)
		{
			//user.Quit(socket, tUserIndex);
			socket.destroy();
			return;
		}
		if (user.uMousePassword[tUserIndex] == "")
		{
			//user.Quit(socket, tUserIndex);
			socket.destroy();
			return;
		}
		
		var tPacket = Buffer(tData);
		var tMousePassword = new Buffer(config.MAX_MOUSE_PASSWORD_LENGTH);
		tMousePassword.fill(0);
		tPacket.copy(tMousePassword, 0, 0, (config.MAX_MOUSE_PASSWORD_LENGTH - 1) );
		//console.log(tMousePassword);
		for (var index01 = 0; index01 < 4; index01++)
		{
			//console.log(parseInt(tMousePassword[index01]));
			if ( (parseInt(tMousePassword[index01]) < 48) && (parseInt(tMousePassword[index01]) > 57) ) //0-9
			{
				//user.Quit(socket, tUserIndex);
				//console.log("wrong type of tMousePassword");
				socket.destroy();
				return;
			}
		}
		if (user.uMousePassword[tUserIndex] != game.BufToStr(tMousePassword))
		{
			console.log("mismatch 2nd password : uMouse : %s , tMouse : %s",  user.uMousePassword[tUserIndex], game.BufToStr(tMousePassword));
			transfer.B_LOGIN_MOUSE_PASSWORD_RECV(1);
			user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
			user.mSecondLoginTryNum[tUserIndex]++;
			if (user.mSecondLoginTryNum[tUserIndex] == 3)
			{
				//user.Quit(socket, tUserIndex);
				//console.log("wrong tMousePassword 3 times");
				socket.destroy();
				return;
			}
			return;
		}
		//success
		//coneolse.log("success to login 2nd password");
		user.mSecondLoginSort[tUserIndex] = 0;
		transfer.B_LOGIN_MOUSE_PASSWORD_RECV(0);
		user.Send(socket,tUserIndex, true, transfer.packet, transfer.packets);
	}
}
module.exports = Worker;
