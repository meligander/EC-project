const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

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

//@route    POST /api/pdf/invoice/list
//@desc     Create a pdf list of income
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const invoices = req.body;

   const head = ["Fecha", "N° Factura", "Nombre", "Total"];

   const body = invoices.map((item) => [
      format(new Date(item.date), "dd/MM/yy"),
      item.invoiceid,
      setName(item.user),
      "$" + formatNumber(item.total),
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Ingresos",
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/invoice
//@desc     Create a pdf of an invoice
//@access   Private && Admin
router.post("/", [auth], async (req, res) => {
   const { remaining, discount, details, user, invoiceid, date, total } =
      req.body;

   const body = details.map((item) => {
      if (discount !== 0)
         return [
            `${item.installment.student.lastname}, ${item.installment.student.name}`,
            installment[item.installment.number],
            item.installment.year,
            "$" +
               formatNumber(
                  item.discount ? item.value + item.discount : item.value
               ),
            item.discount ? "$" + formatNumber(item.discount) : "-",
            "$" + formatNumber(item.value),
            "$" + formatNumber(item.payment),
         ];
      else
         return [
            `${item.installment.student.lastname}, ${item.installment.student.name}`,
            installment[item.installment.number],
            item.installment.year,
            "$" + formatNumber(item.value),
            "$" + formatNumber(item.payment),
         ];
   });

   try {
      await generatePDF(
         fileName,
         {
            body,
            user,
            invoiceid,
            date: format(new Date(date), "dd/MM/yy"),
            total: formatNumber(total),
            ...(remaining !== 0 && { remaining: formatNumber(remaining) }),
            ...(discount !== 0 && { discount: formatNumber(discount) }),
            spaces:
               remaining !== 0 && discount !== 0
                  ? 3
                  : remaining !== 0 || discount !== 0
                  ? 2
                  : 1,
         },
         { type: "invoice", img: "logo", margin: false, landscape: false }
      );
      res.sendFile(fileName);
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
