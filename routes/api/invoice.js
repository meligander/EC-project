const router = require("express").Router();
const { check, validationResult } = require("express-validator");

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

      const { startDate, endDate, name, lastname } = req.query;

      if (Object.entries(req.query).length === 0) {
         invoices = await Invoice.find()
            .populate({
               path: "user.user_id",
               model: "user",
               select: ["name", "lastname"],
            })
            .sort({ date: -1 });
      } else {
         invoices = await Invoice.find({
            ...((startDate || endDate) && {
               date: {
                  ...(startDate && { $gte: new Date(startDate) }),
                  ...(endDate && { $lte: new Date(endDate) }),
               },
            }),
         })
            .populate({
               path: "user.user_id",
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
                  ...((name || lastname) && {
                     match: {
                        ...(name && {
                           name: { $regex: `.*${name}.*`, $options: "i" },
                        }),
                        ...(lastname && {
                           lastname: {
                              $regex: `.*${lastname}.*`,
                              $options: "i",
                           },
                        }),
                     },
                  }),
               },
            })
            .sort({ date: -1 });

         invoices = invoices.filter((item) =>
            item.details.some(
               (detail) => detail.installment && detail.installment.student
            )
         );
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
      const invoice = await Invoice.findOne({ _id: req.params.id })
         .populate({
            path: "details.installment",
            model: "installment",
            populate: {
               path: "student",
               model: "user",
               select: ["name", "lastname"],
            },
         })
         .populate({
            path: "user.user_id",
            model: "user",
            select: ["name", "lastname", "email", "cel"],
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
      let { user, total, details } = req.body;

      const { _id, name, lastname, email } = user;

      if (total) total = Number(total);

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      if (
         details.some((item) => item.payment > item.value || item.payment <= 0)
      )
         return res.status(400).json({
            msg: "El pago no puede ser mayor al valor de la cuota o un número negativo",
         });

      if (details.some((item) => item.payment === ""))
         return res.status(400).json({
            msg: "Debe ingresar el pago de todas las cuotas agregadas",
         });

      if (!_id && name === "" && lastname === "")
         return res.status(400).json({
            msg: "Debe ingresar el usuario que paga la factura",
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
               { value: newValue, ...(newValue !== 0 && { updatable: false }) }
            );
         }

         const plusvalue = Math.round((last.registermoney + total) * 100) / 100;

         if (last.temporary) {
            await Register.findOneAndUpdate(
               { _id: last._id },
               {
                  registermoney: plusvalue,
               }
            );
         } else {
            last = new Register({
               registermoney: plusvalue,
               temporary: true,
               difference: 0,
            });

            await last.save();
         }

         let invoice = new Invoice({
            ...req.body,
            user: {
               ...(_id
                  ? { user_id: _id }
                  : {
                       ...(name !== "" && { name }),
                       ...(lastname !== "" && { lastname }),
                       ...(email !== "" && { email }),
                    }),
            },
            details: details.map((item) => {
               return {
                  installment: item.installment,
                  value: item.value,
                  payment: Number(item.payment.replace(/,/g, ".")),
               };
            }),
            register: last._id,
         });

         await invoice.save();

         invoice = await Invoice.findOne({ _id: invoice._id })
            .populate({
               path: "user.user_id",
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
            });

         res.json(invoice);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    DELETE /api/invoice/:id
//@desc     Delete an invoice
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Expence
      const invoice = await Invoice.findOneAndRemove({ _id: req.params.id })
         .populate({
            path: "details.installment",
            model: "installment",
         })
         .populate({
            path: "register",
            model: "register",
         });

      for (let x = 0; x < invoice.details.length; x++)
         await Installment.findOneAndUpdate(
            { _id: invoice.details[x].installment._id },
            {
               $set: {
                  value:
                     invoice.details[x].installment.value +
                     invoice.details[x].payment,
               },
            }
         );

      const minusvalue =
         Math.floor((invoice.register.registermoney - invoice.total) * 100) /
         100;

      await Register.findOneAndUpdate(
         { _id: invoice.register._id },
         { $set: { registermoney: minusvalue } }
      );

      res.json({ msg: "Invoice deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
