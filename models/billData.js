const mongoose = require('mongoose');

const billDataSchema = new mongoose.Schema({
    billProcessId: { type: String, required: true },
    billStart: { type: Date },
    billEnd: { type: Date },
    totalCharges: { type: Number } ,
    previousBalance: { type: Number },
    accountNumber: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    nameOnBill: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BillData', billDataSchema);
