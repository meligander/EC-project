const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

const Neighbourhood = require('../../models/Neighbourhood');

//@route    GET api/neighbourhood
//@desc     get all neighbourhoods
//@access   Private
router.get('/', [auth, adminAuth], async (req, res) => {
	try {
		let neighbourhoods = await Neighbourhood.find().sort({ name: 1 });

		if (neighbourhoods.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron barrios con dichas descripciones',
			});
		}

		res.json(neighbourhoods);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/neighbourhood/town/:id
//@desc     get all neighbourhoods by town
//@access   Private
router.get('/town/:id', [auth], async (req, res) => {
	try {
		let neighbourhoods = await Neighbourhood.find({
			town: req.params.id,
		}).sort({ name: 1 });

		if (neighbourhoods.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron barrios con dichas descripciones',
			});
		}

		res.json(neighbourhoods);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/neibourhood
//@desc     Add a neighbourhood
//@access   Private
router.post(
	'/one',
	[
		auth,
		adminAuth,
		check('name', 'El nombre es necesario').not().isEmpty(),
		check('town', 'La localidad es necesaria').not().isEmpty(),
	],
	async (req, res) => {
		const { name, town } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let data = { name, town };

			let neighbourhood = new Neighbourhood(data);

			await neighbourhood.save();

			res.json(neighbourhood);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    PUT api/neighbourhood/:id_neighbourhood
//@desc     Update a neighbourhood
//@access   Private
router.put(
	'/:id_neighbourhood',
	[
		auth,
		adminAuth,
		check('name', 'El nombre es necesario').not().isEmpty(),
		check('town', 'La localidad es necesaria').not().isEmpty(),
	],
	async (req, res) => {
		const { name, town } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let neighbourhood = await Neighbourhood.findOneAndUpdate(
				{ _id: req.params.id_neighbourhood },
				{ $set: { name, town } },
				{ new: true }
			);

			res.json(neighbourhood);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    POST api/neighbourhood
//@desc     Update all neighbourhoods
//@access   Private
router.post('/', [auth, adminAuth], async (req, res) => {
	//An array of neighbourhoods
	const neighbourhoods = req.body;
	let newNeighbourhoods = [];
	let neighbourhood = {};
	let errors = [];
	try {
		for (let x = 0; x < neighbourhoods.length; x++) {
			if (neighbourhoods[x].name === '')
				errors.push({ msg: 'El nombre debe estar definido' });
			if (neighbourhoods[x].town === 0)
				errors.push({ msg: 'La localidad debe estar definida' });
			if (errors.length > 0) return res.status(400).json({ errors });
		}
		let oldNeighbourhoods = await Neighbourhood.find();

		for (let x = 0; x < neighbourhoods.length; x++) {
			let name = neighbourhoods[x].name;
			let town = neighbourhoods[x].town;
			let id = neighbourhoods[x]._id;
			if (id === '') {
				neighbourhood = new Neighbourhood({ name, town });

				await neighbourhood.save();
			} else {
				neighbourhood = await Neighbourhood.findOneAndUpdate(
					{ _id: id },
					{ $set: { name, town } },
					{ new: true }
				);
				for (let y = 0; y < oldNeighbourhoods.length; y++) {
					if (oldNeighbourhoods[y]._id.toString() === id) {
						oldNeighbourhoods.splice(y, 1);
						break;
					}
				}
			}
			newNeighbourhoods.push(neighbourhood);
		}
		for (let x = 0; x < oldNeighbourhoods.length; x++) {
			await Neighbourhood.findOneAndRemove({ _id: oldNeighbourhoods[x]._id });
		}

		res.json(newNeighbourhoods);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    DELETE api/neighbourhood/:id
//@desc     Delete a neighbourhood
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		//Remove neighbourhood
		await Neighbourhood.findOneAndRemove({ _id: req.params.id });

		res.json({ msg: 'Neighbourhood deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
