var struct = require('../struct');
var config = require('../config');
this.INIT = function( callback )
{
	this.packet = new Buffer(10000);
	this.packets = 0;
	return callback(true);
}
this.B_CONNECT_OK = function( tRandomNumber, tMaxPlayerNum, tGagePlayerNum, tPresentPlayerNum )
{
	this.packets = 17;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0, this.packets);
	this.packet.writeInt8(0);
	this.packet.writeInt32LE( tRandomNumber, 1 );
	this.packet.writeInt32LE( tMaxPlayerNum, 5 );
	this.packet.writeInt32LE( tGagePlayerNum, 9 );
	this.packet.writeInt32LE( tPresentPlayerNum, 13 );
	//console.log(this.packet);
	return this.packet;
}
this.B_LOGIN_RECV = function( tResult, tID, tUserSort, tSecondLoginSort, tMousePassword )
{
	this.packets = config.S_LOGIN_RECV;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0);
	this.packet.writeInt8( config.P_LOGIN_RECV );
	this.packet.writeInt32LE( tResult, 1 );
	this.packet.write( tID.toString(), 5 );
	this.packet.writeInt32LE( tUserSort, ( 5 + config.MAX_USER_ID_LENGTH ) );
	this.packet.writeInt32LE( tSecondLoginSort, ( 5 + config.MAX_USER_ID_LENGTH + 16 ) );
	this.packet.write( tMousePassword.toString(), ( 5 + config.MAX_USER_ID_LENGTH + 20 ) );
	//console.log(this.packet);
	return this.packet;
}
this.B_USER_AVATAR_INFO = function()
{
	this.packets = config.S_USER_AVATAR_INFO;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0);
	this.packet.writeInt8( config.P_USER_AVATAR_INFO );
	//console.log(this.packet);
	return this.packet;
}
this.B_CREATE_MOUSE_PASSWORD_RECV = function( tResult, tMousePassword )
{
	this.packets = config.S_CREATE_MOUSE_PASSWORD_RECV;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0);
	this.packet.writeInt8( config.P_CREATE_MOUSE_PASSWORD_RECV );
	this.packet.writeInt32LE( tResult, 1 );
	this.packet.write( tMousePassword.toString(), 5 );
	//console.log(this.packet);
	return this.packet;	
}
this.B_LOGIN_MOUSE_PASSWORD_RECV = function( tResult )
{
	this.packets = config.S_LOGIN_MOUSE_PASSWORD_RECV;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0);
	this.packet.writeInt8( config.P_LOGIN_MOUSE_PASSWORD_RECV );
	this.packet.writeInt32LE( tResult, 1 );
	//console.log(this.packet);
	return this.packet;	
}
var struct = require('../struct');
this.B_CREATE_AVATAR_RECV = function( tResult, tAvatarInfo )
{
	this.packets = config.S_CREATE_AVATAR_RECV;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0);
	this.packet.writeInt8( config.P_CREATE_AVATAR_RECV );
	this.packet.writeInt32LE( tResult, 1 );
	this.packet.write( tAvatarInfo.toString() , 5);
	//console.log(this.packet);
	return this.packet;	
}
this.B_RCMD_WORLD_SEND = function()
{
	this.packets = config.S_RECOMMAND_WORLD_SEND;
	this.packet = new Buffer(this.packets);
	this.packet.fill(0);
	this.packet.writeInt8( config.P_RECOMMAND_WORLD_SEND );
	//console.log(this.packet);
	return this.packet;
}
module.exports = this;
