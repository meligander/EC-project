const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

const Register = require('../../models/Register');

//@route    GET api/register
//@desc     get all cashier register
//@access   Private
router.get('/', [auth, adminAuth], async (req, res) => {
	try {
		let registers;

		if (Object.entries(req.query).length === 0) {
			registers = await Register.find().sort({ date: -1 });
		} else {
			const filter = req.query;

			registers = await Register.find({
				...((filter.startDate || filter.endDate) && {
					date: {
						...(filter.startDate && {
							$gte: new Date(new Date(filter.startDate).setHours(00, 00, 00)),
						}),
						...(filter.endDate && {
							$lt: new Date(new Date(filter.endDate).setHours(23, 59, 59)),
						}),
					},
				}),
			}).sort({ date: -1 });
		}

		if (registers === 0) {
			return res.status(400).json({
				msg: 'No se encontró información de la caja con dichas descripciones',
			});
		}

		res.json(registers);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/register/last
//@desc     get last register info
//@access   Private
router.get('/last', [auth, adminAuth], async (req, res) => {
	try {
		let register = await Register.find().sort({ $natural: -1 }).limit(1);
		register = register[0];

		res.json(register);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/register
//@desc     Add first register
//@access   Private
router.post('/', [auth, adminAuth], async (req, res) => {
	const { difference, description } = req.body;

	try {
		let data = { temporary: false, description };

		data.registermoney = Math.floor(difference * 100) / 100;

		let register = new Register(data);

		await register.save();

		res.json(register);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    PUT api/register
//@desc     Update a register
//@access   Private
router.put('/', [auth, adminAuth], async (req, res) => {
	const { difference, negative, description } = req.body;

	try {
		let last = await Register.find().sort({ $natural: -1 }).limit(1);
		last = last[0];

		if (!last.temporary) {
			return res
				.status(400)
				.json({ msg: 'No se ha registrado ningún movimiento en la caja' });
		}
		let value = last.registermoney;

		if (difference) {
			if (negative) {
				value =
					Math.floor((last.registermoney - Number(difference)) * 100) / 100;
			} else {
				value =
					Math.floor((last.registermoney + Number(difference)) * 100) / 100;
			}
		}

		const date = new Date();

		let data = {
			...(difference && {
				difference,
				registermoney: value,
				negative,
			}),
			...(description && description),
			temporary: false,
			dateclose: date,
		};

		let register = await Register.findOneAndUpdate({ _id: last.id }, data, {
			new: true,
		});

		res.json(register);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    DELETE api/register/:id
//@desc     Delete a register
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		const register = await Register.findOne({ _id: req.params.id });

		if (register.temporary) {
			return res.status(400).json({ msg: 'La caja no se ha cerrado todavía' });
		}
		if (register.difference !== 0) {
			let registermoney;
			if (register.negative) {
				registermoney = register.registermoney + register.difference;
			} else {
				registermoney = register.registermoney - register.difference;
			}
			await Register.findOneAndUpdate(
				{ _id: req.params.id },
				{
					temporary: true,
					difference: 0,
					registermoney,
				}
			);
		} else {
			//Remove register
			await Register.findOneAndUpdate(
				{ _id: req.params.id },
				{
					temporary: true,
				}
			);
		}

		res.json({ msg: 'Register deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
