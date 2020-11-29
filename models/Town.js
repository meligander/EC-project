const mongoose = require('mongoose');

const TownSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

const Town = mongoose.model('town', TownSchema);

module.exports = Town;
