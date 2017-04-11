var MAX_RECV_BUFFER_SIZE = 10000;
var MAX_SEND_BUFFER_SIZE = 10000;
global.mUSER = [];
global.UserInit = function( callback )
{
	var index01;
	var index02;
	var index03;
	for( index01 = 0; index01 < MAX_USER_FOR_LOGIN; index01++ )
	{
		mUSER[index01] 									= {};
		mUSER[index01].uID 								= undefined;
		mUSER[index01].uIP 								= undefined;
		mUSER[index01].uPlayID							= 0;
		mUSER[index01].uMousePassword 					= undefined;
		mUSER[index01].uUsedTime 						= undefined;
		mUSER[index01].uSocket 							= undefined;
		mUSER[index01].uCheckConnectState				= false;
		mUSER[index01].uCheckValidState					= false;
		mUSER[index01].uUserSort 						= 0;
		mUSER[index01].uSecondLoginSort 				= 0;
		mUSER[index01].uSecondLoginTryNum 				= 0;
		mUSER[index01].uMoveZoneResult					= 0;
		mUSER[index01].uTotalRecvSize					= 0;
		mUSER[index01].uTotalSendSize					= 0;
		mUSER[index01].uBUFFER_FOR_RECV 				= Buffer.alloc( MAX_RECV_BUFFER_SIZE ).fill( 0 );
		mUSER[index01].uBUFFER_FOR_SEND 				= Buffer.alloc( MAX_SEND_BUFFER_SIZE ).fill( 0 );
		mUSER[index01].uAvatarInfo 						= [];
		mUSER[index01].uAvatarInfo[0] 					= Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
		mUSER[index01].uAvatarInfo[1] 					= Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
		mUSER[index01].uAvatarInfo[2] 					= Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
		mUSER[index01].uSaveItem 						= [];
		for( index02 = 0; index02 < MAX_SAVE_ITEM_SLOT_NUM; index02++ )
		{
			mUSER[index01].uSaveItem[index02] = [];
			for( index03 = 0; index03 < 4; index03++ )
			{
				mUSER[index01].uSaveItem[index02][index03] = 0;
			}
		}
		mUSER[index01].Send = Send;
		mUSER[index01].Quit = Quit;
	}
	return callback( true );
}
var Send = function( tUserIndex, tCheckValidBuffer, tBuffer, tBufferSize )
{
	if( !mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	if( typeof( tCheckValidBuffer ) != 'boolean' )
	{
		Quit( tUserIndex );
		return;
	}
	if( tCheckValidBuffer )
	{
		if( ( MAX_SEND_BUFFER_SIZE - mUSER[tUserIndex].uTotalSendSize ) < tBufferSize )
		{
			Quit( tUserIndex );
			return;
		}
		tBuffer.copy( mUSER[tUserIndex].uBUFFER_FOR_SEND, mUSER[tUserIndex].uTotalSendSize, 0, tBufferSize );
		mUSER[tUserIndex].uTotalSendSize += tBufferSize;
	}
	while( mUSER[tUserIndex].uTotalSendSize > 0 )
	{
		var send = mUSER[tUserIndex].uBUFFER_FOR_SEND.slice( 0, mUSER[tUserIndex].uTotalSendSize );
		if ( send.length <= 0 )
		{
			Quit( tUserIndex );	
			return;
		}
		mUSER[tUserIndex].uSocket.write( send );
		mUSER[tUserIndex].uBUFFER_FOR_SEND.copy( mUSER[tUserIndex].uBUFFER_FOR_SEND, 0, 0, send.length );
		mUSER[tUserIndex].uTotalSendSize -= send.length;
	}
}
var Quit = function( tUserIndex )
{
	if( !mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	if( ( mUSER[tUserIndex].uCheckValidState ) && ( mUSER[tUserIndex].uMoveZoneResult == 0 ) )
	{
		//save
		mCHAR_CONNECT.U_UNREGISTER_USER_FOR_LOGIN_SEND( mUSER[tUserIndex].uPlayID, mUSER[tUserIndex].uID );
	}
	console.log('close connection from tUI:%d, uID:%s, uIP:%s', tUserIndex, mUSER[tUserIndex].uID, mUSER[tUserIndex].uIP);	
	mUSER[tUserIndex].uCheckConnectState = false;
	mUSER[tUserIndex].uCheckValidState = false;
	mUSER[tUserIndex].uID = undefined;
	mUSER[tUserIndex].uIP = undefined;
	mUSER[tUserIndex].uBUFFER_FOR_SEND.fill( 0 );
	mUSER[tUserIndex].uBUFFER_FOR_RECV.fill( 0 );
	mUSER[tUserIndex].uTotalSendSize = 0;
	mUSER[tUserIndex].uTotalRecvSize = 0;
	mUSER[tUserIndex].uSocket.destroy();
}
module.exports = global;