var server = require('./server/s_server');
server.INIT( function( callback ) 
{
	if(callback == false)
	{
		console.log("Error::Server Init()");
		process.exit(1);
		return;
	}
	console.log("Server Init()");
});