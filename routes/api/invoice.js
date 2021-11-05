const express = require("express");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const path = require("path");
const pdf = require("html-pdf");
const router = express.Router();

//PDF Templates
const pdfTemplate = require("../../templates/list");
const pdfTemplate2 = require("../../templates/invoice");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Invoice = require("../../models/Invoice");
const Installment = require("../../models/Installment");
const Register = require("../../models/Register");

//@route    GET /api/invoice
//@desc     get all invoices || with filters
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let invoices = [];

      if (Object.entries(req.query).length === 0) {
         invoices = await Invoice.find()
            .populate({
               path: "user._id",
               model: "user",
               select: ["name", "lastname"],
            })
            .sort({ date: -1 });
      } else {
         const filter = req.query;

         const filterDate = (filter.startDate || filter.endDate) && {
            date: {
               ...(filter.startDate && {
                  $gte: new Date(filter.startDate).setHours(00, 00, 00),
               }),
               ...(filter.endDate && {
                  $lte: new Date(filter.endDate).setHours(23, 59, 59),
               }),
            },
         };

         const invoicesName = await Invoice.find({
            ...filterDate,
            ...(filter.name && {
               name: { $regex: `.*${filter.name}.*`, $options: "i" },
            }),
            ...(filter.lastname && {
               lastname: {
                  $regex: `.*${filter.lastname}.*`,
                  $options: "i",
               },
            }),
         })
            .populate({
               path: "user",
               model: "user",
               select: ["name", "lastname"],
            })
            .sort({ date: -1 });

         if (filter.name || filter.lastname) {
            const invoicesNameDetails = await Invoice.find(filterDate)
               .populate({
                  path: "user._id",
                  model: "user",
                  select: ["name", "lastname"],
               })
               .populate({
                  path: "details.installment",
                  model: "installment",
                  populate: {
                     path: "student",
                     model: "user",
                     select: ["name", "lastname"],
                     match: {
                        ...(filter.name && {
                           name: {
                              $regex: `.*${filter.name}.*`,
                              $options: "i",
                           },
                        }),
                        ...(filter.lastname && {
                           lastname: {
                              $regex: `.*${filter.lastname}.*`,
                              $options: "i",
                           },
                        }),
                     },
                  },
               });

            const invoicesUserNames = await Invoice.find(filterDate).populate({
               path: "user",
               model: "user",
               select: ["name", "lastname"],
               match: {
                  ...(filter.name && {
                     name: { $regex: `.*${filter.name}.*`, $options: "i" },
                  }),
                  ...(filter.lastname && {
                     lastname: {
                        $regex: `.*${filter.lastname}.*`,
                        $options: "i",
                     },
                  }),
               },
            });

            for (let x = 0; x < invoicesUserNames.length; x++) {
               if (invoicesUserNames[x].user) {
                  invoices.push(invoicesUserNames[x]);
               }
            }
            for (let x = 0; x < invoicesNameDetails.length; x++) {
               for (let y = 0; y < invoicesNameDetails[x].details.length; y++) {
                  if (invoicesNameDetails[x].details[y].installment) {
                     if (
                        invoicesNameDetails[x].details[y].installment.student
                     ) {
                        invoices.push(invoicesNameDetails[x]);
                        break;
                     }
                  }
               }
            }
            invoices = invoices
               .concat(invoicesName)
               .unique()
               .sort((a, b) => {
                  if (a.date > b.date) return -1;
                  if (a.date < b.date) return 1;
                  return 0;
               });

            invoices = invoices;
         } else {
            invoices = invoicesName;
         }
      }

      if (invoices.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron facturas con dichas descripciones",
         });
      }

      res.json(invoices);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/invoice/:id
//@desc     get one invoice
//@access   Private && Admin
router.get("/:id", [auth, adminAuth], async (req, res) => {
   try {
      let invoice = await Invoice.findOne({ _id: req.params.id })
         .populate({
            path: "user._id",
            model: "user",
            select: ["name", "lastname", "cel", "email"],
         })
         .populate({
            path: "details.installment",
            model: "installment",
            populate: {
               path: "student",
               model: "user",
               select: ["name", "lastname"],
            },
         });

      if (!invoice)
         return res.status(400).json({
            msg: "No se encontró una factura con esas descripciones",
         });

      res.json(invoice);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/invoice/id
//@desc     get invoice next number
//@access   Private && Admin
router.get("/last/invoiceid", [auth, adminAuth], async (req, res) => {
   try {
      let number = 1;
      let invoice = await Invoice.find().sort({ $natural: -1 }).limit(1);

      if (invoice[0]) {
         number = Number(invoice[0].invoiceid) + 1;
      }

      res.json(number);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/invoice/list/fetch-list
//@desc     Get the pdf of income
//@access   Private && Admin
router.get("/list/fetch-list", [auth, adminAuth], (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/invoices.pdf"));
});

//@route    GET /api/invoice/for-print/fetch-invoice
//@desc     Get the pdf of an invoice
//@access   Private && Admin
router.get("/for-print/fetch-invoice", [auth, adminAuth], (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/invoice.pdf"));
});

//@route    POST /api/invoice
//@desc     Register an invoice
//@access   Private && Admin
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("total", "Debe ingresar el pago de todas las cuotas agregadas")
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      let { invoiceid, user, total, details, remaining } = req.body;

      const { _id, name, lastname, email } = user;

      if (total) total = Number(total);

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      if (details.some((item) => item.payment === ""))
         return res.status(400).json({
            msg: "Debe ingresar el pago de todas las cuotas agregadas",
         });

      if (_id === "" && name === "" && lastname === "")
         return res.status(400).json({
            msg: "Debe ingresar al usuario que paga la factura",
         });

      try {
         let last = await Register.find().sort({ $natural: -1 }).limit(1);
         last = last[0];

         if (!last)
            return res.status(400).json({
               msg: "Antes de realizar cualquier transacción debe ingresar dinero en la caja",
            });

         for (let x = 0; x < details.length; x++) {
            const newValue = details[x].value - details[x].payment;

            await Installment.findOneAndUpdate(
               { _id: details[x].installment },
               { value: newValue, ...(newValue !== 0 && { halfPayed: true }) }
            );
         }

         const plusvalue = Math.floor((last.registermoney + total) * 100) / 100;

         if (last.temporary) {
            await Register.findOneAndUpdate(
               { _id: last._id },
               {
                  income: last.income ? last.income + total : total,
                  registermoney: plusvalue,
               }
            );
         } else {
            const data = {
               registermoney: plusvalue,
               income: total,
               temporary: true,
               difference: 0,
            };

            const register = new Register(data);

            await register.save();

            last = await Register.find().sort({ $natural: -1 }).limit(1);
            last = last[0];
         }

         let data = {
            invoiceid,
            user: {
               ...(_id !== ""
                  ? { _id }
                  : {
                       _id: null,
                       name,
                       lastname,
                       email,
                    }),
            },
            total,
            details: details.map((item) => {
               return {
                  installment: item.installment,
                  payment: item.payment,
                  value: item.value,
               };
            }),
            remaining,
            register: last._id,
         };

         let invoice = new Invoice(data);

         await invoice.save();

         invoice = await Invoice.find()
            .sort({ $natural: -1 })
            .populate({
               path: "user._id",
               model: "user",
               select: ["name", "lastname", "email"],
            })
            .populate({
               path: "details.installment",
               model: "installment",
               populate: {
                  path: "student",
                  model: "user",
                  select: ["name", "lastname"],
               },
            })
            .limit(1);
         invoice = invoice[0];

         res.json(invoice);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    POST /api/invoice/create-list
//@desc     Create a pdf list of income
//@access   Private && Admin
router.post("/create-list", [auth, adminAuth], (req, res) => {
   const name = path.join(__dirname, "../../reports/invoices.pdf");

   const invoices = req.body;

   let tbody = "";

   for (let x = 0; x < invoices.length; x++) {
      const date =
         " <td>" + moment(invoices[x].date).format("DD/MM/YY") + "</td>";
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
      ).toFile(name, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/invoice/create-invoice
//@desc     Create a pdf of an invoice
//@access   Private && Admin
router.post("/create-invoice", [auth, adminAuth], (req, res) => {
   const pathName = path.join(__dirname, "../../reports/invoice.pdf");

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
      date: moment(date).format("DD/MM/YY"),
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
         pathName,
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

//@route    DELETE /api/invoice/:id
//@desc     Delete an invoice
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Expence
      const invoice = await Invoice.findOneAndRemove({ _id: req.params.id });

      for (let x = 0; x < invoice.details.length; x++) {
         const installment = await Installment.findOne({
            _id: invoice.details[x].installment,
         });
         await Installment.findOneAndUpdate(
            { _id: installment.id },
            { value: installment.value + invoice.details[x].payment }
         );
      }

      let last = await Register.find().sort({ $natural: -1 }).limit(1);
      last = last[0];
      const minusvalue =
         Math.floor((last.registermoney - invoice.total) * 100) / 100;

      await Register.findOneAndUpdate(
         { _id: last.id },
         {
            income: last.income - invoice.total,
            registermoney: minusvalue,
         }
      );

      res.json({ msg: "Invoice deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

Array.prototype.unique = function () {
   var a = this.concat();
   for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
         if (a[i].invoiceid === a[j].invoiceid) a.splice(j--, 1);
      }
   }

   return a;
};

const formatNumber = (number) => {
   return new Intl.NumberFormat("de-DE").format(number);
};

module.exports = router;
