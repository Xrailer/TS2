global.mCHAR_CONNECT = {};
var mCHAR_CONNECT_CON = new Net.Socket();
var uCheckConnectState = false;
var mSendDataSize = 0;
var mRecvDataSize = 0;
var MAX_SEND_DATA_SIZE = 100000;
var MAX_RECV_DATA_SIZE = 100000;
var mSendData = new Buffer( MAX_SEND_DATA_SIZE ).fill( 0 );
var mRecvData = new Buffer( MAX_RECV_DATA_SIZE ).fill( 0 );
var mRecv_Result = -1;
var mRecv_PlayID = -1;
global.CharServerInit = function( tIP, tPort, callback )
{
	mCHAR_CONNECT.U_REGISTER_USER_FOR_LOGIN_1_SEND = U_REGISTER_USER_FOR_LOGIN_1_SEND;
	mCHAR_CONNECT.U_REGISTER_USER_FOR_LOGIN_3_SEND = U_REGISTER_USER_FOR_LOGIN_3_SEND;
	mCHAR_CONNECT.U_UNREGISTER_USER_FOR_LOGIN_SEND = U_UNREGISTER_USER_FOR_LOGIN_SEND;
	mCHAR_CONNECT_CON.connect( tPort, tIP );
	mCHAR_CONNECT_CON.on('connect', Connect );
	mCHAR_CONNECT_CON.on('error', () => {
		console.log('Error::character server not online');
		process.exit( 1 );
	});
	mCHAR_CONNECT_CON.on('end', () => {
		console.log('disconnected from server');
		process.exit( 1 );
	});
	return callback( true );
}
var Connect = function()
{
	mCHAR_CONNECT_CON.on('data', function(data) {
		if ( uCheckConnectState || parseInt(data[0]) > 11 ) return;
		console.log('Recv 3',uCheckDataState, data);
		data.copy( mRecvData, 0, 0, data.length );
		if( parseInt(mRecvData[0]) == 0 && data.length == 1)
		{
			mSendData = new Buffer( 1 ).fill( 0 );
			mSendData.writeInt8( P_LOGIN_FOR_CHARACTER_SEND );
			mCHAR_CONNECT_CON.write ( mSendData );
		}
		else if ( parseInt(mRecvData[0]) > 11 )
			uCheckConnectState = true;
	});
}
var Recv = function()
{
	mCHAR_CONNECT_CON.on('data', function(data) {
		console.log('Recv 33',uCheckDataState, data);
		data.copy( mRecvData, 0, 0, data.length );
	});
}
var Send = function()
{
	//console.log( mSendDataSize );
	//console.log( mSendData );
	while ( mSendDataSize > 0 )
	{
		mCHAR_CONNECT_CON.write( mSendData );	
		mSendDataSize -= mSendData.length;
	}
	return true;
}
var ProcessForNetwork = function()
{
	if ( !Send() )
	{
		return false;
	}
	return true;
}
var U_LOGIN_OK_FOR_CHAR_SEND = function()
{
}
var U_REGISTER_USER_FOR_LOGIN_1_SEND = function( tUserIndex, uIP, uID, uUserSort, uTraceState, callback )
{
	mRecvDataSize = S_REGISTER_USER_FOR_LOGIN_RECV;
	mRecvData = new Buffer( mRecvDataSize ).fill( 0 );
	mSendDataSize = S_REGISTER_USER_FOR_LOGIN_1_SEND;
	mSendData = new Buffer( mSendDataSize ).fill( 0 );
	mSendData.writeInt8( P_REGISTER_USER_FOR_LOGIN_1_SEND );
	mSendData.write( uIP.toString(), 1, 16 );
	mSendData.write( uID.toString(), 1 + 16, MAX_USER_ID_LENGTH );
	mSendData.writeInt32LE( uUserSort, 1 + 16 + MAX_USER_ID_LENGTH );
	mSendData.writeInt32LE( uTraceState, 1 + 16 + 4 + MAX_USER_ID_LENGTH );	
	uCheckDataState = false;
	while ( true )
	{
		if ( ProcessForNetwork() )
			break;
	}	
	mCHAR_CONNECT_CON.on('data', function(data) {
		console.log('Recv 33',uCheckDataState, data);
		data.copy( mRecvData, 0, 0, data.length );
		console.log('Recv 04', mRecvData[0]);	
		console.log('Recv 4', mRecvData.readInt32LE(1, 4));	
		return callback(mRecvData.readInt32LE(1, 4), mRecvData.readInt32LE(5, 4));
	});
}
var U_REGISTER_USER_FOR_LOGIN_3_SEND = function( tUserIndex, tAvatarPost, tPlayID, uID, tAvatarInfo )
{
	mRecvDataSize = S_REGISTER_USER_FOR_LOGIN_RECV;
	mSendDataSize = S_REGISTER_USER_FOR_LOGIN_3_SEND;
	mSendData = new Buffer( mSendDataSize ).fill( 0 );
	mSendData.writeInt8( P_REGISTER_USER_FOR_LOGIN_3_SEND );
	mSendData.writeInt32LE( tPlayID, 1 );
	mSendData.write( uID.toString(), 5, MAX_USER_ID_LENGTH );
	var mCopy = new Buffer( pckAvatar( 1, tAvatarInfo ) ).copy( mSendData,  ( 5 + MAX_USER_ID_LENGTH ), 0, SIZE_OF_AVATAR_INFO );
	while ( true )
	{
		if ( ProcessForNetwork() )
			break;
	}
	mCHAR_CONNECT_CON.on('data', function(data)
	{
		mRecvData = new Buffer( data.length ).fill( 0 );
		data.copy ( mRecvData, 0, 0, mRecvDataSize );
		mRecv_Result = mRecvData.readInt32LE(1, 4);
		mRecv_PlayID = mRecvData.readInt32LE(5, 4);
		//return callback( mRecv_Result, mRecv_PlayID );
		if( mRecv_Result > 0)
		{
			return;
		}
		mUSER[tUserIndex].uMoveZoneResult = 1;
		mTRANSFER.B_DEMAND_ZONE_SERVER_INFO_1_RECV( 0, ZONE_IP, ZONE_PO, mUSER[tUserIndex].uAvatarInfo[tAvatarPost].aLogoutInfo[0] );
		mUSER[tUserIndex].Send( tUserIndex, true, mTRANSFER.mOriginal, mTRANSFER.mOriginalSize );
	});
}
var U_UNREGISTER_USER_FOR_LOGIN_SEND = function( tPlayID, tID)
{
	mRecvDataSize = S_UNREGISTER_USER_FOR_LOGIN_RECV;
	mSendDataSize = S_UNREGISTER_USER_FOR_LOGIN_SEND;
	mSendData = new Buffer( mSendDataSize ).fill( 0 );
	mSendData.writeInt8( P_UNREGISTER_USER_FOR_LOGIN_SEND );
	mSendData.writeInt32LE( tPlayID, 1 );
	mSendData.write( tID.toString(), 5, MAX_USER_ID_LENGTH );
	while ( true )
	{
		if ( ProcessForNetwork() )
			break;
	}
}
module.exports = global;