const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

const Penalty = require('../../models/Penalty');

//@route    GET api/penalty/last
//@desc     get last penalty
//@access   Private
router.get('/last', [auth, adminAuth], async (req, res) => {
	try {
		let penalty = await Penalty.find().sort({ $natural: -1 }).limit(1);
		penalty = penalty[0];

		if (!penalty) {
			return res.status(400).json({
				msg: 'No se encontraron recargos con dichas descripciones',
			});
		}

		res.json(penalty);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/penalty
//@desc     get all penalties
//@access   Private
router.get('/', [auth, adminAuth], async (req, res) => {
	try {
		let penalties = await Penalty.find();

		if (penalties.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron recargos con dichas descripciones',
			});
		}

		res.json(penalties);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/penalty
//@desc     Add a penalty
//@access   Private
router.post(
	'/',
	[
		auth,
		adminAuth,
		check('percentage', 'El porcentaje es necesario').not().isEmpty(),
	],
	async (req, res) => {
		const { percentage } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let penalty = new Penalty({ percentage });

			await penalty.save();

			res.json(penalty);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
