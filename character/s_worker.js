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
	
	//---------------//
	//FOR LOGIN -> CHARACTER//
	//---------------//
	mWORK[P_LOGIN_FOR_CHARACTER_SEND].PROC 					= W_LOGIN_FOR_CHARACTER_SEND;
	mWORK[P_LOGIN_FOR_CHARACTER_SEND].SIZE 					= S_LOGIN_FOR_CHARACTER_SEND;
	mWORK[P_LOGIN_OK_FOR_CHARACTER_SEND].PROC 				= W_LOGIN_OK_FOR_CHARACTER_SEND;
	mWORK[P_LOGIN_OK_FOR_CHARACTER_SEND].SIZE 				= S_LOGIN_OK_FOR_CHARACTER_SEND;
	mWORK[P_REGISTER_USER_FOR_LOGIN_1_SEND].PROC 			= W_REGISTER_USER_FOR_LOGIN_1_SEND;
	mWORK[P_REGISTER_USER_FOR_LOGIN_1_SEND].SIZE 			= S_REGISTER_USER_FOR_LOGIN_1_SEND;
	mWORK[P_REGISTER_USER_FOR_LOGIN_2_SEND].PROC 			= W_REGISTER_USER_FOR_LOGIN_2_SEND;
	mWORK[P_REGISTER_USER_FOR_LOGIN_2_SEND].SIZE 			= S_REGISTER_USER_FOR_LOGIN_2_SEND;
	mWORK[P_REGISTER_USER_FOR_LOGIN_3_SEND].PROC 			= W_REGISTER_USER_FOR_LOGIN_3_SEND;
	mWORK[P_REGISTER_USER_FOR_LOGIN_3_SEND].SIZE 			= S_REGISTER_USER_FOR_LOGIN_3_SEND;
	mWORK[P_UNREGISTER_USER_FOR_LOGIN_SEND].PROC 			= W_UNREGISTER_USER_FOR_LOGIN_SEND;
	mWORK[P_UNREGISTER_USER_FOR_LOGIN_SEND].SIZE 			= S_UNREGISTER_USER_FOR_LOGIN_SEND;
	/*mWORK[P_GET_PRESENT_USER_NUM_FOR_LOGIN_SEND].PROC 		= W_GET_PRESENT_USER_NUM_FOR_LOGIN_SEND;
	mWORK[P_GET_PRESENT_USER_NUM_FOR_LOGIN_SEND].SIZE 		= S_GET_PRESENT_USER_NUM_FOR_LOGIN_SEND;
	mWORK[P_BLOCK_USER_FOR_LOGIN_1_SEND].PROC 				= W_BLOCK_USER_FOR_LOGIN_1_SEND;
	mWORK[P_BLOCK_USER_FOR_LOGIN_1_SEND].SIZE 				= S_BLOCK_USER_FOR_LOGIN_1_SEND;
	mWORK[P_BLOCK_USER_FOR_LOGIN_2_SEND].PROC 				= W_BLOCK_USER_FOR_LOGIN_2_SEND;
	mWORK[P_BLOCK_USER_FOR_LOGIN_2_SEND].SIZE 				= S_BLOCK_USER_FOR_LOGIN_2_SEND;*/
	
	return callback(true);
}
var W_LOGIN_FOR_CHARACTER_SEND = function( tUserIndex )
{
	var tPacket = mUSER[tUserIndex].uBUFFER_FOR_RECV;
	if( mUSER[tUserIndex].uCheckServerType != 0 )
	{
		mUSER[tUserIndex].Quit( tUserIndex, 3001 );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();

	var index01;
	for( index01 = 0 ; index01 < MAX_USER_FOR_CHARACTER ; index01++ )
	{
		if( mUSER[index01].uCheckServerType == 1 )
		{
			mUSER[index01].Quit( tUserIndex, 3002 );
		}
	}
	mUSER[tUserIndex].uCheckServerType = 1;
	mTRANSFER.B_LOGIN_FOR_CHARACTER_RECV();
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
}
var W_LOGIN_OK_FOR_CHARACTER_SEND = function( tUserIndex )
{
	if( mUSER[tUserIndex].uCheckServerType != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex, 3003 );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
}
var W_REGISTER_USER_FOR_LOGIN_1_SEND = function( tUserIndex )
{
	var tPacket = mUSER[tUserIndex].uBUFFER_FOR_RECV;
	if( mUSER[tUserIndex].uCheckServerType != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex, 3004 );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
	
	var tIP = new Buffer( 16 ).fill( 0 );
	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	tPacket.copy( tPacket, 0 , 1, tPacket.length );
	tPacket.copy( tIP, 0, 0, tIP.length );
	tPacket.copy( tID, 0, tIP.length, tID.length );
	var tUserSort = tPacket.readInt32LE( 117, 4 );
	var tTraceState = tPacket.readInt32LE( 121, 4 );

	//console.log(mGAME.BufToStr(tIP));
	//console.log(mGAME.BufToStr(tID));
	//console.log(tUserSort);
	//console.log(tTraceState);
	mGAME.RegisterUserForLogin_01( mGAME.BufToStr(tIP), mGAME.BufToStr(tID), tUserSort, tTraceState, function( tResult, tPlayID )
	{
		mTRANSFER.B_REGISTER_USER_FOR_LOGIN_RECV( tResult, tPlayID );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	});
}
var W_REGISTER_USER_FOR_LOGIN_2_SEND = function( tUserIndex )
{
	var tPacket = mUSER[tUserIndex].uBUFFER_FOR_RECV;
	if( mUSER[tUserIndex].uCheckServerType != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex, 3005 );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();

	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	tPacket.copy( tPacket, 0 , 1, tPacket.length );
	tPacket.copy( tID, 0, 4, tID.length );
	var tPlayID = tPacket.readInt32LE( 0, 4 );

	var tResult = mGAME.RegisterUserForLogin_02( tPlayID, tID );
	console.log(tResult);
	mTRANSFER.B_REGISTER_USER_FOR_LOGIN_RECV( tResult, tPlayID );
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
}
var W_REGISTER_USER_FOR_LOGIN_3_SEND = function( tUserIndex )
{
	var tPacket = mUSER[tUserIndex].uBUFFER_FOR_RECV;
	if( mUSER[tUserIndex].uCheckServerType != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex, 3006 );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();

	var AVATAR_INFO = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
	//mGAME.SafeAvatarInfoData( &tAvatarInfo );
	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	tPacket.copy( tPacket, 0 , 1, tPacket.length );
	tPacket.copy( tID, 0, 4, tID.length );
	tPacket.copy( AVATAR_INFO, 0, ( 4 + tID.length ), SIZE_OF_AVATAR_INFO );
	var tPlayID = tPacket.readInt32LE( 0, 4 );
	console.log(pckAvatar( 0, AVATAR_INFO ).aName)
	var tResult = mGAME.RegisterUserForLogin_03( tPlayID, mGAME.BufToStr(tID), pckAvatar( 0, AVATAR_INFO ) );
	//console.log(tResult);
	mTRANSFER.B_REGISTER_USER_FOR_LOGIN_RECV( tResult, tPlayID );
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
}
var W_UNREGISTER_USER_FOR_LOGIN_SEND = function( tUserIndex )
{
	var tPacket = mUSER[tUserIndex].uBUFFER_FOR_RECV;
	if( mUSER[tUserIndex].uCheckServerType != 1 )
	{
		mUSER[tUserIndex].Quit( tUserIndex, 3007 );
		return;
	}
	mUSER[tUserIndex].uUsedTime = mGAME.GetTickCount();
	
	var tID = new Buffer( MAX_USER_ID_LENGTH ).fill( 0 );
	tPacket.copy( tPacket, 0 , 1, tPacket.length );
	tPacket.copy( tID, 0, 4, tID.length );
	var tPlayID = tPacket.readInt32LE( 0, 4 );

	mGAME.UnRegisterUserForLogin( tPlayID, mGAME.BufToStr(tID) );
	mTRANSFER.B_UNREGISTER_USER_FOR_LOGIN_RECV();
	mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
}
module.exports = global;