const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	year: {
		type: String,
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category',
		required: true,
	},
});

const Enrollment = mongoose.model('enrollment', EnrollmentSchema);

module.exports = Enrollment;
