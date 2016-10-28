var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('WorkerReport', new Schema({
	'reporterName' : {type:String, required: true},
	'waterPurityCondition' : {type:Number, required: true},
	'location' : {type:String, required: true},
}, {
	'timestamps' : true
}));