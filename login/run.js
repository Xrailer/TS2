var LOGIN = require('./s_server');
LOGIN.INIT( function( callback ) 
{
	if(callback == false)
	{
		console.log("Error::LOGIN SERVER");
		process.exit(1);
		return;
	}
	console.log("=== LOGIN SERVER ===");
});