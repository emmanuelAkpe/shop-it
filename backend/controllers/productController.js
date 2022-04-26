const Product = require("../models/productModel");

// create new product => /api/v1/admin/product/new

const newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

// get all the products
const getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

// get a single product =>/api/product/:productId

const getSingleProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (product) {
    res.status(200).json({
      success: true,
      product: product,
    });
  }
};

// update a product => /api/v1/admin/product/:productId
const updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  let product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
};

// delete product => /api/v1/admin/product/:productId

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
module.exports = {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
