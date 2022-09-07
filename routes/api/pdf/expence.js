const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/expences.pdf");

//@route    POST /api/pdf/expence/list
//@desc     Create a pdf of expences
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const { expences, total } = req.body;

   const head = ["Fecha", "Tipo", "Descripción", "Importe"];

   const body = expences.map((item) => [
      format(new Date(item.date), "dd/MM/yy"),
      item.expencetype.name,
      item.description ? item.description : "",
      "$" + formatNumber(item.value),
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: total ? "Retiros" : "Egresos",
            ...(total && { total: formatNumber(total) }),
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/expence/withdrawal
//@desc     Create a pdf of withdrawals in a year
//@access   Private && Admin
router.post("/withdrawal", [auth, adminAuth], async (req, res) => {
   const { expences } = req.body;

   const head = [
      "",
      ...Object.keys(expences[0]).filter((item) => item !== "month"),
   ];

   const body = expences.map((trans) =>
      Object.keys(trans).map((item, index) =>
         index === 0
            ? trans[item]
            : trans[item] === 0
            ? "-"
            : "$" + formatNumber(trans[item])
      )
   );

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Retiros",
            blank: true,
            firstth: true,
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

//@desc Function to format a number
const formatNumber = (number) => {
   if (number || number !== 0)
      return new Intl.NumberFormat("de-DE").format(number);
   else return 0;
};

module.exports = router;
