var _ = require('c-struct');
global.AVATAR_INFO = new _.Schema({
	aVisibleState: _.type.uint32,
	aSpecialState: _.type.uint32,
	aPlayTime1: _.type.uint32,
	aPlayTime2: _.type.uint32,
	aKillOtherTribe: _.type.uint32,
	aName: _.type.string( MAX_AVATAR_NAME_LENGTH  ),
	aFree01: _.type.string( 3 ),
	aTribe: _.type.uint32,
	aPreviousTribe: _.type.uint32,
	aGender: _.type.uint32,
	aHeadType: _.type.uint32,
	aFaceType: _.type.uint32,
	aLevel1: _.type.uint32,
	aLevel2: _.type.uint32,
	aGeneralExperience1: _.type.uint32,
	aGeneralExperience2: _.type.uint32,
	aVit: _.type.uint32,
	aStr: _.type.uint32,
	aInt: _.type.uint32,
	aDex: _.type.uint32,
	aEatLifePotion: _.type.uint32,
	aEatManaPotion: _.type.uint32,
	aStateBonusPoint: _.type.uint32,
	aSkillPoint: _.type.uint32,
	aEquip: {
		0: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		1: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		2: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		3: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		3: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		4: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		5: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		6: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		7: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		8: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		9: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		10: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		11: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		12: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		}
	},
	aExpandInventoryDate: _.type.uint32,
	aMoney: _.type.uint32,
	aInventory: _.type.string( 3072 ),
	aTradeMoney: _.type.uint32,
	aTrade:	{
		0: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		1: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		2: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		3: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		3: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		4: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		5: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		6: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		},
		7: {
			0: _.type.uint32,
			1: _.type.uint32,
			2: _.type.uint32,
			3: _.type.uint32
		}
	},
	aExpandStoreDate: _.type.uint32,
	aStoreMoney: _.type.uint32,
	aStoreItem: _.type.string( 896 ),
	aSkill: {
		0: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		1: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		2: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		3: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		4: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		5: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		6: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		7: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		8: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		9: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		10: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		11: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		12: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		13: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		14: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		15: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		16: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		17: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		18: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		19: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		20: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		21: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		22: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		23: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		24: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		25: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		26: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		27: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		28: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		29: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		30: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		31: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		32: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		33: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		34: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		35: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		36: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		37: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		38: {
			0: _.type.uint32,
			1: _.type.uint32
		},
		39: {
			0: _.type.uint32,
			1: _.type.uint32
		}
	},
	aHotKey: {
		0: {
			0: {	
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			1: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			2: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			3: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			4: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			5: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			6: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			7: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			8: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			9: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			10: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			11: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			12: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			}
		},
		1: {
			0: {	
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			1: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			2: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			3: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			4: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			5: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			6: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			7: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			8: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			9: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			10: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			11: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			12: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			}
		},
		2: {
			0: {	
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			1: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			2: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			3: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			4: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			5: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			6: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			7: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			8: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			9: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			10: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			11: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			},
			12: {		
				0: _.type.uint32,
				1: _.type.uint32,
				2: _.type.uint32
			}
		}
	},
	aQuestInfo: {
		0: _.type.uint32,
		1: _.type.uint32,
		2: _.type.uint32,
		3: _.type.uint32,
		4: _.type.uint32
	},
	aFriend: {
		0: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		1: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		2: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		3: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		4: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		5: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		6: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		7: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		8: _.type.string( MAX_AVATAR_NAME_LENGTH ),
		9: _.type.string( MAX_AVATAR_NAME_LENGTH )
	},
	aTeacher: _.type.string( MAX_AVATAR_NAME_LENGTH ),
	aStudent: _.type.string( MAX_AVATAR_NAME_LENGTH ),
	aTeacherPoint: _.type.uint32,
	aGuildName: _.type.string( MAX_AVATAR_NAME_LENGTH ),
	aGuildRole: _.type.uint32,
	aCallName: _.type.string( MAX_CALL_NAME_LENGTH ),
	aGuildMarkNum: _.type.uint32,
	aGuildMarkEffect: _.type.uint32,
	aLogoutInfo: {
		0: _.type.uint32,
		1: _.type.uint32,
		2: _.type.uint32,
		3: _.type.uint32,
		4: _.type.uint32,
		5: _.type.uint32
	},
	aFree02: _.type.string( 2404 )
});
_.register('AVATAR_INFO', AVATAR_INFO);
global.pAvatar = function ( type, AVATAR_INFO )
{
	if( type == 0)
	{
		return _.unpackSync( 'AVATAR_INFO', AVATAR_INFO );	
	}
	return _.packSync( 'AVATAR_INFO', AVATAR_INFO );
}
module.exports = global;