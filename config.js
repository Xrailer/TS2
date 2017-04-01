var fs = require('fs');
var Config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
module.exports = Config;