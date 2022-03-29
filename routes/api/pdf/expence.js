const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

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

   const tbody = transactions
      .map(
         (item) => `<tr>
      <td>${format(new Date(item.date), "dd/MM/yy")}</td>
      ${
         item.expencetype
            ? `<td>${getType(item.expencetype.type)}</td>
               <td>${formatNumber(item.value)}</td>
               <td>${item.expencetype.name}${
                 item.description ? "" + item.description : ""
              }</td>`
            : `<td>Ingreso</td>
               <td>${formatNumber(item.total)}</td>
               <td>Factura ${setName(item.user)}</td>`
      }
   </tr>`
      )
      .join("");

   const thead =
      "<th>Fecha</th> <th>Tipo</th> <th>Importe</th> <th>Descripción</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title: "Trasacciones",
            table: { thead, tbody },
         },
         "portrait",
         "Transacciones",
         res
      );
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

   const tbody = transactions
      .map(
         (item) => `<tr>
      <td>${format(new Date(item.date), "dd/MM/yy")}</td>
      <td>${item.expencetype.name}</td>
      <td>$${formatNumber(item.value)}</td>
      <td>${item.description ? item.description : ""}</td>
   </tr>`
      )
      .join("");

   const thead =
      "<th>Fecha</th> <th>Tipo</th> <th>Importe</th> <th>Descripción</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title: "Retiros",
            table: { thead, tbody },
            total: formatNumber(total),
         },
         "Retiros",
         "portrait",
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@desc Function to get the type of expence
const getType = (type) => {
   switch (type) {
      case "expence":
         return "Gasto";
      case "withdrawal":
         return "Retiro";
      default:
         return "";
   }
};

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
