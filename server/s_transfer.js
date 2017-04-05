global.mTRANSFER = [];
global.TransferInit = function( callback )
{
	mTRANSFER.mOriginal 					= Buffer.alloc(10000).fill( 0 );
	mTRANSFER.mOriginalSize 				= 0;
	mTRANSFER.B_CONNECT_OK 					= B_CONNECT_OK;
	mTRANSFER.B_LOGIN_RECV 					= B_LOGIN_RECV;
	mTRANSFER.B_USER_AVATAR_INFO 			= B_USER_AVATAR_INFO;
	mTRANSFER.B_CREATE_MOUSE_PASSWORD_RECV 	= B_CREATE_MOUSE_PASSWORD_RECV;
	mTRANSFER.B_LOGIN_MOUSE_PASSWORD_RECV 	= B_LOGIN_MOUSE_PASSWORD_RECV;
	mTRANSFER.B_CREATE_AVATAR_RECV 			= B_CREATE_AVATAR_RECV;
	mTRANSFER.B_DELETE_AVATAR_RECV 			= B_DELETE_AVATAR_RECV;
	mTRANSFER.B_RCMD_WORLD_SEND 			= B_RCMD_WORLD_SEND;
	return callback( true );
}
var B_CONNECT_OK = function( tRandomNumber, tMaxPlayerNum, tGagePlayerNum, tPresentPlayerNum )
{
	mTRANSFER.mOriginalSize = 17;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8(0);
	mTRANSFER.mOriginal.writeInt32LE( tRandomNumber, 1 );
	mTRANSFER.mOriginal.writeInt32LE( tMaxPlayerNum, 5 );
	mTRANSFER.mOriginal.writeInt32LE( tGagePlayerNum, 9 );
	mTRANSFER.mOriginal.writeInt32LE( tPresentPlayerNum, 13 );
	//console.log(mTRANSFER.mOriginal);
}
var B_LOGIN_RECV = function( tResult, tID, tUserSort, tSecondLoginSort, tMousePassword )
{
	mTRANSFER.mOriginalSize = S_LOGIN_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_LOGIN_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	mTRANSFER.mOriginal.write( tID.toString(), 5 );
	mTRANSFER.mOriginal.writeInt32LE( tUserSort, ( 5 + MAX_USER_ID_LENGTH ) );
	mTRANSFER.mOriginal.writeInt32LE( tSecondLoginSort, ( 5 + MAX_USER_ID_LENGTH + 16 ) );
	mTRANSFER.mOriginal.write( tMousePassword.toString(), ( 5 + MAX_USER_ID_LENGTH + 20 ) );
	//console.log(mTRANSFER.mOriginal);
}
var B_USER_AVATAR_INFO = function( tAvatarInfo )
{
	mTRANSFER.mOriginalSize = S_USER_AVATAR_INFO;
	mTRANSFER.mOriginal = new Buffer.alloc( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_USER_AVATAR_INFO );
	mTRANSFER.mOriginal.write( pAvatar( 1, tAvatarInfo ).toString(), 1 );
	//console.log(mTRANSFER.mOriginal);
}
var B_CREATE_MOUSE_PASSWORD_RECV = function( tResult, tMousePassword )
{
	mTRANSFER.mOriginalSize = S_CREATE_MOUSE_PASSWORD_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_CREATE_MOUSE_PASSWORD_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	mTRANSFER.mOriginal.write( tMousePassword.toString(), 5 );
	//console.log(mTRANSFER.mOriginal);	
}
var B_LOGIN_MOUSE_PASSWORD_RECV = function( tResult )
{
	mTRANSFER.mOriginalSize = S_LOGIN_MOUSE_PASSWORD_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_LOGIN_MOUSE_PASSWORD_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	//console.log(mTRANSFER.mOriginal);	
}
var B_CREATE_AVATAR_RECV = function( tResult, tAvatarInfo )
{
	mTRANSFER.mOriginalSize = S_CREATE_AVATAR_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_CREATE_AVATAR_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	mTRANSFER.mOriginal.write( pAvatar( 1, tAvatarInfo ).toString(), 5 );
	//console.log(mTRANSFER.mOriginal);	
}
var B_DELETE_AVATAR_RECV = function( tResult )
{
	mTRANSFER.mOriginalSize = S_DELETE_AVATAR_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_CREATE_AVATAR_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	//console.log(mTRANSFER.mOriginal);
}
var B_RCMD_WORLD_SEND = function()
{
	mTRANSFER.mOriginalSize = S_RECOMMAND_WORLD_SEND;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_RECOMMAND_WORLD_SEND );
	//console.log(mTRANSFER.mOriginal);
}
module.exports = global;
