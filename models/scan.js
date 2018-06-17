const mongoose = require('mongoose');


const ScanSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true, default: 0 },
    discountedPrice: { type: Number, required: true, default: 0 },

    _product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
  },
  {
    timestamps: true,
    toObject: { versionKey: false }
  }
);

// Compile model from schema
module.exports.Scan = mongoose.model('Scan', ScanSchema);
