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
		mUSER[index01] = {
			'uID' : '',
			'uIP' : '',
			'uCheckConnectState' : false,
			'uCheckValidState' : false,
			'uUserSort' : 0,
			'uMousePassword' : '',
			'uSecondLoginSort' : 0,
			'uSecondLoginTryNum' : 0,
			'uUsedTime' : 0,
			'uMoveZoneResult' : 0,
			'uBUFFER_FOR_RECV' : 0,
			'uTotalRecvSize' : 0,
			'uTotalSendSize' : 0,
			'uSocket' : 0,
			'uAvatarInfo' : [],
			'uSaveItem' : [] 
		};
		mUSER[index01].uBUFFER_FOR_RECV = Buffer.alloc( MAX_RECV_BUFFER_SIZE ).fill( 0 );
		mUSER[index01].uBUFFER_FOR_SEND = Buffer.alloc( MAX_SEND_BUFFER_SIZE ).fill( 0 );
		mUSER[index01].uAvatarInfo[0] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
		mUSER[index01].uAvatarInfo[1] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
		mUSER[index01].uAvatarInfo[2] = Buffer.alloc( SIZE_OF_AVATAR_INFO ).fill( 0 );
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
		mUSER[tUserIndex].uSocket.write( mUSER[tUserIndex].uBUFFER_FOR_SEND.slice( 0, mUSER[tUserIndex].uTotalSendSize ) );
		mUSER[tUserIndex].uBUFFER_FOR_SEND.copy( mUSER[tUserIndex].uBUFFER_FOR_SEND, 0, 0, mUSER[tUserIndex].uTotalSendSize );
		mUSER[tUserIndex].uTotalSendSize -= tBufferSize;
	}
}
var Quit = function( tUserIndex )
{
	if( !mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	mUSER[tUserIndex].uCheckConnectState = false;
	mUSER[tUserIndex].uCheckValidState = false;
	mUSER[tUserIndex].uTotalRecvSize = 0;
	mUSER[tUserIndex].uTotalSendSize = 0;
	mUSER[tUserIndex].uBUFFER_FOR_RECV.fill( 0 );
	mUSER[tUserIndex].uBUFFER_FOR_SEND.fill( 0 );

	if( ( mUSER[tUserIndex].uCheckValidState ) && ( mUSER[tUserIndex].uMoveZoneResult == 0 ) )
	{
		//save
	}
	console.log('close connection from tUI:%d, uID:%s, uIP:%s', tUserIndex, mUSER[tUserIndex].uID, mUSER[tUserIndex].uIP);
	mUSER[tUserIndex].uID = '';
	mUSER[tUserIndex].uSocket.destroy();
}
module.exports = global;