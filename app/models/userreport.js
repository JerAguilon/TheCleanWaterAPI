// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('UserReport', new Schema({
	'waterSourceType' : Number,
	'waterSourceCondition' : Number,
	'reporterName' : String,
	'location' : String,
}, {
	'timestamps' : true
}));