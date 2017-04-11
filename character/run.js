var CHARACTER = require('./s_server');
CHARACTER.INIT( function( callback ) 
{
	if(callback == false)
	{
		console.log("Error::CHARACTER SERVER");
		process.exit(1);
		return;
	}
	console.log("=== CHARACTER SERVER ===");
});
