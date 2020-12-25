const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");
const moment = require("moment");

const Expence = require("../../models/Expence");
const Register = require("../../models/Register");
const ExpenceType = require("../../models/ExpenceType");
const Invoice = require("../../models/Invoice");
const { type } = require("os");

//@route    GET api/expence
//@desc     get all expences
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let expences = [];
      let invoices = [];
      let transactions = [];

      if (Object.entries(req.query).length === 0) {
         expences = await Expence.find().populate("expencetype");
         invoices = await Invoice.find().populate("user");
      } else {
         const filter = req.query;

         if (!filter.transactionType || filter.transactionType === "Ingreso") {
            invoices = await Invoice.find({
               ...((filter.startDate || filter.endDate) && {
                  date: {
                     ...(filter.startDate && {
                        $gte: new Date(filter.startDate).setHours(00, 00, 00),
                     }),
                     ...(filter.endDate && {
                        $lte: new Date(filter.endDate).setHours(23, 59, 59),
                     }),
                  },
               }),
            }).populate("user");
         }
         if (filter.transactionType !== "Ingreso") {
            expences = await Expence.find({
               ...((filter.startDate || filter.endDate) && {
                  date: {
                     ...(filter.startDate && {
                        $gte: new Date(filter.startDate).setHours(00, 00, 00),
                     }),
                     ...(filter.endDate && {
                        $lte: new Date(filter.endDate).setHours(23, 59, 59),
                     }),
                  },
               }),
            }).populate({
               path: "expencetype",
            });
         }

         if (filter.transactionType && filter.transactionType !== "Ingreso") {
            let filteredExpences = [];
            for (let x = 0; x < expences.length; x++) {
               if (expences[x].expencetype.type === filter.transactionType)
                  filteredExpences.push(expences[x]);
            }
            expences = filteredExpences;
         }
      }

      transactions = expences.concat(invoices);
      transactions = sortArray(transactions);

      if (transactions.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron movimientos con dichas descripciones",
         });
      }

      res.json(transactions);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/expence/create-list
//@desc     Create a pdf of transactions
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/transactions.pdf";

   const transactions = req.body;

   let tbody = "";

   for (let x = 0; x < transactions.length; x++) {
      let name = "";

      if (!transactions[x].expencetype) {
         if (transactions[x].user) {
            name =
               transactions[x].user.lastname + ", " + transactions[x].user.name;
         } else {
            name = transactions[x].lastname + ", " + transactions[x].name;
         }
      }

      const date =
         "<td>" + moment(transactions[x].date).format("DD/MM/YY") + "</td>";
      const type =
         "<td>" +
         (transactions[x].expencetype
            ? transactions[x].expencetype.type +
              " - " +
              transactions[x].expencetype.name
            : "Ingreso") +
         "</td>";
      const value =
         "<td> $" +
         (transactions[x].expencetype
            ? transactions[x].value
            : transactions[x].total) +
         "</td>";
      const description =
         "<td>" +
         (!transactions[x].expencetype
            ? "Factura " + name
            : transactions[x].description
            ? transactions[x].description
            : "") +
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

   pdf.create(
      pdfTemplate(css, img, "movimientos", thead, tbody),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/expence/fetch-list
//@desc     Get the pdf of transactions
//@access   Private
router.get("/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/transactions.pdf"));
});

//@route    POST api/expence
//@desc     Add an expence
//@access   Private
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("value", "El valor es necesario").not().isEmpty(),
      check("expencetype", "El tipo de gasto es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      let { value, expencetype, description } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         const expencetypeinfo = await ExpenceType.findOne({
            _id: expencetype,
         });

         let last = await Register.find().sort({ $natural: -1 }).limit(1);
         last = last[0];
         if (last === undefined)
            return res.status(400).json({
               msg:
                  "Primero debe ingresar dinero a la caja antes de hacer cualquier transacción",
            });

         if (last.registermoney === 0)
            return res.status(400).json({
               msg:
                  "Primero debe ingresar dinero a la caja antes de hacer cualquier transacción",
            });

         if (expencetypeinfo.type !== "Ingreso" && last.registermoney < value)
            return res.status(400).json({
               msg: "No se puede utilizar más dinero del que hay en caja",
            });

         let data = { value, expencetype, description };

         let expence = new Expence(data);

         await expence.save();

         //search for the last expence
         let expences = await Expence.find()
            .populate("expencetype")
            .sort({ $natural: -1 })
            .limit(1);
         expence = expences[0];

         value = Number(value);

         const plusvalue = Math.floor((last.registermoney + value) * 100) / 100;
         const minusvalue =
            Math.floor((last.registermoney - value) * 100) / 100;

         if (last.temporary) {
            await Register.findOneAndUpdate(
               { _id: last.id },
               {
                  ...(expencetypeinfo.type === "Gasto" && {
                     expence:
                        last.expence === undefined
                           ? value
                           : Math.floor((last.expence + value) * 100) / 100,
                     registermoney: minusvalue,
                  }),
                  ...(expencetypeinfo.type === "Ingreso" && {
                     cheatincome:
                        last.cheatincome === undefined
                           ? value
                           : Math.floor((last.cheatincome + value) * 100) / 100,
                     registermoney: plusvalue,
                  }),
                  ...(expencetypeinfo.type === "Retiro" && {
                     withdrawal:
                        last.withdrawal === undefined
                           ? value
                           : Math.floor((last.withdrawal + value) * 100) / 100,
                     registermoney: minusvalue,
                  }),
               }
            );
         } else {
            const data = {
               temporary: true,
               difference: 0,
               ...(expencetypeinfo.type === "Gasto" && {
                  expence: value,
                  registermoney: minusvalue,
               }),
               ...(expencetypeinfo.type === "Ingreso" && {
                  cheatincome: value,
                  registermoney: plusvalue,
               }),
               ...(expencetypeinfo.type === "Retiro" && {
                  withdrawal: value,
                  registermoney: minusvalue,
               }),
            };

            const register = new Register(data);

            await register.save();
         }

         res.json({ msg: "Expence Register" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    DELETE api/expence/:id
//@desc     Delete an expence
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Expence
      const expence = await Expence.findOneAndRemove({ _id: req.params.id });
      const expencetypeinfo = await ExpenceType.findOne({
         _id: expence.expencetype,
      });

      let last = await Register.find().sort({ $natural: -1 }).limit(1);
      last = last[0];

      await Register.findByIdAndUpdate(
         { _id: last.id },
         {
            ...(expencetypeinfo.type === "Gasto" && {
               expence: last.expence - expence.value,
               registermoney: last.registermoney + expence.value,
            }),
            ...(expencetypeinfo.type === "Ingreso" && {
               cheatincome: last.cheatincome - expence.value,
               registermoney: last.registermoney - expence.value,
            }),
            ...(expencetypeinfo.type === "Retiro" && {
               withdrawal: last.withdrawal - expence.value,
               registermoney: last.registermoney + expence.value,
            }),
         }
      );

      res.json({ msg: "Expence deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

function sortArray(array) {
   let sortedArray = array.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
   });

   return sortedArray;
}

module.exports = router;
