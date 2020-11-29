const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

//@route    GET api/auth
//@desc     Get user
//@access   Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.select('-password')
			.populate({
				path: 'town',
				model: 'town',
				select: 'name',
			})
			.populate({
				path: 'neighbourhood',
				model: 'neighbourhood',
				select: 'name',
			})
			.populate({
				path: 'children.user',
				model: 'user',
				select: ['name', 'lastname', 'classroom'],
			});
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route    POST api/auth
//@desc     Authenticate user when login & get token
//@access   Public
router.post(
	'/',
	[
		check('email', 'Ingrese un email válido').isEmail(),
		check('password', 'La contraseña es necesaria').exists(),
	],
	async (req, res) => {
		const errorInit = validationResult(req);

		if (!errorInit.isEmpty()) {
			const errors = errorInit.array();
			return res.status(400).json({ errors });
		}

		const { email, password } = req.body;

		try {
			//See if users exists
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ msg: 'Credenciales Inválidas' });
			}

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ msg: 'Credenciales Inválidas' });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
