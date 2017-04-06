global.mGAME = [];
global.GameInit = function( callback )
{
	mGAME.mAvatarObjectUniqueNumber = 0;
	return callback(true);
}
var BufToStr = function(buf)
{
	return buf.toString('utf8').replace(/\0/g, '');
}
var StrToBuf = function(string)
{
	return Buffer(string);
}
module.exports = global;
