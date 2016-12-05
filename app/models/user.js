// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
	attempts : {type:Number, default: 0},
	username: {type:String, required:true},
	password: {type:String, required:true},
	responsibility: {type:Number, required:true},
	profile:  {
		email: {type:String, required:true},
		address: {type:String, required:true},
		title: {type:String, required:true}
	},
	banned: {type: Boolean, default: false}
	},  
	{
		timestamps: true
	}
));