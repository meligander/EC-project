const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/categories.pdf");

//@route    POST api/pdf/category/list
//@desc     Create a pdf of categories
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const category = req.body;

   const head = ["Nombre", "Valor", "Dto Hnos", "Marzo", "Dto Marzo"];

   const body = category.map((item, index) => [
      item.name,
      "$" + formatNumber(item.value),
      index === 0 ? "-" : "$" + formatNumber(item.value * 0.9),
      index === 0 ? "-" : "$" + formatNumber(item.value / 2),
      index === 0 ? "-" : "$" + formatNumber((item.value / 2) * 0.9),
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Categorías",
            small: true,
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

const formatNumber = (value) =>
   new Intl.NumberFormat("de-DE").format(
      Math.ceil((value + Number.EPSILON) / 10) * 10
   );

module.exports = router;
