class Game 
{
	INIT()
	{
		return true;
	}
	CheckNameString(string)
	{
		var tUnicode;
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
	BufToStr(buf)
	{
		return buf.toString('utf8').replace(/\0/g, '');
	}
	StrToBuf(string)
	{
		return Buffer(string);
	}
}
module.exports = Game;
