const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../config/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/registers.pdf");

//@route    GET /api/pdf/register/fetch
//@desc     Get the pdf of the list of registers
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/register/list
//@desc     Create a pdf of the list of registers
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const register = req.body;

   const tbody = register
      .map(
         (item) =>
            `<tr>
            <td>${
               item.temporary !== undefined
                  ? format(new Date(item.date), "dd/MM/yy")
                  : item.month
            }</td>
            <td>${item.income !== 0 ? `$${formatNumber(item.income)}` : ""}</td>
            <td>${
               item.expence !== 0 ? `$${formatNumber(item.expence)}` : ""
            }</td>
            <td>${
               item.cheatincome !== 0
                  ? `$${formatNumber(item.cheatincome)}`
                  : ""
            }</td>
            <td>${
               item.withdrawal !== 0 ? `$${formatNumber(item.withdrawal)}` : ""
            }</td>
            ${
               item.registermoney
                  ? `<td>$${formatNumber(item.registermoney)}</td>`
                  : ""
            }
            
            <td>${
               item.difference !== 0
                  ? `${item.difference > 0 ? "+" : "-"}$${formatNumber(
                       item.difference
                    )}`
                  : ""
            }</td>
            ${
               item.temporary !== undefined
                  ? `<td>${item.description ? item.description : ""}</td>`
                  : ""
            }
      </tr>`
      )
      .join("");

   let thead = "";

   if (register[0].temporary !== undefined)
      thead =
         "<th>Fecha</th> <th>Ingresos</th> <th>Egresos</th> <th>Otros Ing</th> <th>Retiro</th> <th>Plata Caja</th> <th>Diferencia</th> <th>Detalles</th>";
   else
      thead =
         "<th class='blank'></th> <th>Ingresos</th> <th>Egresos</th> <th>Otros Ing</th> <th>Retiro</th><th>Diferencia</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title:
               register[0].temporary !== undefined ? "Caja" : "Cajas Mensuales",
            table: { thead, tbody },
         },
         "landscape",
         "",
         res
      );
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
