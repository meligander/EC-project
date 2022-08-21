const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/enrollments.pdf");

//@route    POST /api/pdf/enrollment/list
//@desc     Create a pdf of enrollments
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   const head = ["Fecha", "Legajo", "Nombre", "Categoría", "Año"];

   const body = enrollments.map((item) => [
      format(new Date(item.date), "dd/MM/yy"),
      item.student.studentnumber,
      item.student.lastname + ", " + item.student.name,
      item.category.name,
      item.year,
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Inscripciones",
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
