var config = require('./config');
var _ = require('c-struct');

var AVATAR_INFO = new _.Schema({
	aVisibleState: _.type.uint32,
	aSpecialState: _.type.uint32,
	aPlayTime1: _.type.uint32,
	aPlayTime2: _.type.uint32,
	aKillOtherTribe: _.type.uint32,
	aName: _.type.string( config.MAX_AVATAR_NAME_LENGTH  ),
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
	aBuff: _.type.string( 7808 )
});
_.register('AVATAR_INFO', AVATAR_INFO);
this.pack = function ( AVATAR_INFO )
{
	return _.packSync( 'AVATAR_INFO', AVATAR_INFO );
}
this.unpack = function ( AVATAR_INFO )
{
	return _.unpackSync( 'AVATAR_INFO', AVATAR_INFO );
}
module.exports = this;