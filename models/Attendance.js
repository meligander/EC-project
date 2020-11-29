const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	date: {
		type: Date,
		required: true,
	},
	period: {
		type: Number,
		required: true,
	},
	classroom: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'class',
		required: true,
	},
});

const Attendance = mongoose.model('attendance', AttendanceSchema);

module.exports = Attendance;
