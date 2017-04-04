var mysql = require('mysql');
var config = require('../config');
var mGAME = require('./s_game');
var struct = require('../struct');
var user = require('./s_user');

var connection;
var mQuery;
var nQuery;
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
var DB_MAKE_QUERY_FOR_AVATAR = function ( tSort, tUserIndex, tCharSlot, callback )
{
	//load,create,delete characters
	switch( tSort )
	{
		case 0 :
			if(user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aName == '')
			{
				return callback( true );
			}
			mQuery = 'select * from ?? where aName = ?';
			nQuery = [ config.MY_TB03, user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aName ];
			DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
			{
				if ( !returnStatus )
				{
					console.log("DB_MAKE_QUERY_FOR_AVATAR 0");
					return callback( false );
				}
				if ( returnData == undefined )
				{
					console.log("DB_MAKE_QUERY_FOR_AVATAR 0.1");
					return callback( false );
				}
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aVisibleState = returnData.aVisibleState;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aSpecialState = returnData.aSpecialState;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aPlayTime1 = returnData.aPlayTime1;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aPlayTime2 = returnData.aPlayTime2;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aKillOtherTribe = returnData.aKillOtherTribe;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aName = returnData.aName;
				//user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aFree01 = 0;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aTribe = returnData.aTribe;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aPreviousTribe = returnData.aPreviousTribe;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aGender = returnData.aGender;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aHeadType = returnData.aHeadType;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aFaceType = returnData.aFaceType;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aLevel1 = returnData.aLevel1;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aLevel2 = returnData.aLevel2;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aGeneralExperience1 = returnData.aGeneralExperience1;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aGeneralExperience2 = returnData.aGeneralExperience2;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aVit = returnData.aVit;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aStr = returnData.aStr;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aInt = returnData.aInt;
				user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aDex = returnData.aDex;
				//console.log(user.mUSER[tUserIndex].uAvatarInfo[tCharSlot].aLevel1);
				return callback( true );
			});
		return;
		case 1 ://delete character 
		break;
		default : return callback( false );
	}
}
this.DB_PROCESS_01 = function( callback )
{
	mQuery = 'select * from ??';
	nQuery = [ config.MY_TB01 ];
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
	var index01;
	var uSaveMoney;
	var uSaveMoney2;
	var uSaveItem;
	var aName = [];
	
	mQuery = 'select * from ?? where uID = ?';
	nQuery = [ config.MY_TB02, tID ];
	DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_02 ERROR");
			return callback ( 5 );
		}
		//console.log("result from db is : ", returnData);
		if ( returnData == undefined )
		{
			console.log("Wrong Account");
			return callback ( 6 );
		}
		if ( returnData.uPassword != mGAME.BufToStr( tPassword ) )
		{
			console.log( "Wrong Password ", mGAME.BufToStr( tPassword ),": Real Password is : ", returnData.uPassword );
			return callback ( 7 );
		}
		user.mUSER[tUserIndex].uID = returnData.uID;
		user.mUSER[tUserIndex].uUserSort = returnData.uUserSort;
		user.mUSER[tUserIndex].uMousePassword = returnData.uMousePassword;
		console.log("The account and password are correct");
		
		mQuery = 'select count(uID) as uIDNum from ?? where uID = ?';
		nQuery = [ config.MY_TB04, tID ];
		DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
		{
			if ( !returnStatus )
			{
				console.log("DB_PROCESS_02 ERROR");
				return callback ( 5 );
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
				nQuery = [ config.MY_TB04, { uID: tID, uSaveMoney: uSaveMoney, uSaveMoney2: uSaveMoney2, uSaveItem: uSaveItem, aName01: aName[0], aName02: aName[1], aName03: aName[2] } ];
				DB_QUERY( mQuery, nQuery, function ( returnStatus )
				{
					if ( !returnStatus )
					{
						console.log("DB_PROCESS_02 ERROR");
						return callback ( 5 );
					}
				});
				return callback ( 0 );
			}
			else
			{
				mQuery = 'update ?? set uLoginState = 0, uIP = ? where uID = ?';
				nQuery = [ config.MY_TB04, tIP, tID ];
				DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
				{
					if ( !returnStatus )
					{
						console.log("DB_PROCESS_02 ERROR");
						return callback ( 5 );
					}	
					mQuery = 'select * from ?? where uID = ?';
					nQuery = [ config.MY_TB04, tID ];
					DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
					{
						if ( !returnStatus )
						{
							console.log("DB_PROCESS_02 ERROR");
							return callback ( 5 );
						}
						if (returnData.uLoginState == 1)
						{
							return callback ( 8 );	
						}
						uSaveMoney = returnData.uSaveMoney;
						uSaveMoney2 = returnData.uSaveMoney2;
						uSaveItem = returnData.uSaveItem;
						user.mUSER[tUserIndex].uAvatarInfo[0].aName = returnData.aName01;
						user.mUSER[tUserIndex].uAvatarInfo[1].aName = returnData.aName02;
						user.mUSER[tUserIndex].uAvatarInfo[2].aName = returnData.aName03;
						//for (index01 = 0; index01 < config.MAX_SAVE_ITEM_SLOT_NUM; index01++)
						//{
							//5
							//3
							//9
							//8
						//}
						DB_MAKE_QUERY_FOR_AVATAR ( 0, tUserIndex, 0, function ( returnStatus )
						{
							if ( !returnStatus )
							{
								console.log("AVATAR1 ERROR");
								return callback ( 5 );
							}
							DB_MAKE_QUERY_FOR_AVATAR ( 0, tUserIndex, 1, function ( returnStatus )
							{
								if ( !returnStatus )
								{
									console.log("AVATAR2 ERROR");
									return callback ( 5 );
								}
								DB_MAKE_QUERY_FOR_AVATAR ( 0, tUserIndex, 2, function ( returnStatus )
								{
									if ( !returnStatus )
									{
										console.log("AVATAR3 ERROR");
										return callback ( 5 );
									}
									callback ( 0 );
								});
							});
						});
					});
				});
			}
		});
	});
}
this.DB_PROCESS_03 = function( tID, tMousePassword, callback )
{
	mQuery = 'update ?? set uMousePassword = ? where uID = ?';
	nQuery = [ config.MY_TB02, tMousePassword, tID ];
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
this.DB_PROCESS_04 = function( tUserIndex, tAvatarPost, tAvatarInfo, callback )
{
	mQuery = 'insert into ?? set ?';
	nQuery = [ config.MY_TB03, {
	aInsertTime: 'now()',
	uID: user.mUSER[tUserIndex].uID,
	aVisibleState: tAvatarInfo.aVisibleState,
	aSpecialState: tAvatarInfo.aSpecialState,
	aPlayTime1: tAvatarInfo.aPlayTime1,
	aPlayTime2: tAvatarInfo.aPlayTime2,
	aKillOtherTribe: tAvatarInfo.aKillOtherTribe,
	aName: tAvatarInfo.aName,
	aTribe: tAvatarInfo.aTribe,
	aPreviousTribe: tAvatarInfo.aPreviousTribe,
	aGender: tAvatarInfo.aGender,
	aHeadType: tAvatarInfo.aHeadType,
	aFaceType: tAvatarInfo.aFaceType,
	aLevel1: tAvatarInfo.aLevel1,
	aLevel2: tAvatarInfo.aLevel2,
	aGeneralExperience1: tAvatarInfo.aGeneralExperience1,
	aGeneralExperience2: tAvatarInfo.aGeneralExperience2,
	aVit: tAvatarInfo.aVit,
	aStr: tAvatarInfo.aStr,
	aInt: tAvatarInfo.aInt,
	aDex: tAvatarInfo.aDex
	} ];
	DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
	{
		if ( !returnStatus )
		{
			console.log("NAME ALREADY");
			return callback( 2 );
		}
		switch (tAvatarPost)
		{
		case 0: mQuery = 'update ?? set aName01 = ? where uID = ?'; break;
		case 1: mQuery = 'update ?? set aName02 = ? where uID = ?'; break;
		case 2: mQuery = 'update ?? set aName03 = ? where uID = ?'; break;
		default : DB_QUERY( mQuery, nQuery );//delete character in avatarinfo if cant update name in masterinfo
		return callback( 1 );
		}
		nQuery = [ config.MY_TB04, tAvatarInfo.aName, user.mUSER[tUserIndex].uID ];
		DB_QUERY( mQuery, nQuery, function ( returnStatus )
		{
			if ( !returnStatus )
			{
				mQuery = 'delete ?? where aName = ?';
				nQuery = [ config.MY_TB03, tAvatarInfo.aName ];
				DB_QUERY( mQuery, nQuery );//delete character in avatarinfo if cant update name in masterinfo
				console.log("DB_PROCESS_04 ERROR");
				return callback( 1 );
			}
			return callback( 0 );
		});
	});
}
this.DB_PROCESS_05 = function( tUserIndex, tAvatarPost, callback )
{
	mQuery = 'delete from ?? where aName = ?';
	nQuery = [ config.MY_TB03, user.mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aName ];
	DB_QUERY( mQuery, nQuery, function ( returnStatus )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_05 ERROR DELETE");
			return callback( 1 );
		}
		switch (tAvatarPost)
		{
		case 0: mQuery = 'update ?? set aName01 = ? where uID = ?'; break;
		case 1: mQuery = 'update ?? set aName02 = ? where uID = ?'; break;
		case 2: mQuery = 'update ?? set aName03 = ? where uID = ?'; break;
		default : return callback( 1 );
		}
		nQuery = [ config.MY_TB04, '', user.mUSER[tUserIndex].uID ];
		DB_QUERY( mQuery, nQuery, function ( returnStatus )
		{
			if ( !returnStatus )
			{
				console.log("DB_PROCESS_05 ERROR UPDATE");
				return callback( 1 );
			}
			return callback( 0 );
		});
	});
}
module.exports = this;