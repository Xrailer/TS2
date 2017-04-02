var mysql = require('mysql');
var config = require('../config');
var game = require('./s_game');
var connection;
this.INIT = function( host, user, pass, database)
{
	if( (host == undefined) || (user == undefined) || (pass == undefined) || (database == undefined) )
	{
		return false;
	}
	connection = mysql.createConnection({
		host     : host,
		user     : user,
		password : pass,
		database : database
	});
	/*var pool  = mysql.createPool({
	  connectionLimit : 10,
	   host     : config.MY_HOST,
	  user     : config.MY_USER,
	  password : config.MY_PASS,
	  database : config.MY_DB
	});*/
	connection.connect(function(err)
	{
		if (err)
		{
			console.error('error connecting: ' + err.stack);
			return false;
		}
	});
	return true;
}	
this.DB_PROCESS_02 = function(tUserIndex, tID, tPassword, callback)
{
	var uLoginState;
	var uSaveMoney;
	var uSaveMoney2;
	var uSaveItem;
	var aName = [];
	connection.query('select * from ?? where uID = ?', [config.MY_TB02, tID], function(err, result)
	{
		if (err)
		{
			console.log("Query Login ERROR : ", err);
			return callback(5);
		}
		//console.log("result from db is : ", result[0]);
		if (result[0] == undefined)
		{
			console.log("Wrong Account");
			return callback(6);
		}
		if (result[0].uPassword != game.BufToStr(tPassword))
		{
			console.log("Wrong Password ", game.BufToStr(tPassword),": Real Password is : ", result[0].uPassword);
			return callback(7);
		}
		console.log("The account and password are correct");
		
		connection.query('select count(uID) as uIDNum from ?? where uID = ?', [config.MY_TB04, tID], function(err, result1)
		{
			if (err)
				return callback(5);
			if (result1[0].uIDNum == 0)
			{
				uSaveMoney = 0;
				uSaveMoney2 = 0;
				for(var i = 0; i < 700; i++)
				{
					if(i == 0)
						uSaveItem = '0';
					else
						uSaveItem += '0';
				}
				aName[0] = '';
				aName[1] = '';
				aName[2] = '';
				console.log(uSaveItem);
				console.log(aName[0]);
				console.log(aName[1]);
				console.log(aName[2]);
				var post = {uID: tID, uSaveMoney: uSaveMoney, uSaveMoney2: uSaveMoney2, uSaveItem: uSaveItem, aName01: aName[0], aName02: aName[1], aName03: aName[2]};
				connection.query('insert into ?? set ?', [config.MY_TB04, post], function(err, result2)
				{
					if (err)
						return callback(5);
				});
			}
			else
			{
				connection.query('select * from ?? where uID = ?', [config.MY_TB04, tID], function(err, result3)
				{
					if (err)
						return callback(5);
					if (result3[0].uLoginState == 1)
						return callback(8);
					//avatar.uSaveMoney = result4[0].uSaveMoney;
					//avatar.uSaveMoney2 = result4[0].uSaveMoney2;
					//avatar.uSaveItem = result4[0].uSaveItem;
					//avatar.aName[0] = result4[0].aName01;
					//avatar.aName[1] = result4[0].aName02;
					//avatar.aName[2] = result4[0].aName03;
				});
			}
		});
		callback( 0, result[0].uID, result[0].uUserSort, result[0].uMousePassword );
	});	
}
this.DB_PROCESS_03 = function(tID, tMousePassword, callback)
{
	connection.query('update ?? set uMousePassword = ? where uID = ?', [config.MY_TB02, tMousePassword, tID], function(err, result)
	{
		if (err)
		{
			callback(1);
			return;
		}
		callback(0);
	});
}
module.exports = this;