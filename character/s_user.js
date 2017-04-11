var MAX_RECV_BUFFER_SIZE = 10000;
var MAX_SEND_BUFFER_SIZE = 10000;
global.mUSER = [];
global.UserInit = function( callback )
{
	var index01;
	var index02;
	var index03;
	for( index01 = 0; index01 < MAX_USER_FOR_CHARACTER; index01++ )
	{
		mUSER[index01] 									= {};
		mUSER[index01].uIP 								= '';
		mUSER[index01].uUsedTime 						= '';
		mUSER[index01].uSocket 							= '';
		mUSER[index01].uCheckConnectState				= false;
		mUSER[index01].uCheckServerType					= 0;
		mUSER[index01].uZoneServerNumber				= 0;
		mUSER[index01].uTotalRecvSize					= 0;
		mUSER[index01].uTotalSendSize					= 0;
		mUSER[index01].uBUFFER_FOR_RECV 				= Buffer.alloc( MAX_RECV_BUFFER_SIZE ).fill( 0 );
		mUSER[index01].uBUFFER_FOR_SEND 				= Buffer.alloc( MAX_SEND_BUFFER_SIZE ).fill( 0 );
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
	return callback(true);
}
var Send = function( tUserIndex, tCheckValidBuffer, tBuffer, tBufferSize )
{
	console.log(tBuffer);
	if( !mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	if( typeof( tCheckValidBuffer ) != 'boolean' )
	{
		Quit( 2000 );
		return;
	}
	if( tCheckValidBuffer )
	{
		if( ( MAX_SEND_BUFFER_SIZE - mUSER[tUserIndex].uTotalSendSize ) < tBufferSize )
		{
			Quit( 2001 );
			return;
		}
		tBuffer.copy( mUSER[tUserIndex].uBUFFER_FOR_SEND, mUSER[tUserIndex].uTotalSendSize, 0, tBufferSize );
		mUSER[tUserIndex].uTotalSendSize += tBufferSize;
	}
	while( mUSER[tUserIndex].uTotalSendSize > 0 )
	{
		mUSER[tUserIndex].uSocket.write( mUSER[tUserIndex].uBUFFER_FOR_SEND.slice( 0, mUSER[tUserIndex].uTotalSendSize ) );
		mUSER[tUserIndex].uBUFFER_FOR_SEND.copy( mUSER[tUserIndex].uBUFFER_FOR_SEND, 0, 0, mUSER[tUserIndex].uTotalSendSize );
		mUSER[tUserIndex].uTotalSendSize -= tBufferSize;
	}
}
var Quit = function( tUserIndex, tSort )
{
	if( !mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	if( tSort != 0 )
	{
		if( ( mUSER[tUserIndex].uCheckServerType != 3 ) && ( mUSER[tUserIndex].uCheckServerType != 4 ) )
		{
			console.log("[ABNORMAL_FREE-(%d)]::[SERVER_IP](%s),[SERVER_TYPE](%d),[SERVER_NUMBER](%d)", ( tSort == NaN ? tSort : 0 ), mUSER[tUserIndex].uIP, mUSER[tUserIndex].uCheckServerType, mUSER[tUserIndex].uZoneServerNumber );
		}
	}	
	mUSER[tUserIndex].uCheckConnectState = false;
	mUSER[tUserIndex].uCheckServerType = -1;
	mUSER[tUserIndex].uZoneServerNumber = -1;
	mUSER[tUserIndex].uTotalRecvSize = 0;
	mUSER[tUserIndex].uTotalSendSize = 0;
	mUSER[tUserIndex].uBUFFER_FOR_RECV.fill( 0 );
	mUSER[tUserIndex].uBUFFER_FOR_SEND.fill( 0 );
	console.log('close connection from tUI:%d, uIP:%s', tUserIndex, mUSER[tUserIndex].uIP);
	mUSER[tUserIndex].uSocket.destroy();
}
module.exports = global;