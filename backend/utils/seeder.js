const Product = require("../models/productModel");
const dotenv = require("dotenv");
const { connectDatabase } = require("../config/database");

const products = require("../data/products.json");

// setting dotenv file path
dotenv.config({ path: "backend/config/config.env" });

const seedProducts = async () => {
  await connectDatabase();
  try {
    await Product.deleteMany();
    console.log("products are deleted");

    await Product.insertMany(products);
    console.log("All prodcuts are added");

    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedProducts();
