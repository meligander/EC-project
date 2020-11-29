const mongoose = require('mongoose');

const ExpenceSchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	value: {
		type: Number,
		required: true,
	},
	expencetype: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'expencetype',
		required: true,
	},
	description: {
		type: String,
	},
});

const Expence = mongoose.model('expence', ExpenceSchema);

module.exports = Expence;
