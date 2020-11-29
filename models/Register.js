const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
	income: {
		type: Number,
	},
	expence: {
		type: Number,
	},
	withdrawal: {
		type: Number,
	},
	cheatincome: {
		type: Number,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	dateclose: {
		type: Date,
	},
	registermoney: {
		type: Number,
	},
	difference: {
		type: Number,
	},
	negative: {
		type: Boolean,
	},
	temporary: {
		type: Boolean,
		default: true,
	},
	description: {
		type: String,
	},
});

const Register = mongoose.model('register', RegisterSchema);

module.exports = Register;
