var maxUser = 2;
class User
{
	INIT()
	{
		this.userValid = [];
		this.uID = [];
		this.uMousePassword = [];
		this.mSecondLoginSort = [];
		this.mSecondLoginTryNum = [];
		this.userIP = [];
		for(var i = 0; i < maxUser; i++)
		{
			this.userValid[i] = false;
			this.uID[i] = '';	
			this.uMousePassword[i] = '';
			this.mSecondLoginSort[i] = 0;
			this.mSecondLoginTryNum[i] = 0;
			this.userIP[i] = "000.000.000.000";
		}
		return true;
	}
	GetConnectPlayer()
	{
		for(var i = 0; i < maxUser; i++)
		{
			if(this.userValid[i] === false)
			{
				break;
			}
		}
		if(i == maxUser)
		{
			return maxUser;		
		}
		this.userValid[i] = true;
		return i;
	}
	Send(socket, tUserIndex, tCheckValidBuffer, tBuffer, tBufferSize)
	{
		if(typeof(tCheckValidBuffer) === "boolean" && tCheckValidBuffer === true)
		{
			socket.write(tBuffer);	
		}
	}
	Quit(socket, tUserIndex)
	{
		this.userValid[tUserIndex] = false;
		console.log('connection from %s closed', this.userIP[tUserIndex]);
		socket.destroy();
	}
}
module.exports = User;
