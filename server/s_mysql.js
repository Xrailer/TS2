var mysql      = require('mysql');
var config      = require('../config.js');

var connection;
class Mysql
{
	INIT()
	{
		connection = mysql.createConnection({
		host     : config.MY_HOST,
		user     : config.MY_USER,
		password : config.MY_PASS,
				  database : config.MY_DB
		});
		/*var pool  = mysql.createPool({
		  connectionLimit : 10,
		   host     : config.MY_HOST,
		  user     : config.MY_USER,
		  password : config.MY_PASS,
		  database : config.MY_DB
		});*/
		connection.connect(function(err) {
		  if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		  }
		});
		return true;
	}	
	DB_PROCESS_02(tID, callback)
	{
		connection.query('select * from ?? where uID = ?', [config.MY_TB02, tID], function(err, result)
		{
			if (err) 
			   callback(err,null);
			else
			   callback(null,result[0]);
		});
	}
	DB_PROCESS_03(tID, tMousePassword, callback)
	{
		connection.query('update ?? set uMousePassword = ? where uID = ?', [config.MY_TB02, tMousePassword, tID], function(err, result)
		{
			if (err) 
			   callback(err,null);
			else
			   callback(null,0);
		});
	}
}
module.exports = Mysql;