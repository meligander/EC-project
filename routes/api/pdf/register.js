const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");
const format = require("date-fns/format");

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

   let tbody = "";

   for (let x = 0; x < register.length; x++) {
      if (register[x].temporary) continue;

      const income =
         "<td>" +
         (register[x].income ? " $" + register[x].income : "") +
         "</td>";
      const expence =
         "<td>" +
         (register[x].expence ? " $" + register[x].expence : "") +
         "</td>";
      const cheatincome =
         "<td>" +
         (register[x].cheatincome ? " $" + register[x].cheatincome : "") +
         "</td>";
      const withdrawal =
         "<td>" +
         (register[x].withdrawal ? " $" + register[x].withdrawal : "") +
         "</td>";
      const diference =
         "<td>" +
         (register[x].difference !== 0 && register[x].difference
            ? register[x].negative
               ? "-$" + register[x].difference
               : "+$" + register[x].difference
            : "") +
         "</td>";
      if (register[x].temporary !== undefined) {
         const date =
            "<td>" + format(new Date(register[x].date), "dd/MM/yy") + "</td>";
         const registermoney = "<td> $" + register[x].registermoney + "</td>";

         const description =
            "<td>" +
            (register[x].description ? register[x].description : "") +
            "</td>";

         tbody +=
            "<tr>" +
            date +
            income +
            expence +
            cheatincome +
            withdrawal +
            registermoney +
            diference +
            description +
            "</tr>";
      } else {
         const month = "<th>" + register[x].month + "</th>";
         tbody +=
            "<tr>" +
            month +
            income +
            expence +
            cheatincome +
            withdrawal +
            diference +
            "</tr>";
      }
   }

   let thead = "";

   if (register[0].temporary !== undefined)
      thead =
         "<th>Fecha</th> <th>Ingresos</th> <th>Egresos</th> <th>Otros Ing</th> <th>Retiro</th> <th>Plata Caja</th> <th>Diferencia</th> <th>Detalles</th>";
   else
      thead =
         "<th class='blank'></th> <th>Ingresos</th> <th>Egresos</th> <th>Otros Ing</th> <th>Retiro</th><th>Diferencia</th>";

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/list/style.css"
   );

   const options = {
      format: "A4",
      header: {
         height: "15mm",
         contents: `<div></div>`,
      },
      ...(register[0].temporary !== undefined && { orientation: "landscape" }),
      footer: {
         height: "17mm",
         contents:
            '<footer class="footer">Villa de Merlo English Center <span class="pages">{{page}}/{{pages}}</span></footer>',
      },
   };

   try {
      pdf.create(
         pdfTemplate(
            css,
            img,
            register[0].temporary !== undefined ? "caja" : "cajas mensuales",
            thead,
            tbody
         ),
         options
      ).toFile(fileName, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
