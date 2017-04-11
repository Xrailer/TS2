global.mGAME = {};
global.GameInit = function( callback )
{
	mGAME.mID = [];
	mGAME.mIP = [];
	mGAME.mRegisterSort = [];
	mGAME.mCheckValidState = [];
	mGAME.mSaveTime = [];
	mGAME.mPostTime = [];
	mGAME.mPlayTime = [];
	mGAME.mFirstEnterZone = [];
	mGAME.mZoneNumber = [];
	mGAME.mAvatarInfo = [];
	mGAME.mUserSort = [];
	mGAME.mTraceState = [];
	mGAME.mEffectValue = [];	
	var index01;
	var index02;
	for( index01 = 0 ; index01 < MAX_PLAY_FOR_CHARACTER ; index01++ )
	{
		mGAME.mID[index01] = undefined;
		mGAME.mIP[index01] = undefined;
		mGAME.mRegisterSort[index01] = 0;
		mGAME.mCheckValidState[index01] = false;
		mGAME.mSaveTime[index01] = 0;
		mGAME.mPostTime[index01] = 0;
		mGAME.mPlayTime[index01] = 0;
		mGAME.mFirstEnterZone[index01] = false;
		mGAME.mZoneNumber[index01] = 0;
		mGAME.mAvatarInfo[index01] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
		mGAME.mUserSort[index01] = 0;
		mGAME.mTraceState[index01] = 0;
		mGAME.mEffectValue[index01] = [];
		for( index02 = 0 ; index02 < MAX_AVATAR_EFFECT_SORT_NUM ; index02++ )
		{
			mGAME.mEffectValue[index01][index02] = [];
			mGAME.mEffectValue[index01][index02][0] = 0;
			mGAME.mEffectValue[index01][index02][1] = 0;
		}
	}
	mGAME.mTickCount = 0;
	mGAME.GetTickCount = GetTickCount;
	mGAME.CheckNameString = CheckNameString;
	mGAME.BufToStr = BufToStr;
	mGAME.StrToBuf = StrToBuf;
	mGAME.ReturnTime = ReturnTime;
	mGAME.RegisterUserForLogin_01 = RegisterUserForLogin_01;
	mGAME.RegisterUserForLogin_02 = RegisterUserForLogin_02;
	mGAME.RegisterUserForLogin_03 = RegisterUserForLogin_03;
	mGAME.UnRegisterUserForLogin = UnRegisterUserForLogin;
	mGAME.ProcessForCharSrv = ProcessForCharSrv;
	mGAME.ProcessForSave_1 = ProcessForSave_1;
	mGAME.ProcessForSave_2 = ProcessForSave_2;
	return callback(true);
}
var GetTickCount = function()
{
	return process.hrtime()[0];
}
var CheckNameString = function(string)
{
	for (var i = 0; i < string.length; i++) 
	{
		var tUnicode = parseInt(string[i]);
		if(tUnicode == 0) // zero
		{
			continue;			
		}
		if ( ( tUnicode >= 48 ) && ( tUnicode <= 57 ) ) //0-9
		{
			continue;
		}
		if ( (tUnicode >= 65 ) && ( tUnicode <= 90 ) ) //A-Z
		{
			continue;
		}
		if ( ( tUnicode >= 97 ) && ( tUnicode <= 122 ) ) //a-z
		{
			continue;
		}
		return false;
	}
	return true;
}
var BufToStr = function(buf)
{
	return buf.toString('utf8').replace(/\0/g, '');
}
var StrToBuf = function(str)
{
	return Buffer(str);
}
var ReturnTime = function()
{
	var date = new Date();
	return sprintf( '%04d-%02d-%02d %02d:%02d:%02d', date.getFullYear(), ( date.getMonth() + 1 ), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
}
var ProcessForCharSrv = function()
{
	var tPresentTime = GetTickCount();
	for( var index01 = 0 ; index01 < MAX_PLAY_FOR_CHARACTER ; index01++ )
	{
		if( !mGAME.mCheckValidState[index01] )
		{
			continue;
		}
		if( mGAME.mRegisterSort[index01] == 1 )
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 180 ) //if player not do anything after login, we will keep user in 3mins.
			{
				continue;
			}
		}
		else if( mGAME.mRegisterSort[index01] == 2 )
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 180 ) //after player request to enter zone(failed), we will keep user in 3mins.
			{
				continue;
			}
		}
		else if( mGAME.mRegisterSort[index01] == 3 )
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 180 ) //after player request to enter zone(success), we will keep user in 3mins.
			{
				continue;
			}
		}
		else if( mGAME.mRegisterSort[index01] == 4 )
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 180 )
			{
				continue;
			}
		}
		else if( mGAME.mRegisterSort[index01] == 5 )
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 360 )
			{
				continue;
			}
		}
		else if( mGAME.mRegisterSort[index01] == 6 )
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 360 )
			{
				continue;
			}
		}
		else
		{
			if( ( tPresentTime - mGAME.mPostTime[index01] ) < 360 )
			{
				continue;
			}
		}
		mGAME.mCheckValidState[index01] = false;
		if( mGAME.mZoneNumber[index01] == 0 )
		{
			//mDB.DB_PROCESS_02( &mID[index01][0]);
			//mGAMELOG.GL_103_WAIT_LOGOUT_1( &mID[index01][0] );
			mGAME.mID[index01] = '';
			mGAME.mIP[index01] = '';
			continue;
		}
		//ProcessForSave_1( 1, mGAME.mID[index01], mGAME.mAvatarInfo[index01] );
		//mGAME.mPlayTime[index01] = ( GetTickCount() - mGAME.mPlayTime[index01] ) / 1000;
		//mGAMELOG.GL_107_WAIT_LOGOUT_2( mGAME.mID[index01], mGAME.mAvatarInfo[index01].aName, mGAME.mZoneNumber[index01] );
		mGAME.mID[index01] = '';
		mGAME.mIP[index01] = '';
	}
}
var ProcessForSave_1 = function( tSort, tID, tAvatarInfo )
{
}
var ProcessForSave_2 = function()
{
}
var RegisterUserForLogin_01 = function( tIP, tID, tUserSort, tTraceState, callback )
{
	var index01;
	for( index01 = 0 ; index01 < MAX_PLAY_FOR_CHARACTER ; index01++ )
	{
		if ( mGAME.mID[index01] === tID )
		{
			break;
		}
	}
	/*console.log(mGAME.mID[index01]);
	console.log(tID);
	console.log( index01  );*/
	if( index01 < MAX_PLAY_FOR_CHARACTER )
	{
		return callback( 1, -1 );
	}
	for( index01 = 0 ; index01 < MAX_PLAY_FOR_CHARACTER ; index01++ )
	{
		if( !mGAME.mCheckValidState[index01] )
		{
			break;
		}
	}
	if( index01 == MAX_PLAY_FOR_CHARACTER )
	{
		return callback( 2, -1 );
	}
	mDB.DB_PROCESS_01( tID, tIP, function( callback ) 
	{
		if ( callback == false )
			return callback( 3, -1 );
	});

	mGAME.mCheckValidState[index01] = true;
	mGAME.mRegisterSort[index01] = 1;
	mGAME.mSaveTime[index01] = GetTickCount();
	mGAME.mPostTime[index01] = GetTickCount();
	mGAME.mPlayTime[index01] = GetTickCount();
	mGAME.mZoneNumber[index01] = 0;
	mGAME.mIP[index01] = tIP;
	mGAME.mID[index01] = tID;
	mGAME.mUserSort[index01] = tUserSort;
	mGAME.mTraceState[index01] = tTraceState;
	mGAME.mFirstEnterZone[index01] = true;
	mGAME.mAvatarInfo[index01] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
	mGAME.mAvatarInfo[index01] = pckAvatar( 0, mGAME.mAvatarInfo[index01] );
	//mGAMELOG.GL_101_LOGIN( &mID[index01][0], &mIP[index01][0] );
	return callback( 0, index01 );
}
var RegisterUserForLogin_02 = function( tPlayID, tID )
{
	if( ( tPlayID < 0 ) || ( tPlayID > ( MAX_PLAY_FOR_CHARACTER - 1 ) ) || ( !mGAME.mCheckValidState[tPlayID] ) || ( mGAME.mZoneNumber[tPlayID] != 0 ) || ( mGAME.mID[tPlayID] != tID ) )
	{
		return 1;
	}
	mGAME.mRegisterSort[tPlayID] = 2;
	mGAME.mSaveTime[tPlayID] = GetTickCount();
	mGAME.mPostTime[tPlayID] = GetTickCount();
	return 0;
}
var RegisterUserForLogin_03 = function( tPlayID, tID, tAvatarInfo )
{
	if( ( tPlayID < 0 ) || ( tPlayID > ( MAX_PLAY_FOR_CHARACTER - 1 ) ) || ( !mGAME.mCheckValidState[tPlayID] ) || ( mGAME.mZoneNumber[tPlayID] != 0 ) || ( mGAME.mID[tPlayID] != tID ) )
	{
		return 1;
	}
	mGAME.mRegisterSort[tPlayID] = 3;
	mGAME.mSaveTime[tPlayID] = GetTickCount();
	mGAME.mPostTime[tPlayID] = GetTickCount();
	mGAME.mAvatarInfo[tPlayID] = tAvatarInfo;
	for( var index01 = 0 ; index01 < MAX_AVATAR_EFFECT_SORT_NUM ; index01++ )
	{
		mGAME.mEffectValue[tPlayID][index01][0] = 0;
		mGAME.mEffectValue[tPlayID][index01][1] = 0;
	}
	return 0;
}
var UnRegisterUserForLogin = function( tPlayID, tID )
{
	console.log(tPlayID);
	console.log(mGAME.mCheckValidState[tPlayID]);
	console.log(mGAME.mZoneNumber[tPlayID]);
	console.log(mGAME.mID[tPlayID]);
	console.log(tID);
	
	if( ( tPlayID < 0 ) || ( tPlayID > ( MAX_PLAY_FOR_CHARACTER - 1 ) ) || ( !mGAME.mCheckValidState[tPlayID] ) || ( mGAME.mZoneNumber[tPlayID] != 0 ) || ( mGAME.mID[tPlayID] != tID ) )
	{
		return;
	}
	mDB.DB_PROCESS_02( mGAME.mID[tPlayID] );
	mGAME.mCheckValidState[tPlayID] = false;
	mGAME.mRegisterSort[tPlayID] = 0;
	mGAME.mID[tPlayID] = undefined;
	mGAME.mIP[tPlayID] = undefined;
	//mGAMELOG.GL_102_LOGOUT_1(&mID[tPlayUserIndex][0]);
}
module.exports = global;
