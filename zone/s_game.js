global.mGAME = [];
global.GameInit = function( callback )
{
	mGAME.mTickCount = 0;
	mGAME.mMaxPlayerNum = 0;
	mGAME.mAddPlayerNum = 0;
	mGAME.mGagePlayerNum = 0;
	mGAME.mPresentPlayerNum = 0;
	mGAME.tUnicode;
	mGAME.GetTickCount = GetTickCount;
	mGAME.CheckNameString = CheckNameString;
	mGAME.BufToStr = BufToStr;
	mGAME.StrToBuf = StrToBuf;
	mGAME.ReturnTime = ReturnTime;
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
var GetTickCount = function()
{
	return process.hrtime()[0];
}
var CheckNameString = function(string)
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
var BufToStr = function(buf)
{
	return buf.toString('utf8').replace(/\0/g, '');
}
var StrToBuf = function(str)
{
	return Buffer(str);
}
var ReturnTime = function()
{
	var date = new Date();
	return sprintf( '%04d-%02d-%02d %02d:%02d:%02d', date.getFullYear(), ( date.getMonth() + 1 ), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() );
}
module.exports = global;
