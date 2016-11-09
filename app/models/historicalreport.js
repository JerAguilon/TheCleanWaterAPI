var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('HistoricalReport', new Schema({
	'historicalReportType' : {type:Number, required: true},
	'ppm' : {type:Number, required: true},
	'location' : {type:String, required: true},
	'date' : {type:String, required: true}
}, {
	'timestamps' : true
}));