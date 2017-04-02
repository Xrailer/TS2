var config = require('./config');
var restruct = require('restruct');

var struct = restruct.
	int32lu('aVisibleState').
	int32lu('aSpecialState').
	int32lu('aPlayTime1').
	int32lu('aPlayTime2').
	int32lu('aKillOtherTribe').
	string('aName', config.MAX_AVATAR_NAME_LENGTH).
	string('aBuff0', 3).
	int32lu('aTribe').
	int32lu('aPreviousTribe').
	int32lu('aGender').
	int32lu('aHeadType').
	int32lu('aFaceType').
	int32lu('aLevel1').
	int32lu('aLevel2').
	int32lu('aGeneralExperience1').
	int32lu('aGeneralExperience2');
var AVATAR_INFO = struct;