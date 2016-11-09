// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
	username: {type:String},
	password: {type:String},
	responsibility: {type:Number},
	profile:  {
		email: {type:String},
		address: {type:String},
		title: {type:String}
	}
}));