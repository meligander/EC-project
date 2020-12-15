const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");
const moment = require("moment");

const Register = require("../../models/Register");

//@route    GET api/register
//@desc     get all cashier register
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let registers;

      if (Object.entries(req.query).length === 0) {
         registers = await Register.find().sort({ date: -1 });
      } else {
         const filter = req.query;

         registers = await Register.find({
            ...((filter.startDate || filter.endDate) && {
               date: {
                  ...(filter.startDate && {
                     $gte: new Date(
                        new Date(filter.startDate).setHours(00, 00, 00)
                     ),
                  }),
                  ...(filter.endDate && {
                     $lt: new Date(
                        new Date(filter.endDate).setHours(23, 59, 59)
                     ),
                  }),
               },
            }),
         }).sort({ date: -1 });
      }

      if (registers === 0) {
         return res.status(400).json({
            msg:
               "No se encontró información de la caja con dichas descripciones",
         });
      }

      res.json(registers);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/register/last
//@desc     get last register info
//@access   Private
router.get("/last", [auth, adminAuth], async (req, res) => {
   try {
      let register = await Register.find().sort({ $natural: -1 }).limit(1);
      register = register[0];

      res.json(register);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/expence/create-list
//@desc     Create a pdf of expences
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/registers.pdf";

   const register = req.body;

   let tbody = "";

   for (let x = 0; x < register.length; x++) {
      if (register[x].temporary) continue;
      const date =
         "<td>" + moment(register[x].date).format("DD/MM/YY") + "</td>";
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
      const registermoney = "<td> $" + register[x].registermoney + "</td>";
      const diference =
         "<td>" +
         (register[x].difference !== 0 && register[x].difference
            ? register[x].negative
               ? "-$" + register[x].difference
               : "+$" + register[x].difference
            : "") +
         "</td>";
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
   }

   const thead =
      "<th>Fecha</th> <th>Ingresos</th> <th>Egresos</th> <th>Otros Ing</th> <th>Retiro</th> <th>Plata Caja</th> <th>Diferencia</th> <th>Detalles</th>";

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
      orientation: "landscape",
      footer: {
         height: "17mm",
         contents:
            '<footer class="footer">Villa de Merlo English Center <span class="pages">{{page}}/{{pages}}</span></footer>',
      },
   };

   pdf.create(pdfTemplate(css, img, "caja", thead, tbody), options).toFile(
      name,
      (err) => {
         if (err) {
            res.send(Promise.reject());
         }

         res.send(Promise.resolve());
      }
   );
});

//@route    GET api/expence/fetch-list
//@desc     Get the pdf of expences
//@access   Private
router.get("/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/registers.pdf"));
});

//@route    POST api/register
//@desc     Add first register
//@access   Private
router.post("/", [auth, adminAuth], async (req, res) => {
   const { difference, description } = req.body;

   try {
      let data = { temporary: false, description };

      data.registermoney = Math.floor(difference * 100) / 100;

      let register = new Register(data);

      await register.save();

      res.json(register);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    PUT api/register
//@desc     Update a register
//@access   Private
router.put("/", [auth, adminAuth], async (req, res) => {
   const { difference, negative, description } = req.body;

   try {
      let last = await Register.find().sort({ $natural: -1 }).limit(1);
      last = last[0];

      if (!last.temporary) {
         return res
            .status(400)
            .json({ msg: "No se ha registrado ningún movimiento en la caja" });
      }
      let value = last.registermoney;

      if (difference) {
         if (negative) {
            value =
               Math.floor((last.registermoney - Number(difference)) * 100) /
               100;
         } else {
            value =
               Math.floor((last.registermoney + Number(difference)) * 100) /
               100;
         }
      }

      const date = new Date();

      let data = {
         ...(difference && {
            difference,
            registermoney: value,
            negative,
         }),
         ...(description && description),
         temporary: false,
         dateclose: date,
      };

      let register = await Register.findOneAndUpdate({ _id: last.id }, data, {
         new: true,
      });

      res.json(register);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/register/:id
//@desc     Delete a register
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      const register = await Register.findOne({ _id: req.params.id });

      if (register.temporary) {
         return res
            .status(400)
            .json({ msg: "La caja no se ha cerrado todavía" });
      }
      if (register.difference !== 0) {
         let registermoney;
         if (register.negative) {
            registermoney = register.registermoney + register.difference;
         } else {
            registermoney = register.registermoney - register.difference;
         }
         await Register.findOneAndUpdate(
            { _id: req.params.id },
            {
               temporary: true,
               difference: 0,
               registermoney,
            }
         );
      } else {
         //Remove register
         await Register.findOneAndUpdate(
            { _id: req.params.id },
            {
               temporary: true,
            }
         );
      }

      res.json({ msg: "Register deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
