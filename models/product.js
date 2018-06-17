const mongoose = require('mongoose');


const supportedCurrencies = ['USD'];
const ProductSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },

    sourceLink: { type: String, required: true, trim: true, unique: true },
    sourceStore: { type: String, required: true, trim: true },

    sellingLink: { type: String, required: false, trim: true },
    sellingStore: { type: String, required: false, trim: true },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      enum: {
        values: supportedCurrencies, message: `Supported currencies are: ${supportedCurrencies}`
      },
      default: 'USD'
    }
  },
  {
    timestamps: true,
    toObject: { virtuals: true, versionKey: false }
  }
);

ProductSchema.virtual('_scans', {
  ref: 'Scan', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: '_product', // is equal to `foreignField`
});

// Compile model from schema
module.exports.Product = mongoose.model('Product', ProductSchema);
