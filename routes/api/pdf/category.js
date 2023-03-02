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

   const type = req.query.type;

   const head = ["Nombre", "Valor", "Dto Hnos", "Ctdo", "Ctdo c/ Dto"];

   const body = category.map(
      (item, index) =>
         (index !== 0 || (index === 0 && type !== "march")) && [
            item.name,
            "$" + formatNumber(type !== "march" ? item.value : item.value / 2),
            index === 0
               ? "-"
               : "$" +
                 formatNumber(
                    //Descuento efectivo
                    (type !== "march" ? item.value : item.value / 2) * 0.9
                 ),
            "$" +
               formatNumber(
                  //Descuento efectivo
                  (type !== "march" ? item.value : item.value / 2) * 0.93
               ),
            index === 0
               ? "-"
               : "$" +
                 formatNumber(
                    //Descuento efectivo
                    (type !== "march" ? item.value : item.value / 2) *
                       0.9 *
                       0.93
                 ),
         ]
   );

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Categorías" + (type === "march" ? " (Marzo)" : ""),
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
      Math.ceil((value + Number.EPSILON) / 100) * 100
   );

module.exports = router;
