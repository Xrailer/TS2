var mysql = require('mysql');
var connection;
var mQuery;
var nQuery;
global.mDB = {};
global.MysqlInit = function( host, port, user, pass, database, callback )
{
	if( (host == undefined) || (port == undefined) || (user == undefined) || (pass == undefined) || (database == undefined) )
	{
		return false;
	}
	connection = mysql.createConnection({
		host     : host,
		port     : port,
		user     : user,
		password : pass,
		database : database
	});
	/*var pool  = mysql.createPool({
	  connectionLimit : 10,
	   host     : MY_HOST,
	  user     : MY_USER,
	  password : MY_PASS,
	  database : MY_DB
	});*/
	connection.connect( function(err)
	{
		if (err)
		{
			console.error('error connecting: ' + err.code);
			return callback( false );
		}
	});
	mDB.DB_PROCESS_01 = DB_PROCESS_01;
	mDB.DB_PROCESS_02 = DB_PROCESS_02;
	/*mDB.DB_PROCESS_03 = DB_PROCESS_03;
	mDB.DB_PROCESS_04 = DB_PROCESS_04;
	mDB.DB_PROCESS_05 = DB_PROCESS_05;*/
	return callback( true );
}
var DB_QUERY = function ( mQuery1, mQuery2, callback )
{
	//callback = returnStatus , returnData
	connection.query( mQuery1, mQuery2, function( err, result )
	{
		if (err)
		{
			console.log("Query ERROR 1 : ", mQuery1);
			console.log("Query ERROR 2 : ", mQuery2);
			return callback( false );
		}
		callback( true, result[0] );
	});
}
var DB_PROCESS_01 = function( tID, tIP, callback )
{
	mQuery = 'update ?? set uLoginState = 1, uIP = ? where uID = ?';
	nQuery = [ MY_TB04, tIP, tID ];
	DB_QUERY( mQuery, nQuery, function ( returnStatus )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_01 ERROR");
			return callback( false );
		}
		return callback( true );
	});
}
var DB_PROCESS_02 = function( tID )
{
	mQuery = 'update ?? set uLoginState = 0 where uID = ?';
	nQuery = [ MY_TB04, tID ];
	DB_QUERY( mQuery, nQuery, function ( returnStatus )
	{
		if ( !returnStatus )
		{
			console.log("DB_PROCESS_02 ERROR");
			return false;
		}
		return true;
	});
}
module.exports = global;