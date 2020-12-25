const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
   invoiceid: {
      type: Number,
      required: true,
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
   },
   //SI ES ALGUIEN NO REGISTRADO
   name: {
      type: String,
   },
   lastname: {
      type: String,
   },
   email: {
      type: String,
   },
   //
   date: {
      type: Date,
      default: Date.now,
   },
   remaining: {
      type: Number,
   },
   total: {
      type: Number,
      required: true,
   },
   details: [
      {
         installment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "installment",
            required: true,
         },
         payment: {
            type: Number,
            required: true,
         },
         value: {
            type: Number,
            required: true,
         },
      },
   ],
});

const Invoice = mongoose.model("invoice", InvoiceSchema);

module.exports = Invoice;
