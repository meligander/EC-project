const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');
const pdf = require('html-pdf');
const pdfTemplate = require('../../documents/enrollments');
const moment = require('moment');

const Enrollment = require('../../models/Enrollment');
const Installment = require('../../models/Installment');
const User = require('../../models/User');
const Category = require('../../models/Category');

//@route    GET api/enrollment
//@desc     get all enrollments
//@access   Private
router.get('/', [auth, adminAuth], async (req, res) => {
	try {
		let date = new Date();
		let enrollments;
		if (Object.entries(req.query).length === 0) {
			enrollments = await Enrollment.find({
				year: { $in: [date.getFullYear(), date.getFullYear() + 1] },
			})
				.populate({
					path: 'student',
					model: 'user',
					select: ['name', 'lastname', 'studentnumber'],
				})
				.populate({
					path: 'category',
					model: 'category',
				})
				.sort({ date: -1 });
		} else {
			const filter = req.query;

			enrollments = await Enrollment.find({
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
				...(filter.category && { category: filter.category }),
				year: filter.year
					? filter.year
					: { $in: [date.getFullYear(), date.getFullYear() + 1] },
			})
				.populate({
					path: 'student',
					model: 'user',
					select: ['name', 'lastname', 'studentnumber'],
				})
				.populate({
					path: 'category',
					model: 'category',
				})
				.sort({ date: -1 });
		}

		if (enrollments.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron inscripciones con dichas descripciones',
			});
		}

		res.json(enrollments);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/enrollment/year
//@desc     get one enrollment
//@access   Private
router.get('/one/:id', [auth, adminAuth], async (req, res) => {
	try {
		let enrollment = await Enrollment.findOne({ _id: req.params.id })
			.populate({
				path: 'student',
				model: 'user',
				select: ['name', 'lastname', 'studentnumber'],
			})
			.populate({
				path: 'category',
				model: 'category',
			});

		if (!enrollment)
			return res.status(400).json({
				msg: 'No se encontraró una inscripción con dichas descripciones',
			});

		res.json(enrollment);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/enrollment/year
//@desc     get year's enrollments
//@access   Private
router.get('/year', [auth, adminAuth], async (req, res) => {
	try {
		const date = new Date();
		const year = date.getFullYear() + 1;
		let enrollments = await Enrollment.find({ year });
		if (enrollments.length === 0)
			enrollments = await Enrollment.find({ year: date.getFullYear() });

		let newEn = {
			length: '',
			year: '',
		};
		if (enrollments.length !== 0) {
			newEn = {
				length: enrollments.length,
				year: enrollments[0].year,
			};
		}
		res.json(newEn);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/enrollment
//@desc     Add an enrollment
//@access   Private
router.post(
	'/',
	[
		auth,
		adminAuth,
		check('student', 'El alumno es necesario').not().isEmpty(),
		check('year', 'El año es necesario').not().isEmpty(),
		check('category', 'La categoría es necesaria').not().isEmpty(),
	],
	async (req, res) => {
		const { student, year, category, currentMonth } = req.body;

		let errors = validationResult(req);
		errors = errors.array();
		let enrollment;

		try {
			enrollment = await Enrollment.findOne({ student, year });
			if (enrollment)
				errors.push({ msg: 'El alumno ya está inscripto para dicho año' });
			if (errors.length > 0) {
				return res.status(400).json({ errors });
			}

			let data = { student, year, category };

			enrollment = new Enrollment(data);

			await enrollment.save();

			let number = 0;
			let categoryInstallment = await Category.findOne({ name: 'Inscripción' });
			let installment;

			installment = new Installment({
				year,
				student,
				number,
				value: categoryInstallment.value,
				expired: false,
				enrollment: enrollment.id,
			});
			installment.save();

			categoryInstallment = await Category.findOne({ _id: category });

			const date = new Date();
			if (date.getFullYear() == year && date.getMonth() !== 3) {
				/* ESTO ESTA HARKODEADO PORQ NO ME FUNCIONA DATE!!! MUESTRA UN MES ATRAS */
				number = date.getMonth() + (currentMonth ? 1 : 2);
			} else {
				number = 3;
			}

			const amount = 13 - number;

			for (let x = 0; x < amount; x++) {
				let value = categoryInstallment.value;

				const studentfound = await User.findOne({ _id: student });
				if (
					studentfound.discount !== undefined &&
					studentfound.discount !== 0
				) {
					const disc =
						(categoryInstallment.value * studentfound.discount) / 100;
					value = Math.round((value - disc) / 10) * 10;
				}

				installment = new Installment({
					number,
					year,
					student,
					value,
					expired: false,
					enrollment: enrollment.id,
				});

				number++;

				await installment.save();
			}

			res.json(enrollment);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    POST api/enrollment/create-list
//@desc     Create a pdf of enrollment
//@access   Private
router.post('/create-list', (req, res) => {
	const name = 'Reports/enrollments.pdf';

	const enrollment = req.body;

	let htmlstring = '';

	for (let x = 0; x < enrollment.length; x++) {
		htmlstring =
			htmlstring +
			'<tr> <td>' +
			moment(enrollment[x].date).format('DD/MM/YY') +
			'</td>';
		htmlstring =
			htmlstring + '<td>' + enrollment[x].student.studentnumber + '</td>';
		htmlstring =
			htmlstring +
			'<td>' +
			enrollment[x].student.lastname +
			' ' +
			enrollment[x].student.name +
			'</td>';
		htmlstring = htmlstring + '<td>' + enrollment[x].category.name + '</td>';
		htmlstring = htmlstring + '<td>' + enrollment[x].year + '</td> </tr>';
	}

	//const dirname = __dirname.substring(0, __dirname.indexOf('routes'));

	//const base = 'file:///' + dirname;

	/* const base1 = 'file:///' + req.protocol + '://' + req.get('host');

	console.log(base1); */

	const options = {
		format: 'A4',
		//base: base1,
	};

	pdf.create(pdfTemplate(htmlstring), options).toFile(name, (err) => {
		if (err) {
			res.send(Promise.reject());
		}

		res.send(Promise.resolve());
	});
});

//@route    GET api/enrollment/fetch-list
//@desc     Get the pdf of enrollments
//@access   Private
router.get('/fetch-list', (req, res) => {
	const name = 'Reports/enrollments.pdf';

	const dir = __dirname.substring(0, __dirname.indexOf('routes'));

	res.sendFile(dir + name);
});

//@route    PUT api/enrollment/:id
//@desc     Update the category of the enrollment
//@access   Private
router.put(
	'/:id',
	[
		auth,
		adminAuth,
		check('category', 'La categoría es necesaria').not().isEmpty(),
	],
	async (req, res) => {
		const { year, category, currentMonth } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}
		let enrollment;

		try {
			enrollment = await Enrollment.findOne({ _id: req.params.id });

			if (enrollment._id.toString() !== category) {
				const date = new Date();

				if (date.getFullYear() != year) {
					return res.status(400).json({
						errors: [
							{
								msg:
									'No se puede modificar la categoría de una inscripción que no está en curso. Para ello elimine la anterior y vuelva a crearla',
							},
						],
					});
				}

				categoryInstallment = await Category.findOne({ _id: category });

				enrollment = await Enrollment.findOneAndUpdate(
					{ _id: req.params.id },
					{ category: category },
					{ new: true }
				)
					.populate({
						path: 'student',
						model: 'user',
						select: ['name', 'lastname', 'studentnumber'],
					})
					.populate({
						path: 'category',
						model: 'category',
					});

				/* ESTO ESTA HARKODEADO PORQ NO ME FUNCIONA DATE!!! MUESTRA UN MES ATRAS */
				let number = date.getMonth() + 1;

				if (!currentMonth) {
					number = number + 1;
				}

				const studentfound = await User.findOneAndUpdate(
					{
						_id: enrollment.student._id,
					},
					{ classroom: null },
					{ new: true }
				);

				let value = categoryInstallment.value;

				if (
					studentfound.discount !== undefined &&
					studentfound.discount !== 0
				) {
					const disc =
						(categoryInstallment.value * studentfound.discount) / 100;
					value = Math.round((value - disc) / 10) * 10;
				}

				const amount = 13 - number;
				for (let x = 0; x < amount; x++) {
					await Installment.findOneAndUpdate(
						{ enrollment: req.params.id, number, value: { $ne: 0 } },
						{ value }
					);
					number++;
				}
			} else {
				return res.status(400).json({ msg: 'La categoría debe ser distinta' });
			}

			res.json(enrollment);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    DELETE api/enrollment/:id
//@desc     Delete an enrollment
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		//Remove Enrollment
		const enrollment = await Enrollment.findOneAndRemove({
			_id: req.params.id,
		});
		const InstallmentsToRemove = await Installment.find({
			enrollment: req.params.id,
		});
		//Remove Installments
		for (const x in InstallmentsToRemove) {
			await Installment.findOneAndRemove({ _id: InstallmentsToRemove[x].id });
		}

		res.json({ msg: 'Enrollment and installments deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
