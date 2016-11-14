var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('WorkerReport', new Schema({
	'reporterName' : {type:String, required: true},
	'waterPurityCondition' : {type:Number, required: true},
	'location' : {type:String, required: true},
	'virusPPM' : {type:Number, required: true},
	'contaminantPPM' : {type:Number, required: true},
	'date' : {type:Date, default: Date.now}
}, {
	'timestamps' : true
}));