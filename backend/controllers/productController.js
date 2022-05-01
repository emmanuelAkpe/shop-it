const Product = require("../models/productModel");

// for making queries
const APIFeatures = require("../utils/ApiFeatures");

// import error handler
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");

// create new product => /api/v1/admin/product/new
const newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; //to enable us get the person who created the product
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get all the products
const getProducts = catchAsyncErrors(async (req, res, next) => {
  // pagination
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    productsCount,
    resPerPage,
    filteredProductsCount,
    products,
  });
});

// get a single product =>/api/product/:productId
const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  if (product) {
    res.status(200).json({
      success: true,
      product: product,
    });
  }
});

// update a product => /api/v1/admin/product/:productId
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.productId;
  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
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
});

// delete product => /api/v1/admin/product/:productId
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
module.exports = {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
