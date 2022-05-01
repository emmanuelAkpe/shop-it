const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter product name"],
    trim: true,
    maxLength: [100, "product name must not exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "please enter product price"],
    maxLength: [5, "price must not exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },

  images: [
    {
      public_id: {
        type: String,
        required: [true, "please enter product image id"],
      },
      url: {
        type: String,
        required: [true, "please enter product image url"],
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please select category for this product"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      message: "Please select correct category for product",
    },
  },

  seller: {
    type: String,
    required: [true, "please enter product Seller"],
  },
  stock: {
    type: Number,
    required: [true, "please enter product Stock"],
    maxLength: [5, "product stock cannot exceed 5 characters"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  // to enable us know the person who created the product
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
