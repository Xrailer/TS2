var mDB = require('./s_mysql');
this.INIT = function( callback )
{
	this.mTickCount = 0;
	this.mMaxPlayerNum = 0;
	this.mAddPlayerNum = 0;
	this.mGagePlayerNum = 0;
	this.mPresentPlayerNum = 0;
	this.tUnicode;
	
	mDB.DB_PROCESS_01( function( callback ) 
	{
		if(callback == false)
		{
			console.log("Error::mDB.DB_PROCESS_01()");
			process.exit(1);
			return;
		}
	});	
	return callback(true);
}
this.GetTickCount = function()
{
	return process.hrtime()[0];
}
this.CheckNameString = function(string)
{
	for (var i = 0; i < string.length; i++) 
	{
		tUnicode = parseInt(string[i]);
		if(tUnicode == 0) // zero
		{
			continue;			
		}
		if ( ( tUnicode >= 48 ) && ( tUnicode <= 57 ) ) //0-9
		{
			continue;
		}
		if ( (tUnicode >= 65 ) && ( tUnicode <= 90 ) ) //A-Z
		{
			continue;
		}
		if ( ( tUnicode >= 97 ) && ( tUnicode <= 122 ) ) //a-z
		{
			continue;
		}
		return false;
	}
	return true;
}
this.BufToStr = function(buf)
{
	return buf.toString('utf8').replace(/\0/g, '');
}
this.StrToBuf = function(string)
{
	return Buffer(string);
}
module.exports = this;
