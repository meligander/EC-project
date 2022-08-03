const router = require("express").Router();

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Observation = require("../../models/Observation");
const Enrollment = require("../../models/Enrollment");

//@route    GET /api/observation/:class_id
//@desc     get all observations from a class
//@access   Private && Admin
router.get("/:class_id", auth, async (req, res) => {
   try {
      const class_id = req.params.class_id;

      const observations = await Observation.find({
         classroom: class_id,
      }).sort({ period: 1 });

      const table = await buildTable(observations, class_id);

      res.json(table);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/observation/:class_id/:user_id
//@desc     get the observations for a student
//@access   Private
router.get("/:class_id/:user_id", auth, async (req, res) => {
   try {
      const { class_id: classroom, user_id } = req.params;

      const observations = await Observation.find({
         student: user_id,
         classroom,
      }).sort({ period: 1 });

      if (observations.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron tipo de notas con esas características",
         });
      }

      res.json(observations);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    PUT /api/observation
//@desc     Update all observations from a class
//@access   Private && Admin
router.put("/:class_id/:period", auth, async (req, res) => {
   //An array of expence types
   const observations = req.body.flat().map((item) => item.observation);

   const { class_id: classroom, period } = req.params;

   try {
      for (let x = 0; x < observations.length; x++) {
         let _id = observations[x]._id;
         let data = {
            period,
            classroom,
            student: observations[x].student,
            description: observations[x].description,
         };

         if (data.description === "") {
            if (_id !== 0) await Observation.findOneAndRemove({ _id });
         } else {
            if (_id === 0) {
               data = new Observation(data);
               data.save();
            } else
               data = await Observation.findOneAndUpdate(
                  { _id },
                  { $set: data },
                  { new: true }
               );
         }
      }

      res.json({ msg: "Observations Updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to create the table to show on the front-end
const buildTable = async (observations, classroom) => {
   let enrollments = await Enrollment.find({ classroom }).populate({
      model: "user",
      path: "student",
      select: ["name", "lastname", "dni"],
   });
   enrollments = sortByName(enrollments);

   // [[{},{}],[{},{}],[{},{}],[{},{}],[{},{}]]
   let rows = Array.from(Array(5), () =>
      enrollments.map((item) => {
         return {
            ...item.student.toJSON(),
            observation: {
               _id: 0,
               description: "",
               student: item.student._id,
               classroom,
            },
         };
      })
   );
   for (let x = 0; x < observations.length; x++) {
      const period = observations[x].period - 1;

      const index = rows[period].findIndex(
         (item) => item._id.toString() === observations[x].student.toString()
      );

      if (index !== -1) rows[period][index].observation = observations[x];
   }

   return rows;
};

//@desc Function to sort and array by name
const sortByName = (array) => {
   return array.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;
   });
};

module.exports = router;
