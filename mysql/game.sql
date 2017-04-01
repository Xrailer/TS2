/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : game

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-04-01 16:57:31
*/

SET FOREIGN_KEY_CHECKS=0;

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
INSERT INTO `memberinfo` VALUES ('test', '123', '0000', '0', '100', '0', '27700');
