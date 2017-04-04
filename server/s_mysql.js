var mysql = require('mysql');
var config = require('../config');
var mGAME = require('./s_game');
var struct = require('../struct');
var user = require('./s_user');

var connection;
this.INIT = function( host, port, user, pass, database, callback )
{
	if( (host == undefined) || (port == undefined) || (user == undefined) || (pass == undefined) || (database == undefined) )
	{
		return false;
	}
	connection = mysql.createConnection({
		host     : host,
		port     : port,
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
	connection.connect( function(err)
	{
		if (err)
		{
			console.error('error connecting: ' + err.code);
			return callback( false );
		}
	});
	return callback( true );
}
var mQuery;
var nQuery;
var DB_QUERY = function ( mQuery1, mQuery2, callback )
{
	//callback = returnStatus , returnData
	connection.query( mQuery1, mQuery2, function( err, result )
	{
		if (err)
		{
			console.log("Query ERROR 1 : ", mQuery1);
			console.log("Query ERROR 2 : ", mQuery2);
			return callback( false );
		}
		callback( true, result[0] );
	});
}
this.DB_PROCESS_01 = function( callback )
{
	mQuery = 'select * from ??';
	nQuery = [config.MY_TB01];
	DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_01 ERROR");
			return callback( false );
		}
		mGAME.mMaxPlayerNum = returnData.mMaxUserNum;
		mGAME.mAddPlayerNum = returnData.mAddPlayerNum;
		mGAME.mGagePlayerNum = returnData.mGageUserNum;
		return callback( true );
	});
}
this.DB_PROCESS_02 = function( tUserIndex, tID, tPassword, tIP, callback )
{
	//var index01;
	var uSaveMoney;
	var uSaveMoney2;
	var uSaveItem;
	var aName = [];
	
	mQuery = 'select * from ?? where uID = ?';
	nQuery = [config.MY_TB02, tID];
	DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_02 ERROR");
			return callback( 5 );
		}
		//console.log("result from db is : ", returnData);
		if ( returnData == undefined )
		{
			console.log("Wrong Account");
			return callback( 6 );
		}
		if ( returnData.uPassword != mGAME.BufToStr( tPassword ) )
		{
			console.log( "Wrong Password ", mGAME.BufToStr( tPassword ),": Real Password is : ", returnData.uPassword );
			return callback( 7 );
		}
		user.mUSER[tUserIndex].uID = returnData.uID;
		user.mUSER[tUserIndex].uUserSort = returnData.uUserSort;
		user.mUSER[tUserIndex].uMousePassword = returnData.uMousePassword;
		console.log("The account and password are correct");
		
		mQuery = 'select count(uID) as uIDNum from ?? where uID = ?';
		nQuery = [config.MY_TB04, tID];
		DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
		{
			if ( !returnStatus )
			{
				console.log("DB_PROCESS_02 ERROR");
				return callback( 5 );
			}
			if (returnData.uIDNum == 0)
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
				mQuery = 'insert into ?? set ?';
				nQuery = [config.MY_TB04,{uID: tID, uSaveMoney: uSaveMoney, uSaveMoney2: uSaveMoney2, uSaveItem: uSaveItem, aName01: aName[0], aName02: aName[1], aName03: aName[2]}];
				DB_QUERY( mQuery, nQuery, function ( returnStatus )
				{
					if ( !returnStatus )
					{
						console.log("DB_PROCESS_02 ERROR");
						return callback( 5 );
					}
				});
				return callback( 0, user.mUSER[tUserIndex].uID, user.mUSER[tUserIndex].uUserSort, user.mUSER[tUserIndex].uMousePassword );
			}
			else
			{
				mQuery = 'select * from ?? where uID = ?';
				nQuery = [config.MY_TB04, tID];
				DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
				{
					if ( !returnStatus )
					{
						console.log("DB_PROCESS_02 ERROR");
						return callback( 5 );
					}
					if (returnData.uLoginState == 1)
					{
						return callback( 8 );	
					}
					uSaveMoney = returnData.uSaveMoney;
					uSaveMoney2 = returnData.uSaveMoney2;
					uSaveItem = returnData.uSaveItem;
					aName[0] = returnData.aName01;
					aName[1] = returnData.aName02;
					aName[2] = returnData.aName03;
					//for (index01 = 0; index01 < config.MAX_SAVE_ITEM_SLOT_NUM; index01++)
					//{
						//5
						//3
						//9
						//8
					//}
					//for ( index01 = 0; index01 < 1; index01++ )
					//{
						user.mUSER[tUserIndex].uAvatarInfo[0].aName = aName[0];
						//if(aName[0] == '')
						//{
						//	continue;
						//}
						mQuery = 'select * from ?? where aName = ?';
						nQuery = [config.MY_TB03, user.mUSER[tUserIndex].uAvatarInfo[0].aName];
						DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
						{
							//console.log(user.mUSER[tUserIndex].uAvatarInfo[0].aName);
							//if(index01>=3)return;
							if ( !returnStatus )
							{
								console.log("SELECT AVATAR ERROR");
								return callback( 5 );
							}
							//console.log(returnData);
							if( returnData == undefined )
							{
								return callback( 5 );
							}
							//console.log(aName[index01]);
							user.mUSER[tUserIndex].uAvatarInfo[0].aVisibleState = returnData.aVisibleState;
							user.mUSER[tUserIndex].uAvatarInfo[0].aSpecialState = returnData.aSpecialState;
							user.mUSER[tUserIndex].uAvatarInfo[0].aPlayTime1 = returnData.aPlayTime1;
							user.mUSER[tUserIndex].uAvatarInfo[0].aPlayTime2 = returnData.aPlayTime2;
							user.mUSER[tUserIndex].uAvatarInfo[0].aKillOtherTribe = returnData.aKillOtherTribe;
							user.mUSER[tUserIndex].uAvatarInfo[0].aTribe = returnData.aTribe;
							user.mUSER[tUserIndex].uAvatarInfo[0].aPreviousTribe = returnData.aPreviousTribe;
							user.mUSER[tUserIndex].uAvatarInfo[0].aGender = returnData.aGender;
							user.mUSER[tUserIndex].uAvatarInfo[0].aHeadType = returnData.aHeadType;
							user.mUSER[tUserIndex].uAvatarInfo[0].aFaceType = returnData.aFaceType;
							user.mUSER[tUserIndex].uAvatarInfo[0].aLevel1 = returnData.aLevel1;
							user.mUSER[tUserIndex].uAvatarInfo[0].aLevel2 = returnData.aLevel2;
							user.mUSER[tUserIndex].uAvatarInfo[0].aGeneralExperience1 = returnData.aGeneralExperience1
							user.mUSER[tUserIndex].uAvatarInfo[0].aGeneralExperience1 = returnData.aGeneralExperience2;
							user.mUSER[tUserIndex].uAvatarInfo[0].aVit = returnData.aVit;
							user.mUSER[tUserIndex].uAvatarInfo[0].aStr = returnData.aStr;
							user.mUSER[tUserIndex].uAvatarInfo[0].aInt = returnData.aInt;
							user.mUSER[tUserIndex].uAvatarInfo[0].aDex = returnData.aDex;
							console.log( user.mUSER[tUserIndex].uAvatarInfo[0].aName );
							//user.mUSER[tUserIndex].uAvatarInfo[0] = Buffer( struct.pack( user.mUSER[tUserIndex].uAvatarInfo[0] ) );
							//user.mUSER[tUserIndex].uAvatarInfo[0].copy( user.mUSER[tUserIndex].uAvatarInfo[0], 0, 0, this.SIZE_OF_AVATAR_INFO );
							//console.log( user.mUSER[tUserIndex].uAvatarInfo[0] );
							return callback( 0 );
						});
					//}
				});
			}
		});
	});
}
this.DB_PROCESS_03 = function( tID, tMousePassword, callback )
{
	mQuery = 'update ?? set uMousePassword = ? where uID = ?';
	nQuery = [config.MY_TB02, tMousePassword, tID];
	DB_QUERY( mQuery, nQuery, function ( returnStatus )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_02 ERROR");
			return callback( false );
		}
		return callback( true );
	});
}
module.exports = this;
