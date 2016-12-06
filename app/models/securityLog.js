var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function getType(item) {
	if (item == 0) {
		return "Log in";
	} else if (item == 1) {
		return "Account delete";
	} else if (item == 2) {
		return "(Un)ban user"
	} else if (item == 3) {
		return "(Un)block account";
	} else if (item == 4) {
		return "Report delete";
	} else {
		return "~~~~UNKNOWN ACTION~~~~"
	}
}

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('SecurityLog', new Schema({
	'type' : {type: String, required:true, get: getType},
	'action' : {type: String, required:true}
}, {
	'timestamps' : true
}));