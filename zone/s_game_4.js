global.mAVATAR_OBJECT = [];
global.AvatarInit = function( callback )
{
	var index01;
	var index02;
	var index03;
	for( index01 = 0; index01 < MAX_USER_FOR_ZONE; index01++ )
	{
		mAVATAR_OBJECT[index01] = {
			mUniqueNumber: 0,
			uCheckValidState: false,
			mDATA : {}
		};
		mAVATAR_OBJECT[index01].mDATA = Buffer.alloc( SIZE_OF_OBJECT_FOR_AVATAR ).fill( 0 );
	}
	return callback(true);
}
module.exports = global;