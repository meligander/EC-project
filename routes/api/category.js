const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

const Category = require('../../models/Category');
const Installment = require('../../models/Installment');
const Enrollment = require('../../models/Enrollment');

//@route    GET api/category
//@desc     get all categories
//@access   Private
router.get('/', [auth], async (req, res) => {
	try {
		let categories = await Category.find();

		if (categories.length === 0) {
			return res
				.status(400)
				.json({ msg: 'No se encontraron categorías con dichas descripciones' });
		}

		res.json(categories);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/category
//@desc     Add a category
//@access   Private
router.post(
	'/',
	[auth, adminAuth, check('name', 'El nombre es necesario').not().isEmpty()],
	async (req, res) => {
		const { name, value } = req.body;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let data = { name, value };

			let category = new Category(data);

			await category.save();

			res.json(category);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    PUT api/category/:id_category
//@desc     Update a category
//@access   Private
router.put('/:id_category', [auth, adminAuth], async (req, res) => {
	const { value } = req.body;

	try {
		const category = await Category.findOneAndUpdate(
			{ _id: req.params.id_category },
			{ $set: { value } },
			{ new: true }
		);

		res.json(category);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    PUT api/category
//@desc     Update all categories
//@access   Private
router.put(
	'/',
	[
		auth,
		adminAuth,
		check('month', 'El mes de actualización es necesario').not().isEmpty(),
	],
	async (req, res) => {
		//An array of categories
		const { categories, month } = req.body;
		const date = new Date();
		const year = date.getFullYear();
		let newCategories = [];

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}
		try {
			for (let x = 0; x < categories.length; x++) {
				let value = categories[x].value;
				let category = await Category.findOneAndUpdate(
					{ _id: categories[x]._id },
					{ value },
					{ new: true }
				);
				newCategories.push(category);

				const enrollments = await Enrollment.find({
					year: { $in: [year, year + 1] },
					category: categories[x]._id,
				});

				for (let y = 0; y < enrollments.length; y++) {
					const installments = await Installment.find({
						student: enrollments[y].student,
						...(enrollments[y].year.toString() === year && {
							number: { $gte: month },
						}),
						year,
					}).populate({ path: 'student', select: '-password' });
					for (let z = 0; z < installments.length; z++) {
						let newValue =
							value - (value * installments[z].student.discount) / 100;
						await Installment.findOneAndUpdate(
							{ _id: installments[z]._id },
							{ value: installments[z].number === 0 ? value : newValue }
						);
					}
				}
			}

			res.json(newCategories);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    DELETE api/category/:id
//@desc     Delete a category
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		//Remove Category
		await Category.findOneAndRemove({ _id: req.params.id });

		res.json({ msg: 'Category deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
