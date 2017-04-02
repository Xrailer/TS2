this.INIT = function()
{
	this.maxUser = 2;
	this.userValid = [];
	this.uID = [];
	this.uUserSort = [];
	this.uMousePassword = [];
	this.mSecondLoginSort = [];
	this.mSecondLoginTryNum = [];
	this.userIP = [];
	for(var i = 0; i < this.maxUser; i++)
	{
		this.userValid[i] = false;
		this.uID[i] = '';
		this.uUserSort[i] = 0;
		this.uMousePassword[i] = '';
		this.mSecondLoginSort[i] = 0;
		this.mSecondLoginTryNum[i] = 0;
		this.userIP[i] = "000.000.000.000";
	}
	return true;
}
this.GetConnectPlayer = function()
{
	for(var i = 0; i < this.maxUser; i++)
	{
		if(this.userValid[i] === false)
		{
			break;
		}
	}
	if(i == this.maxUser)
	{
		return this.maxUser;
	}
	this.userValid[i] = true;
	return i;
}
this.Send = function(socket, tUserIndex, tCheckValidBuffer, tBuffer, tBufferSize)
{
	if(typeof(tCheckValidBuffer) === "boolean" && tCheckValidBuffer === true)
	{
		socket.write(tBuffer);
	}
}
this.Quit = function(tUserIndex)
{
	this.userValid[tUserIndex] = false;
	console.log('connection from tID:%d, uIP:%s closed', tUserIndex,this.userIP[tUserIndex]);
}
module.exports = this;
