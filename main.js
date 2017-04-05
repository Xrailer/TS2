var mLOGIN = require('./login/s_server');
mLOGIN.INIT( function( callback ) 
{
	if(callback == false)
	{
		console.log("Error::mLOGIN");
		process.exit(1);
		return;
	}
	console.log("mLOGIN Started");
});
