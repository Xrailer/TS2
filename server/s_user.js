var struct = require('../struct');
var config = require('../config');
var socket = require('net');
var MAX_RECV_BUFFER_SIZE = 10000;
var MAX_SEND_BUFFER_SIZE = 10000;
this.INIT = function( callback )
{
	this.mUSER = [];
	var index01;
	for( index01 = 0; index01 < config.MAX_USER_FOR_LOGIN; index01++ )
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
			'uMoveZoneResult' : 0,
			'uBUFFER_FOR_RECV' : 0,
			'uTotalRecvSize' : 0,
			'uTotalSendSize' : 0,
			'uSocket' : 0,
			'uAvatar' : {
				'0' : [struct.AVATAR_INFO],
				'1' : [struct.AVATAR_INFO],
				'2' : [struct.AVATAR_INFO]
			},
		};
		
		this.mUSER[index01].uBUFFER_FOR_RECV = Buffer.alloc( MAX_RECV_BUFFER_SIZE );
		this.mUSER[index01].uBUFFER_FOR_SEND = Buffer.alloc( MAX_SEND_BUFFER_SIZE );
		this.mUSER[index01].uAvatar[0] = Buffer.alloc( config.SIZE_OF_AVATAR_INFO );
		this.mUSER[index01].uAvatar[1] = Buffer.alloc( config.SIZE_OF_AVATAR_INFO );
		this.mUSER[index01].uAvatar[2] = Buffer.alloc( config.SIZE_OF_AVATAR_INFO );
				
		this.mUSER[index01].uBUFFER_FOR_RECV.fill( 0 );
		this.mUSER[index01].uBUFFER_FOR_SEND.fill( 0 );
		this.mUSER[index01].uAvatar[0].fill( 0 );
		this.mUSER[index01].uAvatar[1].fill( 0 );
		this.mUSER[index01].uAvatar[2].fill( 0 );
	}
	return callback(true);
}
this.Send = function( tUserIndex, tCheckValidBuffer, tBuffer, tBufferSize )
{
	if( !this.mUSER[tUserIndex].uCheckConnectState )
	{
		return;
	}
	if( typeof( tCheckValidBuffer ) !== "boolean" )
	{
		Quit( tUserIndex );
		return;
	}
	if( tCheckValidBuffer )
	{
		if( ( MAX_SEND_BUFFER_SIZE - this.mUSER[tUserIndex].uTotalSendSize ) < tBufferSize )
		{
			Quit( tUserIndex );
			return;
		}
		tBuffer.copy( this.mUSER[tUserIndex].uBUFFER_FOR_SEND, this.mUSER[tUserIndex].uTotalSendSize, 0, tBufferSize);
		this.mUSER[tUserIndex].uTotalSendSize += tBufferSize;
	}
	while( this.mUSER[tUserIndex].uTotalSendSize > 0 )
	{
		this.mUSER[tUserIndex].uSocket.write( this.mUSER[tUserIndex].uBUFFER_FOR_SEND.slice( 0, this.mUSER[tUserIndex].uTotalSendSize ) );
		this.mUSER[tUserIndex].uBUFFER_FOR_SEND.copy( this.mUSER[tUserIndex].uBUFFER_FOR_SEND, 0, 0, this.mUSER[tUserIndex].uTotalSendSize);
		this.mUSER[tUserIndex].uTotalSendSize -= tBufferSize;
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
	this.mUSER[tUserIndex].uBUFFER_FOR_RECV.fill( 0 );
	this.mUSER[tUserIndex].uBUFFER_FOR_SEND.fill( 0 );
	this.mUSER[tUserIndex].uTotalRecvSize = 0;
	this.mUSER[tUserIndex].uTotalSendSize = 0;
	this.mUSER[tUserIndex].uAvatar[0].fill( 0 );
	this.mUSER[tUserIndex].uAvatar[1].fill( 0 );
	this.mUSER[tUserIndex].uAvatar[2].fill( 0 );
	if( ( this.mUSER[tUserIndex].uCheckValidState ) && ( this.mUSER[tUserIndex].uMoveZoneResult == 0 ) )
	{
		//save
	}
	console.log('close connection from tID:%d, uID:%s, uIP:%s', tUserIndex, this.mUSER[tUserIndex].uID, this.mUSER[tUserIndex].uIP);
	this.mUSER[tUserIndex].uID = '';
	this.mUSER[tUserIndex].uSocket.destroy();
	delete (this.mUSER[tUserIndex].uSocket);
}
module.exports = this;