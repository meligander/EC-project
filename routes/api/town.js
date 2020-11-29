const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

const Town = require('../../models/Town');

//@route    GET api/town
//@desc     get all towns
//@access   Private
router.get('/', [auth], async (req, res) => {
	try {
		let towns = await Town.find().sort({ name: 1 });

		if (towns.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron localidades con dichas descripciones',
			});
		}

		res.json(towns);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/town/one
//@desc     Add a town
//@access   Private
router.post(
	'/one',
	[auth, adminAuth, check('name', 'El nombre es necesario').not().isEmpty()],
	async (req, res) => {
		const { name } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let town = new Town({ name });

			await town.save();

			res.json(town);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    PUT api/town/:id_town
//@desc     Update a town
//@access   Private
router.put(
	'/:id_town',
	[auth, adminAuth, check('name', 'El nombre es necesario').not().isEmpty()],
	async (req, res) => {
		const { name } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let town = await Town.findOneAndUpdate(
				{ _id: req.params.id_town },
				{ $set: { name } },
				{ new: true }
			);

			res.json(town);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    POST api/town
//@desc     Update all towns
//@access   Private
router.post('/', [auth, adminAuth], async (req, res) => {
	//An array of towns
	const towns = req.body;
	let town = {};
	let newTowns = [];
	try {
		for (let x = 0; x < towns.length; x++) {
			if (towns[x].name === '')
				return res
					.status(400)
					.json({ errors: [{ msg: 'El nombre debe estar definido' }] });
		}
		let oldTowns = await Town.find();
		for (let x = 0; x < towns.length; x++) {
			let name = towns[x].name;
			let id = towns[x]._id;

			if (id === '') {
				town = new Town({ name });
				town.save();
			} else {
				town = await Town.findOneAndUpdate(
					{ _id: id },
					{ $set: { name } },
					{ new: true }
				);

				for (let y = 0; y < oldTowns.length; y++) {
					if (oldTowns[y]._id.toString() === id) {
						oldTowns.splice(y, 1);
						break;
					}
				}
			}
			newTowns.push(town);
		}
		for (let x = 0; x < oldTowns.length; x++) {
			await Town.findOneAndRemove({ _id: oldTowns[x]._id });
		}

		res.json(newTowns);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    DELETE api/town/:id
//@desc     Delete a town
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		//Remove Town
		await Town.findOneAndRemove({ _id: req.params.id });

		res.json({ msg: 'Town deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
