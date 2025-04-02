const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
   invoiceid: {
      type: Number,
      required: true,
   },
   user: {
      user_id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
      },
      name: {
         type: String,
      },
      lastname: {
         type: String,
      },
      email: {
         type: String,
      },
   },
   date: {
      type: Date,
      default: Date.now,
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
         discount: {
            type: Number,
         },
      },
   ],
   register: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "register",
   },
});

const Invoice = mongoose.model("invoice", InvoiceSchema);

module.exports = Invoice;
