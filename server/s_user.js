var struct = require('../struct');
var config = require('../config');
this.INIT = function( callback )
{
	this.mUSER = [];
	for(var index01 = 0; index01 < config.MAX_USER_FOR_LOGIN; index01++)
	{
		this.mUSER[index01] = {
			'uID' : index01,
			'uIP' : '',
			'uCheckConnectState' : false,
			'uCheckValidState' : false,
			'uUserSort' : 0,
			'uMousePassword' : '',
			'uSecondLoginSort' : 0,
			'uSecondLoginTryNum' : 0,
			'uUsedTime' : 0,
			'uAvatar' : {
				'0' : [struct.AVATAR_INFO],
				'1' : [struct.AVATAR_INFO],
				'2' : [struct.AVATAR_INFO]
			},
		};
		Buffer(this.mUSER[index01].uAvatar[0]).fill(0);
		Buffer(this.mUSER[index01].uAvatar[1]).fill(0);
		Buffer(this.mUSER[index01].uAvatar[2]).fill(0);
	}
	return callback(true);
}
this.GetConnectPlayer = function()
{
	var index01;
	for( index01 = 0; index01 < config.MAX_USER_FOR_LOGIN; index01++ )
	{
		if(this.mUSER[index01].uCheckConnectState === false)
		{
			break;
		}
	}
	if(index01 >= config.MAX_USER_FOR_LOGIN)
	{
		return config.MAX_USER_FOR_LOGIN;
	}
	this.mUSER[index01].uCheckConnectState = true;
	this.mUSER[index01].uCheckValidState = false;
	return index01;
}
this.Send = function(socket, tUserIndex, tCheckValidBuffer, tBuffer, tBufferSize)
{
	if( !this.mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	if(typeof(tCheckValidBuffer) === "boolean" && tCheckValidBuffer === true)
	{
		socket.write( tBuffer );
	}
}
this.Quit = function( tUserIndex )
{
	if( !this.mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	this.mUSER[tUserIndex].uCheckConnectState = false;
	this.mUSER[tUserIndex].uCheckValidState = false;
	console.log('close connection from tID:%d, uID:%s, uIP:%s', tUserIndex, this.mUSER[tUserIndex].uID, this.mUSER[tUserIndex].uIP);
	this.mUSER[tUserIndex].uID = '';
}
module.exports = this;
