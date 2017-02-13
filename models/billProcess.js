const mongoose = require('mongoose');

const billProcessSchema = new mongoose.Schema({
    billSchemaId: { type: String },
    billConvertionData: { type: String },
    pdfURL: { type: String },
    pdfFile: { type: String },
    status: { type: Number, default: 1 },
    startedOn: { type: Date, default: Date.now },
    finishedOn: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BillProcess', billProcessSchema);
