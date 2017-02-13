const mongoose = require('mongoose');

const billConvertionDataSchema = new mongoose.Schema({
    body: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('BillConvertionData', billConvertionDataSchema);
