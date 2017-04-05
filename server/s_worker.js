global.mWORK = [];
global.WorkInit = function( callback )
{
	for( var index01 = 0 ; index01 < WORKER_SIZE ; index01++ )
	{
		mWORK[index01] = {
			'PROC' : undefined,
			'SIZE' : 0
		}
	}	
	mWORK[P_LOGIN_SEND].PROC = W_LOGIN_SEND;
	mWORK[P_LOGIN_SEND].SIZE = S_LOGIN_SEND;
	mWORK[P_CLIENT_OK_FOR_LOGIN_SEND].PROC = W_CLIENT_OK_FOR_LOGIN_SEND;
	mWORK[P_CLIENT_OK_FOR_LOGIN_SEND].SIZE = S_CLIENT_OK_FOR_LOGIN_SEND;
	mWORK[P_CREATE_MOUSE_PASSWORD_SEND].PROC = W_CREATE_MOUSE_PASSWORD_SEND;
	mWORK[P_CREATE_MOUSE_PASSWORD_SEND].SIZE = S_CREATE_MOUSE_PASSWORD_SEND;
	mWORK[P_CHANGE_MOUSE_PASSWORD_SEND].PROC = W_CHANGE_MOUSE_PASSWORD_SEND;
	mWORK[P_CHANGE_MOUSE_PASSWORD_SEND].SIZE = S_CHANGE_MOUSE_PASSWORD_SEND;
	mWORK[P_LOGIN_MOUSE_PASSWORD_SEND].PROC = W_LOGIN_MOUSE_PASSWORD_SEND;
	mWORK[P_LOGIN_MOUSE_PASSWORD_SEND].SIZE = S_LOGIN_MOUSE_PASSWORD_SEND;
	mWORK[P_CREATE_AVATAR_SEND].PROC = W_CREATE_AVATAR_SEND;
	mWORK[P_CREATE_AVATAR_SEND].SIZE = S_CREATE_AVATAR_SEND;
	mWORK[P_DELETE_AVATAR_SEND].PROC = W_DELETE_AVATAR_SEND;
	mWORK[P_DELETE_AVATAR_SEND].SIZE = S_DELETE_AVATAR_SEND;
	/*WORKER_FUNCTION[P_CHANGE_AVATAR_NAME_SEND] = 'W_CHANGE_AVATAR_NAME_SEND';
	WORKER_PACKETSIZE[P_CHANGE_AVATAR_NAME_SEND] = S_CHANGE_AVATAR_NAME_SEND;
	WORKER_FUNCTION[P_DEMAND_GIFT_SEND] = 'W_DEMAND_GIFT_SEND';
	WORKER_PACKETSIZE[P_DEMAND_GIFT_SEND] = S_DEMAND_GIFT_SEND;
	WORKER_FUNCTION[P_WANT_GIFT_SEND] = 'W_WANT_GIFT_SEND';
	WORKER_PACKETSIZE[P_WANT_GIFT_SEND] = S_WANT_GIFT_SEND;
	WORKER_FUNCTION[P_DEMAND_ZONE_SERVER_INFO_1] = 'W_DEMAND_ZONE_SERVER_INFO_1';
	WORKER_PACKETSIZE[P_DEMAND_ZONE_SERVER_INFO_1] = S_DEMAND_ZONE_SERVER_INFO_1;
	WORKER_FUNCTION[P_FAIL_MOVE_ZONE_1_SEND] = 'W_FAIL_MOVE_ZONE_1_SEND';
	WORKER_PACKETSIZE[P_FAIL_MOVE_ZONE_1_SEND] = S_FAIL_MOVE_ZONE_1_SEND;*/
	return callback(true);
}
var W_LOGIN_SEND = function( tUserIndex )
{
	if( mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();

	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	var tPassword = new Buffer(MAX_USER_PASSWORD_LENGTH).fill( 0 );
	var tVersion = new Buffer( 4 ).fill( 0 );
	var tMousePassword = new Buffer(MAX_MOUSE_PASSWORD_LENGTH).fill( 0 );
	var index01;
	
	var tPacket = ( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy(tID, 0, 0, tID.length );
	tPacket.copy(tPassword, 0, tID.length, ( tID.length + tPassword.length ) );
	tPacket.copy(tVersion, 0, ( tID.length + tPassword.length ), ( tID.length + tPassword.length + tVersion.length ) );
	tVersion = tVersion.readInt32LE();	
	//console.log(tID);
	//console.log(tPassword);
	//console.log(tVersion);
	if( tVersion != VERSION )
	{
		mTRANSFER.B_LOGIN_RECV(4, tID, 0, 0, "0000");
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		for( index01 = 0 ; index01 < MAX_USER_AVATAR_NUM ; index01++ )
		{
			mTRANSFER.B_USER_AVATAR_INFO( mUSER[tUserIndex].uAvatarInfo[index01] );	
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		}
		mTRANSFER.B_RCMD_WORLD_SEND();
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	}
	if( ( !mGAME.CheckNameString(tID) ) || ( !mGAME.CheckNameString(tPassword) ) )
	{
		mTRANSFER.B_LOGIN_RECV( 6, tID, 0, 0, "0000" );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		for( index01 = 0 ; index01 < MAX_USER_AVATAR_NUM ; index01++ )
		{
			mTRANSFER.B_USER_AVATAR_INFO( mUSER[tUserIndex].uAvatarInfo[index01] );	
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		}
		mTRANSFER.B_RCMD_WORLD_SEND();
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	}
	mDB.DB_PROCESS_02( tUserIndex, mGAME.BufToStr(tID), mGAME.BufToStr(tPassword), mUSER[tUserIndex].uIP, function( tResult )
	{
		if(tResult != 0)
		{
			mTRANSFER.B_LOGIN_RECV( tResult, tID, 0, 0, "0000" );
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
			for( index01 = 0 ; index01 < MAX_USER_AVATAR_NUM ; index01++ )
			{
				mTRANSFER.B_USER_AVATAR_INFO( mUSER[tUserIndex].uAvatarInfo[index01]  );
				mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
			}
			mTRANSFER.B_RCMD_WORLD_SEND();
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
			return;
		}
		mUSER[tUserIndex].uCheckValidState = true;
		//mUSER[tUserIndex].uID = uID;
		//mUSER[tUserIndex].uUserSort = uUserSort;
		//mUSER[tUserIndex].uMousePassword = uMousePassword;
		mUSER[tUserIndex].uSecondLoginSort = 1;
		mUSER[tUserIndex].uSecondLoginTryNum = 0;
		mUSER[tUserIndex].uMoveZoneResult = 0;
		if (mUSER[tUserIndex].uMousePassword != '')
		{
			tMousePassword = '****';
		}
		
		//coneolse.log("success to login");
		mTRANSFER.B_LOGIN_RECV( 0, mUSER[tUserIndex].uID, mUSER[tUserIndex].uUserSort, mUSER[tUserIndex].uSecondLoginSort, tMousePassword );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		for( index01 = 0 ; index01 < MAX_USER_AVATAR_NUM ; index01++ )
		{
			mTRANSFER.B_USER_AVATAR_INFO( mUSER[tUserIndex].uAvatarInfo[index01] );
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		}
		mTRANSFER.B_RCMD_WORLD_SEND();
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	});
}
var W_CLIENT_OK_FOR_LOGIN_SEND = function( tUserIndex )
{
	if( !mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
}
var W_CREATE_MOUSE_PASSWORD_SEND = function( tUserIndex )
{
	if( !mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uSecondLoginSort != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uMousePassword != '' )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
	
	var tMousePassword = new Buffer( MAX_MOUSE_PASSWORD_LENGTH ).fill( 0 );
	var tPacket = Buffer( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tMousePassword, 0, 0, (MAX_MOUSE_PASSWORD_LENGTH - 1) );

	for (var index01 = 0; index01 < 4; index01++)
	{
		if ( ( parseInt( tMousePassword[index01] ) < 48 ) && ( parseInt( tMousePassword[index01] ) > 57 ) ) //0-9
		{
			mUSER[tUserIndex].Quit( tUserIndex );
			return;
		}
	}
	
	mDB.DB_PROCESS_03( mGAME.BufToStr(uID[tUserIndex]), mGAME.BufToStr(tMousePassword), function( tResult )
	{
		if( !tResult )
		{
			mTRANSFER.B_CREATE_MOUSE_PASSWORD_RECV( 1, "0000" );
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
			return;
		}
		mUSER[tUserIndex].uMousePassword = tMousePassword;
		mUSER[tUserIndex].uSecondLoginSort = 0;
		mTRANSFER.B_CREATE_MOUSE_PASSWORD_RECV( 0, mUSER[tUserIndex].uMousePassword );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	});
}
var W_CHANGE_MOUSE_PASSWORD_SEND = function( tUserIndex )
{
	if( !mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
}
var W_LOGIN_MOUSE_PASSWORD_SEND = function ( tUserIndex )
{
	if( !mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}	
	if ( mUSER[tUserIndex].uSecondLoginSort != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uMousePassword == '' )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
	
	var tMousePassword = new Buffer( MAX_MOUSE_PASSWORD_LENGTH ).fill( 0 );
	var tPacket = Buffer( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tMousePassword, 0, 0, ( MAX_MOUSE_PASSWORD_LENGTH - 1 ) );
	
	for ( var index01 = 0; index01 < 4; index01++ )
	{
		if ( ( parseInt( tMousePassword[index01] ) < 48 ) && ( parseInt( tMousePassword[index01] ) > 57 ) ) //0-9
		{	
			mUSER[tUserIndex].Quit( tUserIndex );
			return;
		}
	}
	
	if ( mUSER[tUserIndex].uMousePassword != mGAME.BufToStr( tMousePassword ) )
	{
		console.log( "mismatch 2nd password : wrong : %s, real : %s",  mUSER[tUserIndex].uMousePassword, mGAME.BufToStr( tMousePassword ) );
		mTRANSFER.B_LOGIN_MOUSE_PASSWORD_RECV( 1 );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		mUSER[tUserIndex].uSecondLoginTryNum++;
		if ( mUSER[tUserIndex].uSecondLoginTryNum == 3 )
		{
			//console.log("wrong 3 times");
			mUSER[tUserIndex].Quit( tUserIndex );
			return;
		}
		return;
	}
	//console.log("success to login 2nd password");
	mUSER[tUserIndex].uSecondLoginSort = 0;
	mTRANSFER.B_LOGIN_MOUSE_PASSWORD_RECV( 0 );
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
}
var W_CREATE_AVATAR_SEND = function( tUserIndex )
{
	if ( !mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uSecondLoginSort != 0 )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uMoveZoneResult == 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].mUsedTime = mGAME.GetTickCount();
	
	var tAvatarPost = new Buffer( 4 ).fill( 0 );
	var AVATAR_INFO = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
	var tPacket = Buffer( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tAvatarPost, 0, 0, 4 );
	tPacket.copy( AVATAR_INFO, 0, 4, SIZE_OF_AVATAR_INFO );

	var tAvatarInfo = pAvatar( 0, AVATAR_INFO );		
	tAvatarPost = tAvatarPost.readInt32LE();
	console.log("tAvatarPost",tAvatarPost);

	if( ( tAvatarPost < 0 ) || ( tAvatarPost > 2 ) || ( mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aName != '' )
		|| ( tAvatarInfo.aName == '' ) 
		|| ( tAvatarInfo.aTribe < 0 ) || ( tAvatarInfo.aTribe > 2 ) 
		|| ( tAvatarInfo.aPreviousTribe < 0 ) || ( tAvatarInfo.aPreviousTribe > 2 )
		|| ( tAvatarInfo.aGender < 0 ) || ( tAvatarInfo.aGender > 1 )
		|| ( tAvatarInfo.aHeadType < 0 ) || ( tAvatarInfo.aHeadType > 6 )
		|| ( tAvatarInfo.aFaceType < 0 ) || ( tAvatarInfo.aFaceType > 2 )
		)
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	var aName = AVATAR_INFO.toString('utf8', (5*4), 12);//mGAME.CheckNameString can't use tAvatarInfo.aName
	if ( !mGAME.CheckNameString( aName ) )
	{
		mTRANSFER.B_CREATE_AVATAR_RECV( 4, tAvatarInfo );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
		return;
	}
	console.log("aName", tAvatarInfo.aName);
	console.log("aTribe", tAvatarInfo.aTribe);
	console.log("aPreviousTribe", tAvatarInfo.aPreviousTribe);
	console.log("aGender", tAvatarInfo.aGender);
	console.log("aHeadType", tAvatarInfo.aFaceType);
	console.log("aFaceType", tAvatarInfo.aFaceType);
	
	tAvatarInfo.aVisibleState = 1;
	tAvatarInfo.aSpecialState = 0;
	tAvatarInfo.aPlayTime1 = 0;
	tAvatarInfo.aPlayTime2 = 0;
	tAvatarInfo.aPlayTime3 = 0;
	tAvatarInfo.aKillOtherTribe = 0;
	tAvatarInfo.aPreviousTribe = tAvatarInfo.aTribe;
	tAvatarInfo.aLevel1 = 1;
	tAvatarInfo.aLevel2 = 0;
	tAvatarInfo.aGeneralExperience1 = 0;
	tAvatarInfo.aGeneralExperience2 = 0;
	tAvatarInfo.aVit = 1;
	tAvatarInfo.aStr = 1;
	tAvatarInfo.aInt = 1;
	tAvatarInfo.aDex = 1;
	switch (tAvatarInfo.aTribe)
	{
	case 0:
		tAvatarInfo.aLogoutInfo[0] = 1;
		tAvatarInfo.aLogoutInfo[1] = 6;// 5;
		tAvatarInfo.aLogoutInfo[2] = 0;
		tAvatarInfo.aLogoutInfo[3] = -7;// 4;
		tAvatarInfo.aLogoutInfo[4] = 30;
		tAvatarInfo.aLogoutInfo[5] = 21;
		break;
	case 1:
		tAvatarInfo.aLogoutInfo[0] = 6;
		tAvatarInfo.aLogoutInfo[1] = -190;
		tAvatarInfo.aLogoutInfo[2] = 0;
		tAvatarInfo.aLogoutInfo[3] = 1270;
		tAvatarInfo.aLogoutInfo[4] = 30;
		tAvatarInfo.aLogoutInfo[5] = 21;
		break;
	case 2:
		tAvatarInfo.aLogoutInfo[0] = 11;
		tAvatarInfo.aLogoutInfo[1] = 447;
		tAvatarInfo.aLogoutInfo[2] = 1;
		tAvatarInfo.aLogoutInfo[3] = 440;
		tAvatarInfo.aLogoutInfo[4] = 30;
		tAvatarInfo.aLogoutInfo[5] = 21;
		break;
	}
	mDB.DB_PROCESS_04( tUserIndex, tAvatarPost, tAvatarInfo, function( tResult )
	{
		if (tResult != 0)
		{
			mTRANSFER.B_CREATE_AVATAR_RECV( tResult, tAvatarInfo );
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize);
			return;
		}
		//success to create character
		mUSER[tUserIndex].uAvatarInfo[tAvatarPost] = tAvatarInfo;
		mTRANSFER.B_CREATE_AVATAR_RECV( 0, tAvatarInfo );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );		
	});
}
var W_DELETE_AVATAR_SEND = function( tUserIndex )
{
	if ( !mUSER[tUserIndex].uCheckValidState )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uSecondLoginSort != 0 )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	if ( mUSER[tUserIndex].uMoveZoneResult == 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mUSER[tUserIndex].mUsedTime = mGAME.GetTickCount();
	
	var tAvatarPost = new Buffer( 4 ).fill( 0 );
	var tPacket = Buffer( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tAvatarPost, 0, 0, 4 );
		
	tAvatarPost = tAvatarPost.readInt32LE();
	console.log("tAvatarPost",tAvatarPost);

	if( ( tAvatarPost < 0 ) || ( tAvatarPost > 2 ) || ( mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aName == '' ) )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	mDB.DB_PROCESS_05( tUserIndex, tAvatarPost, function( tResult )
	{
		if (tResult != 0)
		{
			mTRANSFER.B_DELETE_AVATAR_RECV( tResult );
			mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize);
			return;
		}
		//success to delete character
		mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aName = '';
		mTRANSFER.B_DELETE_AVATAR_RECV( 0 );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );		
	});
}
module.exports = global;