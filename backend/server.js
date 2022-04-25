const express = require("express");
const app = express();
const dotenv = require("dotenv");
app.use(express.json());
// import all routes
const products = require("./routes/productRouter");
// import database
const { connectDatabase } = require("./config/database");

// setting up config file
dotenv.config({ path: "backend/config/config.env" });

// use routes
app.use("/api/v1/", products);

const start = async () => {
  await connectDatabase();

  app.listen(process.env.PORT, () => {
    console.log(
      `server started successfully on port ${process.env.PORT}  in ${process.env.NODE_ENV} mode`
    );
  });
};

start();
