const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');
const { check, validationResult } = require('express-validator');

const GradeType = require('../../models/GradeType');
const Category = require('../../models/Category');

//@route    GET api/grade-type
//@desc     get all grade types
//@access   Private
router.get('/', [auth, adminAuth], async (req, res) => {
	try {
		let gradetypes = await GradeType.find();

		if (gradetypes.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron tipo de notas con esas características',
			});
		}

		const tableGrades = await buildTable(gradetypes);

		res.json(tableGrades);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/grade-type/category/:id
//@desc     get all grade types || by categories
//@access   Private
router.get('/category/:id', [auth], async (req, res) => {
	try {
		let gradetypes = await GradeType.find({
			'categories.category': req.params.id,
		});

		if (gradetypes.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron tipo de notas con esas características',
			});
		}

		res.json(gradetypes);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    GET api/grade-type/:id
//@desc     get a grade type and category info
//@access   Private
router.get('/:id', [auth, adminAuth], async (req, res) => {
	try {
		const gradetype = await GradeType.findOne({ _id: req.params.id }).populate({
			path: 'categories.category',
			model: 'category',
		});

		if (!gradetype) {
			return res.status(400).json({
				msg: 'No se encontró un tipo de notas con esas características',
			});
		}

		res.json(gradetype);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/grade-type/one
//@desc     Add a grade type
//@access   Private
router.post(
	'/one',
	[auth, adminAuth, check('name', 'El nombre es necesario').not().isEmpty()],
	async (req, res) => {
		const { name, categories } = req.body;
		let gradetype;

		let errors = validationResult(req);
		if (!errors.isEmpty()) {
			errors = errors.array();
			return res.status(400).json({ errors });
		}

		try {
			let data = { name, categories };

			const gradetype = new GradeType(data);

			await gradetype.save();

			res.json(gradetype);
		} catch (err) {
			console.error(err.message);
			return res.status(500).send('Server Error');
		}
	}
);

//@route    POST api/grade-type
//@desc     Update all grade types
//@access   Private
router.post('/', [auth, adminAuth], async (req, res) => {
	//An array of expence types
	const gradeTypes = req.body;
	let gradeType;
	let newGradeTypes = [];
	let rebuiltGradeTypes = [];
	let errors = [];

	for (let x = 0; x < gradeTypes.length; x++) {
		gradeType = {
			_id: '',
			name: '',
			categories: [],
		};
		for (let y = 0; y < gradeTypes[x].length; y++) {
			if (y === 0) {
				if (gradeTypes[x][y].name === '')
					errors.push({ msg: 'El nombre debe estar definido' });
				else {
					gradeType._id = gradeTypes[x][y]._id;
					gradeType.name = gradeTypes[x][y].name;
				}
			} else {
				if (gradeTypes[x][y].checks) {
					gradeType.categories.push({ category: gradeTypes[x][y].category });
				}
			}
			if (errors.length > 0) return res.status(400).json({ errors });
		}
		rebuiltGradeTypes.push(gradeType);
	}

	try {
		let oldGradeTypes = await GradeType.find();

		for (let x = 0; x < rebuiltGradeTypes.length; x++) {
			let id = rebuiltGradeTypes[x]._id;
			let name = rebuiltGradeTypes[x].name;
			let categories = rebuiltGradeTypes[x].categories;

			if (id === '') {
				gradeType = new GradeType({ name, categories });

				await gradeType.save();
			} else {
				gradeType = await GradeType.findOneAndUpdate(
					{ _id: id },
					{ $set: { name, categories } },
					{ new: true }
				);
				for (let y = 0; y < oldGradeTypes.length; y++) {
					if (oldGradeTypes[y]._id.toString() === id) {
						oldGradeTypes.splice(y, 1);
						break;
					}
				}
			}
			newGradeTypes.push(gradeType);
		}

		for (let x = 0; x < oldGradeTypes.length; x++) {
			await GradeType.findOneAndRemove({ _id: oldGradeTypes[x]._id });
		}

		const tableGrades = await buildTable(newGradeTypes);

		res.json(tableGrades);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    DELETE api/grade-type/:id
//@desc     Delete a grade type
//@access   Private
router.delete('/:id', [auth, adminAuth], async (req, res) => {
	try {
		//Remove Town
		await GradeType.findOneAndRemove({ _id: req.params.id });

		res.json({ msg: 'Grade Type deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

async function buildTable(gradetypes) {
	let categories = [];
	try {
		categories = await Category.find();
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}

	const header = [
		'K',
		'IC',
		'IB',
		'IA',
		'P',
		'J',
		'1°',
		'2°',
		'3°',
		'4°',
		'5°',
		'6°',
		'C',
		'Pf',
	];

	let rows = [];

	for (let x = 0; x < gradetypes.length; x++) {
		let row = new Array(categories.length);
		row[0] = { _id: gradetypes[x]._id, name: gradetypes[x].name };

		let gradetypeNumber = 0;
		for (let y = 1; y < categories.length; y++) {
			let obj = {
				category: categories[y]._id,
				checks: false,
			};

			if (gradetypes[x].categories[gradetypeNumber]) {
				if (
					gradetypes[x].categories[gradetypeNumber].category.toString() ===
					categories[y]._id.toString()
				) {
					obj.checks = true;
					gradetypeNumber++;
				}
			}
			row[y] = obj;
		}
		rows.push(row);
	}
	return { header, rows };
}

module.exports = router;
