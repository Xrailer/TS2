var struct = require('../struct');
var config = require('../config');
this.INIT = function( callback )
{
	this.mOriginal = new Buffer.alloc(10000).fill( 0 );
	this.mOriginalSize = 0;
	return callback( true );
}
this.B_CONNECT_OK = function( tRandomNumber, tMaxPlayerNum, tGagePlayerNum, tPresentPlayerNum )
{
	this.mOriginalSize = 17;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8(0);
	this.mOriginal.writeInt32LE( tRandomNumber, 1 );
	this.mOriginal.writeInt32LE( tMaxPlayerNum, 5 );
	this.mOriginal.writeInt32LE( tGagePlayerNum, 9 );
	this.mOriginal.writeInt32LE( tPresentPlayerNum, 13 );
	//console.log(this.mOriginal);
}
this.B_LOGIN_RECV = function( tResult, tID, tUserSort, tSecondLoginSort, tMousePassword )
{
	this.mOriginalSize = config.S_LOGIN_RECV;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_LOGIN_RECV );
	this.mOriginal.writeInt32LE( tResult, 1 );
	this.mOriginal.write( tID.toString(), 5 );
	this.mOriginal.writeInt32LE( tUserSort, ( 5 + config.MAX_USER_ID_LENGTH ) );
	this.mOriginal.writeInt32LE( tSecondLoginSort, ( 5 + config.MAX_USER_ID_LENGTH + 16 ) );
	this.mOriginal.write( tMousePassword.toString(), ( 5 + config.MAX_USER_ID_LENGTH + 20 ) );
	//console.log(this.mOriginal);
}
this.B_USER_AVATAR_INFO = function( tAvatarInfo )
{
	this.mOriginalSize = config.S_USER_AVATAR_INFO;
	this.mOriginal = new Buffer.alloc( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_USER_AVATAR_INFO );
	this.mOriginal.write( struct.pack( tAvatarInfo ).toString(), 1 );
	//console.log(this.mOriginal);
}
this.B_CREATE_MOUSE_PASSWORD_RECV = function( tResult, tMousePassword )
{
	this.mOriginalSize = config.S_CREATE_MOUSE_PASSWORD_RECV;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_CREATE_MOUSE_PASSWORD_RECV );
	this.mOriginal.writeInt32LE( tResult, 1 );
	this.mOriginal.write( tMousePassword.toString(), 5 );
	//console.log(this.mOriginal);	
}
this.B_LOGIN_MOUSE_PASSWORD_RECV = function( tResult )
{
	this.mOriginalSize = config.S_LOGIN_MOUSE_PASSWORD_RECV;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_LOGIN_MOUSE_PASSWORD_RECV );
	this.mOriginal.writeInt32LE( tResult, 1 );
	//console.log(this.mOriginal);	
}
this.B_CREATE_AVATAR_RECV = function( tResult, tAvatarInfo )
{
	this.mOriginalSize = config.S_CREATE_AVATAR_RECV;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_CREATE_AVATAR_RECV );
	this.mOriginal.writeInt32LE( tResult, 1 );
	this.mOriginal.write( struct.pack( tAvatarInfo ).toString(), 5 );
	//console.log(this.mOriginal);	
}
this.B_DELETE_AVATAR_RECV = function( tResult )
{
	this.mOriginalSize = config.S_DELETE_AVATAR_RECV;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_CREATE_AVATAR_RECV );
	this.mOriginal.writeInt32LE( tResult, 1 );
	//console.log(this.mOriginal);
}
this.B_RCMD_WORLD_SEND = function()
{
	this.mOriginalSize = config.S_RECOMMAND_WORLD_SEND;
	this.mOriginal = new Buffer( this.mOriginalSize ).fill( 0 );
	this.mOriginal.writeInt8( config.P_RECOMMAND_WORLD_SEND );
	//console.log(this.mOriginal);
}
module.exports = this;
