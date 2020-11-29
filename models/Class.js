const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category',
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	classroom: {
		type: String,
	},
	day1: {
		type: String,
	},
	day2: {
		type: String,
	},
	hourin1: {
		type: Date,
	},
	hourin2: {
		type: Date,
	},
	hourout1: {
		type: Date,
	},
	hourout2: {
		type: Date,
	},
});

const Class = mongoose.model('class', ClassSchema);

module.exports = Class;
