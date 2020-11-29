const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

const Expence = require('../../models/Expence');
const Register = require('../../models/Register');
const ExpenceType = require('../../models/ExpenceType');

//@route    GET api/expence
//@desc     get all expences
//@access   Private
router.get('/', [auth, adminAuth], async (req, res) => {
	try {
		let expences;

		if (Object.entries(req.query).length === 0) {
			expences = await Expence.find()
				.populate('expencetype')
				.sort({ date: -1 });
		} else {
			const filter = req.query;

			expences = await Expence.find({
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
				...(filter.expencetype && { expencetype: filter.expencetype }),
			})
				.populate('expencetype')
				.sort({ date: -1 });
		}

		if (expences.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron gastos con dichas descripciones',
			});
		}

		res.json(expences);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/expence
//@desc     Add an expence
//@access   Private
router.post(
	'/',
	[
		auth,
		adminAuth,
		check('value', 'El valor es necesario').not().isEmpty(),
		check('expencetype', 'El tipo de gasto es necesario').not().isEmpty(),
	],
	async (req, res) => {
		let { value, expencetype, description } = req.body;

		try {
			let errors = validationResult(req);
			errors = errors.array();

			if (errors.length > 0) {
				return res.status(400).json({ errors });
			}

			const expencetypeinfo = await ExpenceType.findOne({ _id: expencetype });

			let last = await Register.find().sort({ $natural: -1 }).limit(1);
			last = last[0];
			if (last === undefined) {
				return res.status(400).json({
					errors: [
						{
							msg:
								'Primero debe ingresar dinero a la caja antes de hacer cualquier transacción',
						},
					],
				});
			}
			if (last.registermoney === 0) {
				const error = {
					msg:
						'Primero debe ingresar dinero a la caja antes de hacer cualquier transacción',
				};
				errors.push(error);
			}
			if (expencetypeinfo.type !== 'Ingreso' && last.registermoney < value) {
				const error = {
					msg: 'No se puede utilizar más dinero del que hay en caja',
				};
				errors.push(error);
			}

			if (errors.length > 0) {
				return res.status(400).json({ errors });
			}

			let data = { value, expencetype, description };

			let expence = new Expence(data);

			await expence.save();

			let expences = await Expence.find()
				.populate('expencetype')
				.sort({ $natural: -1 })
				.limit(1);
			expence = expences[0];

			value = Number(value);

			const plusvalue = Math.floor((last.registermoney + value) * 100) / 100;
			const minusvalue = Math.floor((last.registermoney - value) * 100) / 100;

			if (last.temporary) {
				await Register.findOneAndUpdate(
					{ _id: last.id },
					{
						...(expencetypeinfo.type === 'Gasto' && {
							expence:
								last.expence === undefined
									? value
									: Math.floor((last.expence + value) * 100) / 100,
							registermoney: minusvalue,
						}),
						...(expencetypeinfo.type === 'Ingreso' && {
							cheatincome:
								last.cheatincome === undefined
									? value
									: Math.floor((last.cheatincome + value) * 100) / 100,
							registermoney: plusvalue,
						}),
						...(expencetypeinfo.type === 'Retiro' && {
							withdrawal:
								last.withdrawal === undefined
									? value
									: Math.floor((last.withdrawal + value) * 100) / 100,
							registermoney: minusvalue,
						}),
					}
				);
			} else {
				const data = {
					temporary: true,
					difference: 0,
					...(expencetypeinfo.type === 'Gasto' && {
						expence: value,
						registermoney: minusvalue,
					}),
					...(expencetypeinfo.type === 'Ingreso' && {
						cheatincome: value,
						registermoney: plusvalue,
					}),
					...(expencetypeinfo.type === 'Retiro' && {
						withdrawal: value,
						registermoney: minusvalue,
					}),
				};

				const register = new Register(data);

				await register.save();
			}

			res.json(expence);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    DELETE api/expence/:id
//@desc     Delete an expence
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		//Remove Expence
		const expence = await Expence.findOneAndRemove({ _id: req.params.id });
		const expencetypeinfo = await ExpenceType.findOne({
			_id: expence.expencetype,
		});

		let last = await Register.find().sort({ $natural: -1 }).limit(1);
		last = last[0];

		await Register.findByIdAndUpdate(
			{ _id: last.id },
			{
				...(expencetypeinfo.type === 'Gasto' && {
					expence: last.expence - expence.value,
					registermoney: last.registermoney + expence.value,
				}),
				...(expencetypeinfo.type === 'Ingreso' && {
					cheatincome: last.cheatincome - expence.value,
					registermoney: last.registermoney - expence.value,
				}),
				...(expencetypeinfo.type === 'Retiro' && {
					withdrawal: last.withdrawal - expence.value,
					registermoney: last.registermoney + expence.value,
				}),
			}
		);

		res.json({ msg: 'Expence deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
