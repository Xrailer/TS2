this.INIT = function()
{
	this.tUnicode;
	return true;
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
