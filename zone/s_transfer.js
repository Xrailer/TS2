global.mTRANSFER = {};
global.TransferInit = function( callback )
{
	mTRANSFER.mOriginal 						=	Buffer.alloc(10000).fill( 0 );
	mTRANSFER.mOriginalSize 					=	0;
	mTRANSFER.B_CONNECT_OK 						=	B_CONNECT_OK;
	mTRANSFER.B_TEMP_REGISTER_RECV 				=	B_TEMP_REGISTER_RECV;
	mTRANSFER.B_REGISTER_AVATAR_RECV			=	B_REGISTER_AVATAR_RECV;
	mTRANSFER.B_AVATAR_ACTION_RECV				=	B_AVATAR_ACTION_RECV;
	return callback( true );
}
var B_CONNECT_OK = function( tRandomNumber )
{
	mTRANSFER.mOriginalSize = 5;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( tRandomNumber );
	//console.log(mTRANSFER.mOriginal);
}
var B_TEMP_REGISTER_RECV = function( tResult )
{
	mTRANSFER.mOriginalSize = S_TEMP_REGISTER_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_TEMP_REGISTER_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	//console.log(mTRANSFER.mOriginal);
}
var B_REGISTER_AVATAR_RECV = function( tAvatarInfo )
{
	mTRANSFER.mOriginalSize = S_REGISTER_AVATAR_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_REGISTER_AVATAR_RECV );
	var mCopy = new Buffer( pckAvatar( 1, tAvatarInfo ) ).copy( mTRANSFER.mOriginal, 1 , 0, SIZE_OF_AVATAR_INFO );
	//skill effect 29*8 = int effect[29][2]
	//console.log(mTRANSFER.mOriginal);
}
var B_AVATAR_ACTION_RECV = function( tUserIndex, mUniqueNumber, mDATA, tCheckChangeActionState )
{	
	mTRANSFER.mOriginalSize = S_AVATAR_ACTION_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_AVATAR_ACTION_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tUserIndex, 1 );
	mTRANSFER.mOriginal.writeInt32LE( mUniqueNumber, 5 );
	var mCopy = new Buffer( pckObjectAvatar( 1, mDATA ) ).copy( mTRANSFER.mOriginal, 9 , 0, SIZE_OF_OBJECT_FOR_AVATAR );
	mTRANSFER.mOriginal.writeInt32LE( tCheckChangeActionState, ( 9 + SIZE_OF_OBJECT_FOR_AVATAR ) );
}
module.exports = global;
