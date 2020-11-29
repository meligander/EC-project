const mongoose = require('mongoose');

const PenaltySchema = new mongoose.Schema({
	percentage: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Penalty = mongoose.model('penalty', PenaltySchema);

module.exports = Penalty;
