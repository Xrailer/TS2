var struct = require('../struct');
this.INIT = function( callback )
{
	this.maxUser = 2;
	/*this.mCheckConnectState = [];
	this.mCheckValidState = [];
	this.uID = [];
	this.uUserSort = [];
	this.uMousePassword = [];
	this.mSecondLoginSort = [];
	this.mSecondLoginTryNum = [];
	this.uUsedTime = [];
	this.uIP = [];
	this.uAvatar = [];*/
	this.mUSER = [];
	for(var index01 = 0; index01 < this.maxUser; index01++)
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
	for( index01 = 0; index01 < this.maxUser; index01++ )
	{
		if(this.mUSER[index01].uCheckConnectState === false)
		{
			break;
		}
	}
	if(index01 == this.maxUser)
	{
		return this.maxUser;
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
