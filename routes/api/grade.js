const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Grade = require('../../models/Grade');
const User = require('../../models/User');

//@route    GET api/grade/:class_id
//@desc     Get all grades for a class
//@access   Private
router.get('/:class_id', [auth], async (req, res) => {
	try {
		const grades = await Grade.find({
			classroom: req.params.class_id,
		})
			.populate({
				path: 'student',
				model: 'user',
				select: ['name', 'lastname'],
				option: { sort: { lastname: -1, name: -1 } },
			})
			.populate({
				path: 'gradetype',
				model: 'gradetypes',
				select: 'name',
			});

		if (grades.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron notas con dichas descripciones',
			});
		}

		const tableGrades = await buildTable(grades, req.params.class_id, res);

		res.json(tableGrades);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route    GET api/grade/user/:id
//@desc     Get all grades for a user
//@access   Private
router.get('/user/:id', [auth], async (req, res) => {
	try {
		const date = new Date();
		const start = new Date(date.getFullYear(), 01, 01);
		const end = new Date(date.getFullYear(), 12, 31);
		const grades = await Grade.find({
			student: req.params.id,
			date: {
				$gte: start,
				$lt: end,
			},
		})
			.populate({
				path: 'gradetype',
				model: 'gradetypes',
				select: 'name',
			})
			.sort({ gradetype: 1 });

		if (grades.length === 0) {
			return res.status(400).json({
				msg: 'No se encontraron notas con dichas descripciones',
			});
		}

		let obj = grades.reduce((res, curr) => {
			if (res[curr.gradetype.name]) res[curr.gradetype.name].push(curr);
			else Object.assign(res, { [curr.gradetype.name]: [curr] });

			return res;
		}, {});

		let rows = [];
		let headers = Object.getOwnPropertyNames(obj);

		for (const x in obj) {
			const dividedGrades = obj[x];
			let row = Array.from(Array(5), () => ({
				value: '',
			}));
			for (let x = 0; x < dividedGrades.length; x++) {
				row[dividedGrades[x].period - 1] = dividedGrades[x];
			}
			rows.push(row);
		}

		res.json({ headers, rows });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route    POST api/grades
//@desc     Add a grade
//@access   Private
router.post('/', auth, async (req, res) => {
	const { student, period, classroom, gradetype, value } = req.body;
	const data = { student, period, classroom, gradetype, value };
	let grade;

	try {
		grade = new Grade(data);

		await grade.save();

		const grades = await Grade.find({
			classroom,
		})
			.populate({
				path: 'student',
				model: 'user',
				select: ['name', 'lastname'],
				option: { sort: { lastname: -1, name: -1 } },
			})
			.populate({
				path: 'gradetype',
				model: 'gradetypes',
				select: 'name',
			});

		const tableGrades = await buildTable(grades, classroom, res);

		res.json(tableGrades);
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    POST api/grade/period
//@desc     Add or remove grades from a period
//@access   Private
router.post('/period', auth, async (req, res) => {
	const rows = req.body;
	let data;
	let grade;
	try {
		for (let x = 0; x < rows.length - 1; x++) {
			for (let y = 0; y < rows[x].length; y++) {
				const filter = {
					student:
						rows[x][y].student._id !== undefined
							? rows[x][y].student._id
							: rows[x][y].student,
					gradetype:
						rows[x][y].gradetype._id !== undefined
							? rows[x][y].gradetype._id
							: rows[x][y].gradetype,
					classroom: rows[x][y].classroom,
					period: rows[x][y].period,
				};
				if (rows[x][y].value !== 0 && rows[x][y].value !== '') {
					let roundValue;
					if (rows[x][y].value > 10 || rows[x][y].value < 0) {
						return res
							.status(400)
							.json({ errors: [{ msg: 'La nota debe ser entre 0 y 10' }] });
					}
					roundValue = Math.floor(rows[x][y].value * 100) / 100;

					grade = await Grade.findOneAndUpdate(filter, {
						value: roundValue,
					});

					if (!grade) {
						data = {
							...filter,
							value: roundValue,
						};
						const newGrade = new Grade(data);

						newGrade.save();
					}
				} else {
					await Grade.findOneAndRemove({
						filter,
					});
				}
			}
		}

		res.json({ msg: 'Grades Updated' });
	} catch (err) {
		console.error(err.message);
		return res.status(500).send('Server Error');
	}
});

//@route    DELETE api/grade/:id
//@desc     Delete a grade
//@access   Private
router.delete('/:id', auth, async (req, res) => {
	try {
		//Remove grade
		await Grade.findOneAndRemove({ _id: req.params.id });

		res.json({ msg: 'Grade deleted' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//@route    DELETE api/grade/:type/:classroom/:period
//@desc     Delete grades of the same type
//@access   Private
router.delete('/:type/:classroom/:period', auth, async (req, res) => {
	try {
		//Remove grades
		const gradesToDelete = await Grade.find({
			gradetype: req.params.type,
			classroom: req.params.classroom,
			period: req.params.period,
		});

		for (let x = 0; x < gradesToDelete.length; x++) {
			await Grade.findOneAndRemove({ _id: gradesToDelete[x].id });
		}
		const grades = await Grade.find({
			classroom: req.params.classroom,
		})
			.populate({
				path: 'student',
				model: 'user',
				select: ['name', 'lastname'],
				option: { sort: { lastname: -1, name: -1 } },
			})
			.populate({
				path: 'gradetype',
				model: 'gradetypes',
				select: 'name',
			});

		const tableGrades = await buildTable(grades, req.params.classroom, res);

		res.json(tableGrades);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

async function buildTable(grades, class_id, res) {
	let users = [];
	try {
		users = await User.find({
			type: 'Alumno',
			classroom: class_id,
		}).sort({ lastname: 1, name: 1 });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}

	let header1 = [];
	let header2 = users.map((user) => {
		return user.lastname + ' ' + user.name;
	});
	header2 = [...header2, ''];

	let rowsP = [];
	let periods = grades.reduce((res, curr) => {
		if (res[curr.period]) res[curr.period].push(curr);
		else Object.assign(res, { [curr.period]: [curr] });

		return res;
	}, {});

	for (const x in periods) {
		let count = 0;
		let gradeType = periods[x].reduce((res, curr) => {
			if (res[curr.gradetype.name]) res[curr.gradetype.name].push(curr);
			else Object.assign(res, { [curr.gradetype.name]: [curr] });

			return res;
		}, {});

		header1.push(Object.getOwnPropertyNames(gradeType));

		let students = periods[x].reduce((res, curr) => {
			if (curr.student !== null && curr.student !== undefined) {
				if (res[curr.student._id]) res[curr.student._id].push(curr);
				else Object.assign(res, { [curr.student._id]: [curr] });
			}
			return res;
		}, {});

		const gradesNumber = Object.keys(gradeType).length;

		let studentsArray = Object.keys(students).map((i) => students[i]);

		let rows = [];
		let studentNumber = 0;
		for (let z = 0; z < users.length + 1; z++) {
			let rowNumber = 0;
			let row = Array.from(Array(gradesNumber), () => ({
				_id: '',
				classroom: class_id,
				period: x,
				value: '',
			}));
			for (const index in gradeType) {
				row[rowNumber].gradetype = gradeType[index][0].gradetype._id;
				row[rowNumber].name = 'input' + count;
				if (users[z] !== undefined) {
					row[rowNumber].student = users[z]._id;
					let added = false;
					if (studentsArray[studentNumber] !== undefined) {
						if (
							studentsArray[studentNumber][0].student._id.toString() ===
							users[z]._id.toString()
						) {
							for (let y = 0; y < studentsArray[studentNumber].length; y++) {
								if (studentsArray[studentNumber][y].gradetype.name === index) {
									row[rowNumber] = {
										_id: studentsArray[studentNumber][y]._id,
										student: studentsArray[studentNumber][y].student._id,
										period: studentsArray[studentNumber][y].period,
										classroom: studentsArray[studentNumber][y].classroom,
										gradetype: studentsArray[studentNumber][y].gradetype._id,
										value: studentsArray[studentNumber][y].value,
										name: 'input' + count,
									};
									count++;
									added = true;
									break;
								}
							}
						}
					}
					if (!added) count++;
				}
				rowNumber++;
			}

			if (
				users[z] !== undefined &&
				studentsArray[studentNumber] !== undefined
			) {
				if (
					users[z]._id.toString() ===
					studentsArray[studentNumber][0].student._id.toString()
				) {
					studentNumber++;
				}
			}
			rows.push(row);
		}
		rowsP.push({ period: x, rows });
	}

	return { header: { header1, header2 }, periods: rowsP };
}

module.exports = router;
