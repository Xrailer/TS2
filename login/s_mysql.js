var mysql = require('mysql');
var connection;
var mQuery;
var nQuery;
global.mDB = {};
global.MysqlInit = function( host, port, user, pass, database, callback )
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
	   host     : MY_HOST,
	  user     : MY_USER,
	  password : MY_PASS,
	  database : MY_DB
	});*/
	connection.connect( function(err)
	{
		if (err)
		{
			console.error('error connecting: ' + err.code);
			return callback( false );
		}
	});
	mDB.DB_PROCESS_01 = DB_PROCESS_01;
	mDB.DB_PROCESS_02 = DB_PROCESS_02;
	mDB.DB_PROCESS_03 = DB_PROCESS_03;
	mDB.DB_PROCESS_04 = DB_PROCESS_04;
	mDB.DB_PROCESS_05 = DB_PROCESS_05;
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
	var aEquip;
	//load,create,delete characters
	switch( tSort )
	{
		case 0 :
			if( mUSER[tUserIndex].uAvatarInfo[tCharSlot].aName == '' )
			{
				return callback( true );
			}
			mQuery = 'select * from ?? where aName = ?';
			nQuery = [ MY_TB03, mUSER[tUserIndex].uAvatarInfo[tCharSlot].aName ];
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
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aVisibleState = parseInt(returnData.aVisibleState);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aSpecialState = parseInt(returnData.aSpecialState);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aPlayTime1 = parseInt(returnData.aPlayTime1);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aPlayTime2 = parseInt(returnData.aPlayTime2);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aKillOtherTribe = parseInt(returnData.aKillOtherTribe);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aName = returnData.aName;
				//mUSER[tUserIndex].uAvatarInfo[tCharSlot].aFree01 = 0;
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aTribe = parseInt(returnData.aTribe);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aPreviousTribe = parseInt(returnData.aPreviousTribe);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aGender = parseInt(returnData.aGender);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aHeadType = parseInt(returnData.aHeadType);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aFaceType = parseInt(returnData.aFaceType);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aLevel1 = parseInt(returnData.aLevel1);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aLevel2 = parseInt(returnData.aLevel2);
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aGeneralExperience1 = returnData.aGeneralExperience1;
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aGeneralExperience2 = returnData.aGeneralExperience2;
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aVit = returnData.aVit;
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aStr = returnData.aStr;
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aInt = returnData.aInt;
				mUSER[tUserIndex].uAvatarInfo[tCharSlot].aDex = returnData.aDex;
				aEquip = returnData.aEquip;
				for(var index01 = 0; index01 < MAX_EQUIP_SLOT_NUM; index01++)
				{
					mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][0] = aEquip.substring(0, 5);
					aEquip = aEquip.substring(5);
					mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][1] = aEquip.substring(0, 3);
					aEquip = aEquip.substring(3);
					mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][2] = aEquip.substring(0, 9);
					aEquip = aEquip.substring(9);
					mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][3] = aEquip.substring(0, 8);
					aEquip = aEquip.substring(8);
					//console.log( sprintf( '%05d %03d %09d %08d', mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][0], mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][1], mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][2], mUSER[tUserIndex].uAvatarInfo[tCharSlot].aEquip[index01][3] ) );			
				}
				return callback( true );
			});
		return;
		case 1 ://delete character 
		break;
		default : return callback( false );
	}
}
var DB_PROCESS_01 = function( callback )
{
	mQuery = 'select * from ??';
	nQuery = [ MY_TB01 ];
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
var DB_PROCESS_02 = function( tUserIndex, tID, tPassword, tIP, callback )
{
	var index01;
	var uSaveMoney;
	var uSaveMoney2;
	var uSaveItem;
	var aName = [];
	
	mQuery = 'select * from ?? where uID = ?';
	nQuery = [ MY_TB02, tID ];
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
		mUSER[tUserIndex].uID = returnData.uID;
		mUSER[tUserIndex].uUserSort = returnData.uUserSort;
		mUSER[tUserIndex].uMousePassword = returnData.uMousePassword;
		console.log("The account and password are correct");
		
		mQuery = 'select count(uID) as uIDNum from ?? where uID = ?';
		nQuery = [ MY_TB04, tID ];
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
				nQuery = [ MY_TB04, { uID: tID, uSaveMoney: uSaveMoney, uSaveMoney2: uSaveMoney2, uSaveItem: uSaveItem, aName01: aName[0], aName02: aName[1], aName03: aName[2] } ];
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
				nQuery = [ MY_TB04, tIP, tID ];
				DB_QUERY( mQuery, nQuery, function ( returnStatus, returnData )
				{
					if ( !returnStatus )
					{
						console.log("DB_PROCESS_02 ERROR");
						return callback ( 5 );
					}	
					mQuery = 'select * from ?? where uID = ?';
					nQuery = [ MY_TB04, tID ];
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
						mUSER[tUserIndex].uAvatarInfo[0].aName = returnData.aName01;
						mUSER[tUserIndex].uAvatarInfo[1].aName = returnData.aName02;
						mUSER[tUserIndex].uAvatarInfo[2].aName = returnData.aName03;
						//for (index01 = 0; index01 < MAX_SAVE_ITEM_SLOT_NUM; index01++)
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
var DB_PROCESS_03 = function( tID, tMousePassword, callback )
{
	mQuery = 'update ?? set uMousePassword = ? where uID = ?';
	nQuery = [ MY_TB02, tMousePassword, tID ];
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
var DB_PROCESS_04 = function( tUserIndex, tAvatarPost, tAvatarInfo, callback )
{
	var aEquip = '';
	for(var index01 = 0; index01 < MAX_EQUIP_SLOT_NUM; index01++)
	{
		aEquip += sprintf('%05d%03d%09d%08d', tAvatarInfo.aEquip[index01][0], tAvatarInfo.aEquip[index01][1], tAvatarInfo.aEquip[index01][2], tAvatarInfo.aEquip[index01][3] );
	}
	console.log(aEquip);
	mQuery = 'insert into ?? set ?';
	nQuery = [ MY_TB03, {
	aInsertTime: 'now()',
	uID: mUSER[tUserIndex].uID,
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
	aDex: tAvatarInfo.aDex,
	aEquip: aEquip,
	aLogoutInfo01: tAvatarInfo.aLogoutInfo[0],
	aLogoutInfo02: tAvatarInfo.aLogoutInfo[1],
	aLogoutInfo03: tAvatarInfo.aLogoutInfo[2],
	aLogoutInfo04: tAvatarInfo.aLogoutInfo[3],
	aLogoutInfo05: tAvatarInfo.aLogoutInfo[4],
	aLogoutInfo06: tAvatarInfo.aLogoutInfo[5]
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
		nQuery = [ MY_TB04, tAvatarInfo.aName, mUSER[tUserIndex].uID ];
		DB_QUERY( mQuery, nQuery, function ( returnStatus )
		{
			if ( !returnStatus )
			{
				mQuery = 'delete ?? where aName = ?';
				nQuery = [ MY_TB03, tAvatarInfo.aName ];
				DB_QUERY( mQuery, nQuery );//delete character in avatarinfo if cant update name in masterinfo
				console.log("DB_PROCESS_04 ERROR");
				return callback( 1 );
			}
			return callback( 0 );
		});
	});
}
var DB_PROCESS_05 = function( tUserIndex, tAvatarPost, callback )
{
	mQuery = 'delete from ?? where aName = ?';
	nQuery = [ MY_TB03, mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aName ];
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
		nQuery = [ MY_TB04, '', mUSER[tUserIndex].uID ];
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
module.exports = global;