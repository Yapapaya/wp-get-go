var fs = require('fs');

var wpbsUtils = function() {
};

wpbsUtils.readJSON = function(path){
	var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
	
	return obj;
	
};

module.exports = wpbsUtils;