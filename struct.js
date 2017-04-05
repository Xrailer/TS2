const ezstruct = require('ezstruct');
ezstruct.setStringEncoding('utf-8');
var context = ezstruct `
typedef struct {
	int aVisibleState;
	int aSpecialState;
	int aPlayTime1;
	int aPlayTime2;
	int aKillOtherTribe;
	char aName[13];
	char aBuff0[3];
	int aTribe;
	int aPreviousTribe;
	int aGender;
	int aHeadType;
	int aFaceType;
	int aLevel1;
	int aLevel2;
	int aGeneralExperience1;
	int aGeneralExperience2;
	int aVitality;
	int aStrength;
	int aKi;
	int aWisdom;
	int aEatLifePotion;
	int aEatManaPotion;
	int aStateBonusPoint;
	int aSkillPoint;
	int aEquip[13][4];
	int aExpandInventoryDate;
	int aMoney;
	int aInventory[2][64][6];
	int aTradeMoney;
	int aTrade[8][4];
	int aExpandStoreDate;
	int aStoreMoney;
	int aStoreItem[2][28][4];
	int aSkill[40][2];
	int aHotKey[3][14][3];
	int aQuestInfo[5];
	char aFriend[10][13];
	char aTeacher[13];
	char aStudent[13];
	int aTeacherPoint;
	char aGuildName[13];
	int aGuildRole;
	char aCallName[5];
	int aGuildMarkNum;
	int aGuildMarkEffect;
	int aLogoutInfo[6];
	char aFree1[264];
	int uSaveMoney;
	int uSaveItem[28][4];
	char aFree2[1688];
} AVATAR_INFO;
`
// JS to binary // binary to JS
global.pckAvatar = function( type, buf )
{
	var a;
	if( type == 0 )
		a = context.AVATAR_INFO.fromBinary( buf );//unpack from buffer to array,object
	if ( type == 1)
		a = context.AVATAR_INFO.toBinary( buf ); //pack array,object to buffer
	return a;
}
global.AVATAR_INFO = context.AVATAR_INFO;
module.exports = global;