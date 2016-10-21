// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
	username: String,
	password: String,
	responsibility: Number,
	id: String,
	profile:  {
		email: String,
		address: String,
		title: String
	}
}));