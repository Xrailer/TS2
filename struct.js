const ezstruct = require('ezstruct');
ezstruct.setStringEncoding('utf-8');
var context = ezstruct `
typedef struct {
	int 	aVisibleState;
	int 	aSpecialState;
	int 	aPlayTime1;
	int 	aPlayTime2;
	int 	aKillOtherTribe;
	char	aName[13];
	char	aBuff0[3];
	int 	aTribe;
	int 	aPreviousTribe;
	int 	aGender;
	int 	aHeadType;
	int 	aFaceType;
	int 	aLevel1;
	int 	aLevel2;
	int 	aGeneralExperience1;
	int 	aGeneralExperience2;
	int 	aVitality;
	int 	aStrength;
	int 	aKi;
	int 	aWisdom;
	int 	aEatLifePotion;
	int 	aEatManaPotion;
	int 	aStateBonusPoint;
	int 	aSkillPoint;
	int 	aEquip[13][4];
	int 	aExpandInventoryDate;
	int 	aMoney;
	int 	aInventory[2][64][6];
	int 	aTradeMoney;
	int 	aTrade[8][4];
	int 	aExpandStoreDate;
	int 	aStoreMoney;
	int 	aStoreItem[2][28][4];
	int 	aSkill[40][2];
	int 	aHotKey[3][14][3];
	int 	aQuestInfo[5];
	char	aFriend[10][13];
	char	aTeacher[13];
	char	aStudent[13];
	int 	aTeacherPoint;
	char	aGuildName[13];
	int 	aGuildRole;
	char	aCallName[5];
	int 	aGuildMarkNum;
	int 	aGuildMarkEffect;
	int 	aLogoutInfo[6];
	char	aFree1[264];
	int 	uSaveMoney;
	int 	uSaveItem[28][4];
	char	aFree2[1688];
} AVATAR_INFO;

typedef struct
{
	int 	aType;
	int 	aSort;
	float 	aFrame;
	float 	aLocation[3];
	float 	aTargetLocation[3];
	float 	aFront;
	float 	aTargetFront;
	int 	aTargetObjectSort;
	int 	aTargetObjectIndex;
	int 	aTargetObjectUniqueNumber;
	int 	aSkillNumber;
	int 	aSkillGradeNum1;
	int 	aSkillGradeNum2;
	int 	aSkillValue;
} ACTION_INFO;

typedef struct
{
	int     aVisibleState;
	int     aSpecialState;
	int		aKillOtherTribe;
	int		aGuildMarkNum;
	char	aGuildName[13];
	char	aBuff0[3];
	int     aGuildRole;
	char	aCallName[5];
	char	aBuff1[3];
	int		aGuildMarkEffect;
	char	aName[13];
	char	aBuff2[3];
	int     aTribe;
	int     aPreviousTribe;
	int     aGender;
	int     aHeadType;
	int     aFaceType;
	int     aLevel1;
	int     aLevel2;
	int		aEquipForView[13][2];
	int		aAnimalNumber;
	int		aTitle;// 1-12 / 101-112 / 201-212 / 301-312 / 401-412
	int		aHalo;	
	int		aRebirth;
	int		aUnknow1;
	ACTION_INFO aAction;
	int		aMaxLifeValue;
	int		aLifeValue;
	int		aMaxManaValue;
	int		aManaValue;
	int		aEffectValueForView[28];
	char	aPartyName[13];
	char	aBuff3[3];
	int		aDuelState[3];
	int     aPShopState;
	char	aPShopName[25];
	char	aBuff4[3];
	int		aFashionNumber;
	int		aGuildBuff[2];
	int		aBotOn;
	int		aUnknow3[5];
	int		aRankPoint;
	int		aArrow;
	int		aAnimalOn;
	int		aUnknow[7];
} OBJECT_FOR_AVATAR;
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
global.pckAction = function( type, buf )
{
	var a;
	if( type == 0 )
		a = context.ACTION_INFO.fromBinary( buf );//unpack from buffer to array,object
	if ( type == 1)
		a = context.ACTION_INFO.toBinary( buf ); //pack array,object to buffer
	return a;
}
global.pckObjectAvatar = function( type, buf )
{
	var a;
	if( type == 0 )
		a = context.OBJECT_FOR_AVATAR.fromBinary( buf );//unpack from buffer to array,object
	if ( type == 1)
		a = context.OBJECT_FOR_AVATAR.toBinary( buf ); //pack array,object to buffer
	return a;
}
module.exports = global;