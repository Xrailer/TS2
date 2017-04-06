var mZONE = require('./s_server');
mZONE.INIT( function( callback ) 
{
	if(callback == false)
	{
		console.log("Error::mZONE");
		process.exit(1);
		return;
	}
	console.log("mZONE Started");
});