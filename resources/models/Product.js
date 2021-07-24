const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    best_seller: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    new_arrival: {
      type: Boolean,
      default: false
    },
    on_slider: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
