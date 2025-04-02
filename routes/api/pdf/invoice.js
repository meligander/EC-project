const router = require("express").Router();
const format = require("date-fns/format");
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/invoices.pdf");

const installmentName = [
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
   const { invoiceid, user: userPlain, date, details, total } = req.body;

   const user = userPlain.user_id ||
      userPlain || { lastname: "Usuario eliminado", name: "" };

   user.name = [user.lastname, user.name].filter(Boolean).join(", ");

   const isDiscounted = details.some((item) => item.discount !== undefined);

   let totalDiscount = 0;
   let totalPayed = 0;
   let invoiceTotal = 0;

   const body = details.map((item) => {
      const { installment, value, discount, payment } = item;

      const studentName = `${installment.student.lastname}, ${installment.student.name}`;
      const formattedSubTotal =
         "$" + formatNumber(discount ? value + discount : value);
      const formattedDiscount = discount ? "$" + formatNumber(discount) : "-";
      const formattedTotal = "$" + formatNumber(value);
      const formattedPayment = "$" + formatNumber(payment);

      totalDiscount += discount || 0;
      invoiceTotal += value;

      return isDiscounted
         ? [
              studentName,
              installmentName[installment.number],
              installment.year,
              formattedSubTotal,
              formattedDiscount,
              formattedTotal,
              formattedPayment,
           ]
         : [
              studentName,
              installmentName[item.installment.number],
              installment.year,
              formattedTotal,
              formattedPayment,
           ];
   });

   const remaining = invoiceTotal - total;

   try {
      await generatePDF(
         fileName,
         {
            body,
            user,
            invoiceid,
            date: format(new Date(date), "dd/MM/yy"),
            summary: details.length < 6,
            total: formatNumber(total),
            ...(remaining !== 0 && { remaining: formatNumber(remaining) }),
            ...(totalDiscount !== 0 && {
               discount: formatNumber(totalDiscount),
            }),
            spaces:
               remaining !== 0 && totalDiscount !== 0
                  ? 3
                  : remaining !== 0 || totalDiscount !== 0
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

   const { name, lastname } = user.user_id || user;

   return [lastname, name].filter(Boolean).join(", ");
};

//@desc Function to format a number
const formatNumber = (number) => {
   if (number || number !== 0)
      return new Intl.NumberFormat("de-DE").format(number);
   else return 0;
};

module.exports = router;
