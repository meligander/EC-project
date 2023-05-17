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
   const { categories, discount } = req.body;

   const type = req.query.type;

   const head = ["Nombre", "Valor", "Dto Hnos", "Ctdo", "Ctdo c/ Dto"];

   const newDiscount = 1 - discount / 100;

   const body = categories.map((item, index) => {
      const value = type !== "march" ? item.value : item.value / 2;
      const brotherDisc = Math.ceil((value * 0.9 + Number.EPSILON) / 100) * 100;

      if (index !== 0 || (index === 0 && type !== "march"))
         return [
            item.name,
            "$" + formatNumber(value),
            index === 0 ? "-" : "$" + formatNumber(brotherDisc),
            "$" +
               formatNumber(
                  //Descuento efectivo
                  value * newDiscount
               ),
            index === 0 ? "-" : "$" + formatNumber(brotherDisc * newDiscount),
         ];
   });

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
