var config = require('./config');
this._ = require('c-struct');

this.AVATAR_INFO = new this._.Schema({
  aVisibleState: this._.type.uint32,
  aSpecialState: this._.type.uint32,
  aPlayTime1: this._.type.uint32,
  aPlayTime1: this._.type.uint32,
  aPlayTime2: this._.type.uint32, 
  aKillOtherTribe: this._.type.uint32,
  aName: this._.type.string( config.MAX_AVATAR_NAME_LENGTH ),
  aBuff01: this._.type.string( 3 )
});
// register to cache
this._.register('AVATAR_INFO', this.AVATAR_INFO);
module.exports = this;