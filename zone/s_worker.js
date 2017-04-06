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
	mWORK[P_TEMP_REGISTER_SEND].PROC = W_TEMP_REGISTER_SEND;
	mWORK[P_TEMP_REGISTER_SEND].SIZE = S_TEMP_REGISTER_SEND;
	mWORK[P_REGISTER_AVATAR_SEND].PROC = W_REGISTER_AVATAR_SEND;
	mWORK[P_REGISTER_AVATAR_SEND].SIZE = S_REGISTER_AVATAR_SEND;
	return callback(true);
}
var W_TEMP_REGISTER_SEND = function( tUserIndex )
{
	if ( mUSER[tUserIndex].uCheckTempRegister )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	
	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	var tTribe = new Buffer( 4 ).fill( 0 );
	var index01;
	
	var tPacket = ( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tID, 0, 0, tID.length );
	tPacket.copy( tTribe, 0, tID.length, tTribe.length );
	tTribe = tTribe.readInt32LE();
	
	mUSER[tUserIndex].uCheckTempRegister = true;
	mUSER[tUserIndex].uID = tID.toString();
	mTRANSFER.B_TEMP_REGISTER_RECV(0);
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
}
var W_REGISTER_AVATAR_SEND = function( tUserIndex )
{
	if ( ( !mUSER[tUserIndex].uCheckTempRegister ) || ( mUSER[tUserIndex].uCheckValidState ) )
	{
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}

	var index01;
	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	var tAvatarName = new Buffer( MAX_AVATAR_NAME_LENGTH ).fill( 0 );
	var tAction = new Buffer( SIZE_OF_ACTION_INFO ).fill( 0 );
	
	var tPacket = new Buffer( mUSER[tUserIndex].uBUFFER_FOR_RECV );
	tPacket.copy( tPacket, 0 , 9, tPacket.length );
	tPacket.copy( tID, 0, 0, tID.length );
	tPacket.copy( tAvatarName, 0, tID.length, tAvatarName.length );
	tPacket.copy( tAction, 0, ( tID.length + tAvatarName.length ), tAction.length );
		
	tAction = pckAction( 0, tAction );
	console.log('tID', tID.toString());
	console.log('aType',tAction.aType);
	console.log('aSort',tAction.aSort);

	if ( ( tID.toString() != mUSER[tUserIndex].uID ) || ( tAction.aType != 0 ) || ( ( tAction.aSort != 0 ) && ( tAction.aSort != 1 ) ) )
	{
		consolg.log('0');
		mUSER[tUserIndex].Quit( tUserIndex );
		return;
	}
	
	mUSER[tUserIndex].uCheckValidState = true;

	//register avatar info
	mUSER[tUserIndex].uAvatarInfo.aName = 'test';
	mUSER[tUserIndex].uAvatarInfo.aVisibleState = 1;
	mUSER[tUserIndex].uAvatarInfo.aSpecialState = 1;
	mUSER[tUserIndex].uAvatarInfo.aKillOtherTribe = 0;
	mUSER[tUserIndex].uAvatarInfo.aTribe = 0;
	mUSER[tUserIndex].uAvatarInfo.aPreviousTribe = 0;
	mUSER[tUserIndex].uAvatarInfo.aGender = 0;
	mUSER[tUserIndex].uAvatarInfo.aHeadType = 0;
	mUSER[tUserIndex].uAvatarInfo.aFaceType = 0;
	mUSER[tUserIndex].uAvatarInfo.aLevel1 = 145;
	mUSER[tUserIndex].uAvatarInfo.aLevel2 = 0;
	mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[0] = 1;
	mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[1] = 6;
	mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[2] = 0;
	mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[3] = -7;
	mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[4] = 1;
	mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[5] = 1;
	
	mTRANSFER.B_REGISTER_AVATAR_RECV( mUSER[tUserIndex].uAvatarInfo );
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	//
	
	//register avatar action
	mAVATAR_OBJECT[tUserIndex].uCheckValidState = true;
	mGAME.mAvatarObjectUniqueNumber++;
	mAVATAR_OBJECT[tUserIndex].mUniqueNumber = mGAME.mAvatarObjectUniqueNumber;
	mAVATAR_OBJECT[tUserIndex].mDATA.aVisibleState = mUSER[tUserIndex].uAvatarInfo.aVisibleState;
	mAVATAR_OBJECT[tUserIndex].mDATA.aSpecialState = mUSER[tUserIndex].uAvatarInfo.aSpecialStat
	mAVATAR_OBJECT[tUserIndex].mDATA.aKillOtherTribe = mUSER[tUserIndex].uAvatarInfo.aKillOtherTribe;
	mAVATAR_OBJECT[tUserIndex].mDATA.aTribe = mUSER[tUserIndex].uAvatarInfo.aTribe;
	mAVATAR_OBJECT[tUserIndex].mDATA.aPreviousTribe = mUSER[tUserIndex].uAvatarInfo.aPreviousTribe;
	mAVATAR_OBJECT[tUserIndex].mDATA.aGender = mUSER[tUserIndex].uAvatarInfo.aGender;
	mAVATAR_OBJECT[tUserIndex].mDATA.aHeadType = mUSER[tUserIndex].uAvatarInfo.aHeadType;
	mAVATAR_OBJECT[tUserIndex].mDATA.aFaceType = mUSER[tUserIndex].uAvatarInfo.aFaceType;
	mAVATAR_OBJECT[tUserIndex].mDATA.aLevel1 = mUSER[tUserIndex].uAvatarInfo.aLevel1;
	mAVATAR_OBJECT[tUserIndex].mDATA.aLevel2 = mUSER[tUserIndex].uAvatarInfo.aLevel2;
	
	mAVATAR_OBJECT[tUserIndex].mDATA.aAction = tAction;
	mAVATAR_OBJECT[tUserIndex].mDATA.aLifeValue = mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[4];
	mAVATAR_OBJECT[tUserIndex].mDATA.aManaValue = mUSER[tUserIndex].uAvatarInfo.aLogoutInfo[5];
	
	
	for (index01 = 0; index01 < 2; index01++)
	{
		mTRANSFER.B_AVATAR_ACTION_RECV( tUserIndex, mAVATAR_OBJECT[tUserIndex].mUniqueNumber, mAVATAR_OBJECT[tUserIndex].mDATA, ( index01 + 1 ) );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	}
	//
}
module.exports = global;