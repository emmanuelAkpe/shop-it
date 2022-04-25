const getProducts = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "this route will show all products in database",
  });
};

module.exports = {
  getProducts,
};
