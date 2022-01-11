const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");
const format = require("date-fns/format");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/transactions.pdf");

//@route    GET /api/pdf/expence/fetch
//@desc     Get the pdf of transactions
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/expence/list
//@desc     Create a pdf of transactions
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const transactions = req.body;

   let tbody = "";

   for (let x = 0; x < transactions.length; x++) {
      let userName = "";
      if (!transactions[x].expencetype) {
         switch (transactions[x].user) {
            case null:
               userName += "Usuario Eliminado </td>";
               break;
            case undefined:
               if (transactions[x].lastname) {
                  userName +=
                     transactions[x].lastname +
                     ", " +
                     transactions[x].name +
                     "</td>";
               } else {
                  userName += "Usuario no definido </td>";
               }
               break;
            default:
               userName +=
                  transactions[x].user.lastname +
                  ", " +
                  transactions[x].user.name +
                  "</td>";
               break;
         }
      }

      let typeName = "";
      if (transactions[x].expencetype) {
         switch (transactions[x].expencetype.type) {
            case "special-income":
               typeName = "Ingreso Especial";
               break;
            case "expence":
               typeName = "Gasto";
               break;
            case "withdrawal":
               typeName = "Retiro";
               break;
            default:
               break;
         }
      } else typeName = "Ingreso";

      const date =
         "<td>" + format(new Date(transactions[x].date), "dd/MM/yy") + "</td>";

      const type = "<td>" + typeName + "</td>";
      const value =
         "<td> $" +
         (transactions[x].expencetype
            ? formatNumber(transactions[x].value)
            : formatNumber(transactions[x].total)) +
         "</td>";
      const description =
         "<td>" +
         (!transactions[x].expencetype
            ? "Factura " + userName
            : `${transactions[x].expencetype.name} ${
                 transactions[x].description
                    ? "- " + transactions[x].description
                    : ""
              }`) +
         "</td>";

      tbody += "<tr>" + date + type + value + description + "</tr>";
   }

   const thead =
      "<th>Fecha</th> <th>Tipo</th> <th>Importe</th> <th>Descripción</th>";

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
      footer: {
         height: "17mm",
         contents:
            '<footer class="footer">Villa de Merlo English Center <span class="pages">{{page}}/{{pages}}</span></footer>',
      },
   };

   try {
      pdf.create(
         pdfTemplate(css, img, "movimientos", thead, tbody),
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

//@route    POST /api/pdf/expence/withdrawal-list
//@desc     Create a pdf of withdrawals
//@access   Private && Admin
router.post("/withdrawal-list", [auth, adminAuth], (req, res) => {
   const { transactions, total } = req.body;

   let tbody = "";

   for (let x = 0; x < transactions.length; x++) {
      const date =
         "<td>" + format(new Date(transactions[x].date), "dd/MM/yy") + "</td>";

      const type = "<td>" + transactions[x].expencetype.name + "</td>";
      const value = "<td> $" + formatNumber(transactions[x].value) + "</td>";
      const description =
         "<td>" +
         (transactions[x].description ? transactions[x].description : "") +
         "</td>";

      tbody += "<tr>" + date + type + value + description + "</tr>";
   }

   const thead =
      "<th>Fecha</th> <th>Tipo</th> <th>Importe</th> <th>Descripción</th>";

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
            "Retiros - $" + formatNumber(total),
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
