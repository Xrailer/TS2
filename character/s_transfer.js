global.mTRANSFER = {};
global.TransferInit = function( callback )
{
	mTRANSFER.mOriginal 						= Buffer.alloc(10000).fill( 0 );
	mTRANSFER.mOriginalSize 					= 0;
	//FOR ALL
	mTRANSFER.B_CONNECT_OK 						= B_CONNECT_OK;
	//FOR LOGIN
	mTRANSFER.B_LOGIN_FOR_CHARACTER_RECV		= B_LOGIN_FOR_CHARACTER_RECV;
	mTRANSFER.B_REGISTER_USER_FOR_LOGIN_RECV	= B_REGISTER_USER_FOR_LOGIN_RECV;
	mTRANSFER.B_UNREGISTER_USER_FOR_LOGIN_RECV	= B_UNREGISTER_USER_FOR_LOGIN_RECV;
	//FOR ZONE
	return callback( true );
}
var B_CONNECT_OK = function()
{
	mTRANSFER.mOriginalSize = 1;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8(0);
	//console.log(mTRANSFER.mOriginal);
}
var B_LOGIN_FOR_CHARACTER_RECV = function()
{	
	mTRANSFER.mOriginalSize = S_LOGIN_FOR_CHARACTER_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_LOGIN_FOR_CHARACTER_RECV );
	//console.log(mTRANSFER.mOriginal);
}
var B_REGISTER_USER_FOR_LOGIN_RECV = function( tResult, tPlayUserIndex )
{
	mTRANSFER.mOriginalSize = S_REGISTER_USER_FOR_LOGIN_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_REGISTER_USER_FOR_LOGIN_RECV );
	mTRANSFER.mOriginal.writeInt32LE( tResult, 1 );
	mTRANSFER.mOriginal.writeInt32LE( tPlayUserIndex, 5 );
	//console.log(mTRANSFER.mOriginal);
}
var B_UNREGISTER_USER_FOR_LOGIN_RECV = function()
{
	mTRANSFER.mOriginalSize = S_UNREGISTER_USER_FOR_LOGIN_RECV;
	mTRANSFER.mOriginal = new Buffer( mTRANSFER.mOriginalSize ).fill( 0 );
	mTRANSFER.mOriginal.writeInt8( P_UNREGISTER_USER_FOR_LOGIN_RECV );
	//console.log(mTRANSFER.mOriginal);	
}
module.exports = global;
