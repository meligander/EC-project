const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/list");
const pdfTemplate2 = require("../../../templates/invoice");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/invoices.pdf");

const installment = [
   "Insc",
   "Clases Particulares",
   "Examen Libre",
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

//@route    GET /api/pdf/invoice/fetch
//@desc     Get the pdf of income
//@access   Private && Admin
router.get("/fetch", [auth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/invoice/list
//@desc     Create a pdf list of income
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const invoices = req.body;

   const total = invoices.reduce((accum, item) => accum + item.total, 0);

   const tbody = invoices
      .map(
         (item) => `<tr>
      <td>${format(new Date(item.date), "dd/MM/yy")}</td>
      <td>${item.invoiceid}</td>
      <td>${setName(item.user)}</td>
      <td>$${formatNumber(item.total)}</td>
   </tr>`
      )
      .join("");

   const thead =
      "<th>Fecha</th> <th>N° Factura</th> <th>Nombre</th> <th>Total</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title: "Ingresos",
            table: { thead, tbody },
            total: formatNumber(total),
         },
         "portrait",
         "Facturas",
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/invoice
//@desc     Create a pdf of an invoice
//@access   Private && Admin
router.post("/", [auth], (req, res) => {
   const { remaining, details, user, invoiceid, date, total } = req.body;

   const tbody = details
      .map(
         (item) => `<tr>
      <td>${item.installment.student.lastname}, ${
            item.installment.student.name
         }</td>
      <td>${installment[item.installment.number]}</td>
      <td>${item.installment.year}</td>
      <td>$${formatNumber(item.value)}</td>
      <td>$${formatNumber(item.payment)}</td>
   </tr>`
      )
      .join("");

   try {
      generatePDF(
         fileName,
         pdfTemplate2,
         "invoice",
         {
            info: {
               user,
               invoiceid: invoiceid,
               date: format(new Date(date), "dd/MM/yy"),
               total: formatNumber(total),
               remaining: formatNumber(remaining),
            },
            table: {
               tbody,
            },
         },
         "portrait",
         null,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to get the user name
const setName = (user) => {
   if (user.user_id === null) return "Usuario Eliminado";

   const lastname = user.user_id ? user.user_id.lastname : user.lastname;
   const name = user.user_id ? user.user_id.name : user.name;

   return `${lastname ? `${lastname}${name ? ", " : ""}` : ""}${
      name ? name : ""
   }`;
};

//@desc Function to format a number
const formatNumber = (number) => {
   if (number || number !== 0)
      return new Intl.NumberFormat("de-DE").format(number);
   else return 0;
};

module.exports = router;
