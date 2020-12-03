const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");
const moment = require("moment");

const Invoice = require("../../models/Invoice");
const Installment = require("../../models/Installment");
const Register = require("../../models/Register");

//@route    GET api/invoice
//@desc     get all invoices
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
  try {
    let invoices = [];

    if (Object.entries(req.query).length === 0) {
      invoices = await Invoice.find()
        .populate({
          path: "user",
          model: "user",
          select: ["name", "lastname"],
        })
        .sort({ date: -1 });
    } else {
      const filter = req.query;

      const filterDate = (filter.startDate || filter.endDate) && {
        date: {
          ...(filter.startDate && {
            $gte: new Date(new Date(filter.startDate).setHours(00, 00, 00)),
          }),
          ...(filter.endDate && {
            $lt: new Date(new Date(filter.endDate).setHours(23, 59, 59)),
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
            path: "user",
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
                  name: { $regex: `.*${filter.name}.*`, $options: "i" },
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
              if (invoicesNameDetails[x].details[y].installment.student) {
                invoices.push(invoicesNameDetails[x]);
                break;
              }
            }
          }
        }
        invoice = invoices.concat(invoicesName);
        invoices = invoices.unique();

        invoices = invoices.sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return 0;
        });
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
    return res.status(500).send("Server Error");
  }
});

//@route    GET api/invoice/id
//@desc     get invoice next number
//@access   Private
router.get("/id", [auth, adminAuth], async (req, res) => {
  try {
    let invoice = await Invoice.find().sort({ $natural: -1 }).limit(1);
    invoice = invoice[0];
    let number = invoice.invoiceid ? Number(invoice.invoiceid) + 1 : 0;

    res.json(number);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route    GET api/invoice/:id
//@desc     get one invoice
//@access   Private
router.get("/:id", [auth, adminAuth], async (req, res) => {
  try {
    let invoice = await Invoice.findOne({ _id: req.params.id });

    if (!invoice)
      return res.status(400).json({
        msg: "No se encontraró una factura con esas descripciones",
      });

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route    POST api/invoice/create-list
//@desc     Create a pdf of income
//@access   Private
router.post("/create-list", (req, res) => {
  const name = "Reports/invoices.pdf";

  const invoices = req.body;

  let htmlstring = "";

  for (let x = 0; x < invoices.length; x++) {
    const date =
      " <td>" + moment(invoices[x].date).format("DD/MM/YY") + "</td>";
    const id = "<td>" + invoices[x].invoiceid + "</td>";
    let name = "";

    if (invoices[x].user === undefined) {
      name = "<td>" + invoices[x].lastname + " " + invoices[x].name + "</td>";
    } else {
      name =
        "<td>" +
        invoices[x].user.lastname +
        " " +
        invoices[x].user.name +
        "</td>";
    }
    const total = "<td> $" + invoices[x].total + "</td>";

    htmlstring += "<tr>" + date + id + name + total + "</tr>";
  }

  const table =
    "<th>Fecha</th> <th>N° Factura</th> <th>Nombre</th> <th>Total</th>";
  const img = path.join(
    "file://",
    __dirname,
    "../../templates/assets/logo.png"
  );
  const css = path.join(
    "file://",
    __dirname,
    "../../templates/styles/list.css"
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

  pdf
    .create(pdfTemplate(css, img, "ingresos", table, htmlstring), options)
    .toFile(name, (err) => {
      if (err) {
        res.send(Promise.reject());
      }

      res.send(Promise.resolve());
    });
});

//@route    GET api/invoice/list/fetch-list
//@desc     Get the pdf of income
//@access   Private
router.get("/list/fetch-list", (req, res) => {
  const name = "Reports/invoices.pdf";

  const dir = __dirname.substring(0, __dirname.indexOf("routes"));

  res.sendFile(dir + name);
});

//@route    POST api/invoice
//@desc     Add an invoice
//@access   Private
router.post(
  "/",
  [auth, adminAuth, check("total", "El pago es necesario").not().isEmpty()],
  async (req, res) => {
    let {
      invoiceid,
      user,
      name,
      email,
      total,
      lastname,
      details,
      remaining,
    } = req.body;
    total = Number(total);

    let errors = validationResult(req);
    errors = errors.array();
    let newDetails = [];
    try {
      let installment;
      for (let x = 0; x < details.length; x++) {
        if (details[x].payment === undefined) {
          errors.push({ msg: "El pago es necesario" });
          break;
        }
        installment = await Installment.findOne({
          _id: details[x].item._id,
        });

        if (installment.value === 0) {
          errors.push({
            msg: "Dicha cuota ya está paga",
          });
          break;
        }

        if (installment.value < details[x].payment) {
          errors.push({
            msg: "El importe a pagar debe ser menor al valor de la cuota",
          });
          break;
        }
      }

      let last = await Register.find().sort({ $natural: -1 }).limit(1);
      last = last[0];

      if (!last) {
        errors.push({
          msg:
            "Antes de realizar cualquier transacción debe ingresar dinero en la caja",
        });
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      for (let x = 0; x < details.length; x++) {
        newDetails.push({
          payment: details[x].payment,
          installment: details[x].item._id,
        });

        installment = await Installment.findOne({
          _id: details[x].item._id,
        });

        await Installment.findOneAndUpdate(
          { _id: installment._id },
          { value: installment.value - details[x].payment }
        );
      }

      let data = {
        invoiceid,
        user,
        name,
        lastname,
        email,
        total,
        details: newDetails,
        remaining,
      };

      let invoice = new Invoice(data);

      await invoice.save();

      const plusvalue = Math.floor((last.registermoney + total) * 100) / 100;

      if (last.temporary) {
        await Register.findOneAndUpdate(
          { _id: last.id },
          {
            income: last.income !== undefined ? last.income + total : total,
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
      }

      res.json(invoice);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//@route    DELETE api/invoice/:id
//@desc     Delete an invoice
//@access   Private
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
    res.status(500).send("Server error");
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

module.exports = router;
