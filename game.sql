/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : game

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-04-04 21:15:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `avatarinfo`
-- ----------------------------
DROP TABLE IF EXISTS `avatarinfo`;
CREATE TABLE `avatarinfo` (
  `aInsertTime` datetime DEFAULT NULL,
  `uID` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `aVisibleState` int(11) DEFAULT '1',
  `aSpecialState` int(11) DEFAULT '0',
  `aPlayTime1` int(11) DEFAULT '0',
  `aPlayTime2` int(11) DEFAULT '0',
  `aKillOtherTribe` int(11) DEFAULT '0',
  `aName` varchar(12) COLLATE utf8_unicode_ci NOT NULL,
  `aTribe` int(11) DEFAULT '0',
  `aPreviousTribe` int(11) DEFAULT '0',
  `aGender` int(11) DEFAULT '0',
  `aHeadType` int(11) DEFAULT '0',
  `aFaceType` int(11) DEFAULT '0',
  `aLevel1` int(11) DEFAULT '1',
  `aLevel2` int(11) DEFAULT '0',
  `aGeneralExperience1` int(11) DEFAULT '0',
  `aGeneralExperience2` int(11) DEFAULT '0',
  `aVit` int(11) DEFAULT '1',
  `aStr` int(11) DEFAULT '1',
  `aInt` int(11) DEFAULT '1',
  `aDex` int(11) DEFAULT '1',
  PRIMARY KEY (`aName`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of avatarinfo
-- ----------------------------
INSERT INTO `avatarinfo` VALUES ('2017-04-03 16:05:08', 'test1', '1', '0', '0', '0', '0', 'dos', '1', '1', '1', '2', '2', '145', '0', '2000000000', '0', '1', '1', '1', '1');

-- ----------------------------
-- Table structure for `definemaxusernum`
-- ----------------------------
DROP TABLE IF EXISTS `definemaxusernum`;
CREATE TABLE `definemaxusernum` (
  `mMaxUserNum` int(11) DEFAULT NULL,
  `mAddPlayerNum` int(11) DEFAULT NULL,
  `mGageUserNum` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of definemaxusernum
-- ----------------------------
INSERT INTO `definemaxusernum` VALUES ('1000', '1', '50');

-- ----------------------------
-- Table structure for `masterinfo`
-- ----------------------------
DROP TABLE IF EXISTS `masterinfo`;
CREATE TABLE `masterinfo` (
  `uLoginState` int(1) DEFAULT '0',
  `uIP` varchar(15) COLLATE utf8_unicode_ci DEFAULT '',
  `uID` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `uSaveMoney` int(11) NOT NULL DEFAULT '0',
  `uSaveMoney2` int(11) NOT NULL DEFAULT '0',
  `uSaveItem` varchar(700) COLLATE utf8_unicode_ci DEFAULT '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  `aName01` varchar(12) COLLATE utf8_unicode_ci DEFAULT '',
  `aName02` varchar(12) COLLATE utf8_unicode_ci DEFAULT '',
  `aName03` varchar(12) COLLATE utf8_unicode_ci DEFAULT '',
  PRIMARY KEY (`uID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of masterinfo
-- ----------------------------
INSERT INTO `masterinfo` VALUES ('0', '', 'test2', '0', '0', '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', '', '', '');
INSERT INTO `masterinfo` VALUES ('0', '127.0.0.1', 'test1', '0', '0', '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'dos', '', '');

-- ----------------------------
-- Table structure for `memberinfo`
-- ----------------------------
DROP TABLE IF EXISTS `memberinfo`;
CREATE TABLE `memberinfo` (
  `uID` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `uPassword` varchar(30) COLLATE utf8_unicode_ci DEFAULT '',
  `uMousePassword` varchar(4) COLLATE utf8_unicode_ci DEFAULT '',
  `uBlockInfo` int(11) DEFAULT '0',
  `uUserSort` int(1) DEFAULT '0',
  `uTraceState` int(1) DEFAULT '0',
  `uCash` int(11) DEFAULT '0',
  PRIMARY KEY (`uID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of memberinfo
-- ----------------------------
INSERT INTO `memberinfo` VALUES ('test1', '1234', '0000', '0', '0', '0', '0');
INSERT INTO `memberinfo` VALUES ('test2', '5678', '0000', '0', '100', '0', '27700');
