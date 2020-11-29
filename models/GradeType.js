const mongoose = require('mongoose');

const GradeTypeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	categories: [
		{
			category: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'category',
			},
		},
	],
});

const GradeType = mongoose.model('gradetypes', GradeTypeSchema);

module.exports = GradeType;
