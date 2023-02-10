const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/dailies.pdf");

//@route    POST api/pdf/dailies/list
//@desc     Create a pdf of categories
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const dailies = req.body;

   const head = [
      "Fecha",
      "En Caja",
      "Negra",
      "Rosa",
      "Casa",
      "Cuenta",
      "Cambio",
      "Diferencia",
   ];

   const body = dailies.map((item, index) => [
      format(new Date(item.date), "dd/MM/yy"),
      "$" + formatNumber(item.register.registermoney),
      "$" + formatNumber(item.box),
      item.envelope ? "$" + formatNumber(item.envelope) : "",
      item.home ? "$" + formatNumber(item.home) : "",
      item.bank ? "$" + formatNumber(item.bank) : "",
      item.change ? "$" + formatNumber(item.change) : "",
      item.difference ? "$" + formatNumber(item.difference) : "",
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Cierres de Caja",
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
