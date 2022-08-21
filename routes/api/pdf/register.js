const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/registers.pdf");

//@route    POST /api/pdf/register/list
//@desc     Create a pdf of the list of registers
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const register = req.body;

   const head =
      register[0].temporary !== undefined
         ? [
              "Fecha",
              "Ingresos",
              "Egresos",
              "Retiro",
              "Plata Caja",
              "Diferencia",
              "Detalles",
           ]
         : ["", "Ingresos", "Egresos", "Retiro", "Diferencia"];

   const body = register.map((item) => {
      let array = [
         item.temporary !== undefined
            ? format(new Date(item.date), "dd/MM/yy")
            : item.month,
         item.income !== 0 ? "$" + formatNumber(item.income) : "",
         item.expence !== 0 ? "$" + formatNumber(item.expence) : "",
         item.withdrawal !== 0 ? "$" + formatNumber(item.withdrawal) : "",
         ,
      ];

      if (item.temporary !== undefined)
         array = array.concat([
            item.registermoney ? "$" + formatNumber(item.registermoney) : "",
            item.difference !== 0
               ? `${item.difference > 0 ? "+" : "-"}$${formatNumber(
                    item.difference
                 )}`
               : "",
            item.description ? item.description : "",
         ]);
      else
         array.push(
            item.difference !== 0
               ? `${item.difference > 0 ? "+" : "-"}$${formatNumber(
                    item.difference
                 )}`
               : ""
         );
      return array;
   });

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title:
               register[0].temporary !== undefined ? "Caja" : "Cajas Mensuales",
            blank: register[0].temporary === undefined,
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
      return new Intl.NumberFormat("de-DE").format(Math.abs(number));
   else return 0;
};

module.exports = router;
