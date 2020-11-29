const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	gradetype: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'gradetype',
		required: true,
	},
	classroom: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'class',
		required: true,
	},
	period: {
		type: Number,
		required: true,
	},
	value: {
		type: Number,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Grade = mongoose.model('grade', GradeSchema);

module.exports = Grade;
