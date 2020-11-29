const mongoose = require('mongoose');

const NeighbourhoodSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	town: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'town',
		required: true,
	},
});

const Neighbourhood = mongoose.model('neighbourhood', NeighbourhoodSchema);

module.exports = Neighbourhood;
