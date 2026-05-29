const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  accountNumber: {
    type: String,
    required: true,
  },

  previousReading: {
    type: Number,
    required: true,
  },

  currentReading: {
    type: Number,
    required: true,
  },

  consumption: {
    type: Number,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  readingDate: {
    type: String,
    required: true,
  },

  dueDate: {
    type: String,
    required: true,
  },

  meterReaderName: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Unpaid",
  },

  paidDate: {
  type: String,
  default: "",
},

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports =
mongoose.model(
  "Bill",
  billSchema
);
