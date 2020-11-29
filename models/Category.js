const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	value: {
		type: Number,
	},
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
