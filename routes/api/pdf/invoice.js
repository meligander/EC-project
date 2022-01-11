const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");
const pdf = require("html-pdf");

//PDF Templates
const pdfTemplate = require("../../../templates/list");
const pdfTemplate2 = require("../../../templates/invoice");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/invoices.pdf");

//@route    GET /api/pdf/invoice/fetch
//@desc     Get the pdf of income
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/invoice/list
//@desc     Create a pdf list of income
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const invoices = req.body;

   let tbody = "";

   for (let x = 0; x < invoices.length; x++) {
      const date =
         " <td>" + format(new Date(invoices[x].date), "dd/MM/yy") + "</td>";
      const id = "<td>" + invoices[x].invoiceid + "</td>";

      let userName = "<td>";
      switch (invoices[x].user) {
         case null:
            userName += "Usuario Eliminado </td>";
            break;
         case undefined:
            if (invoices[x].lastname) {
               userName +=
                  invoices[x].lastname + ", " + invoices[x].name + "</td>";
            } else {
               userName += "Usuario no definido </td>";
            }
            break;
         default:
            userName +=
               invoices[x].user.lastname +
               ", " +
               invoices[x].user.name +
               "</td>";
            break;
      }
      const total = "<td> $" + formatNumber(invoices[x].total) + "</td>";

      tbody += "<tr>" + date + id + userName + total + "</tr>";
   }

   const thead =
      "<th>Fecha</th> <th>N° Factura</th> <th>Nombre</th> <th>Total</th>";
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
         pdfTemplate(css, img, "ingresos", thead, tbody),
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

//@route    POST /api/pdf/invoice/invoice
//@desc     Create a pdf of an invoice
//@access   Private && Admin
router.post("/invoice", [auth, adminAuth], (req, res) => {
   const { remaining, details, user, invoiceid, date, total } = req.body;
   const { _id, email, name, lastname } = user;

   let tbody = "";

   const installment = [
      "Insc",
      "",
      "",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Agto",
      "Sept",
      "Oct",
      "Nov",
      "Dic",
   ];

   for (let x = 0; x < details.length; x++) {
      const userName = `<td> ${details[x].installment.student.lastname}, 
       ${details[x].installment.student.name} </td>`;
      const instName = `<td> ${
         installment[details[x].installment.number]
      }</td>`;
      const year = `<td>${details[x].installment.year}</td>`;

      const value = `<td> $${formatNumber(details[x].value)} </td>`;
      const payment = `<td> $${formatNumber(details[x].payment)} </td>`;
      tbody += "<tr>" + userName + instName + year + value + payment + "</tr>";
   }

   let userName = "";
   let userEmail = "";

   if ((name && name !== "") || (lastname && lastname !== "")) {
      userName = lastname + ", " + name;
      userEmail = email;
   } else {
      if (_id === null) userName = "Usuario Eliminado";
      else {
         userName = _id.lastname + ", " + _id.name;
         userEmail = _id.email ? _id.email : "";
      }
   }

   const invoiceDetails = {
      user: userName,
      email: userEmail,
      cel: user._id ? (user._id.cel ? user._id.cel : "") : "",
      invoiceid: invoiceid,
      date: format(new Date(date), "dd/MM/yy"),
      total: formatNumber(total),
      remaining: formatNumber(remaining),
   };

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/invoice/style.css"
   );

   const options = {
      format: "A4",
   };

   try {
      pdf.create(pdfTemplate2(css, img, tbody, invoiceDetails), options).toFile(
         fileName,
         (err) => {
            if (err) res.send(Promise.reject());
            else res.send(Promise.resolve());
         }
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
