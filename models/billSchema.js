const mongoose = require('mongoose');

const billSchemaSchema = new mongoose.Schema({
    provider: { type: String, required: true },
    name: { type: String, required: true },
    body: { type: String, required: true },
    versionNumber: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BillSchema', billSchemaSchema);
