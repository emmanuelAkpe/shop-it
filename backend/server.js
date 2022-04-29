const express = require("express");
const app = express();
const dotenv = require("dotenv");
app.use(express.json());
// import all routes
const products = require("./routes/productRouter");
const auth = require("./routes/authRouter");
// import database
const { connectDatabase } = require("./config/database");
// import error middlewares
const errorMiddleware = require("./middlewares/errors");

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// setting up config file
dotenv.config({ path: "backend/config/config.env" });

// use routes
app.use("/api/v1", products);
app.use("/api/v1", auth);

// Middleware to handle errors
app.use(errorMiddleware);

const start = async () => {
  await connectDatabase();

  app.listen(process.env.PORT, () => {
    console.log(
      `server started successfully on port ${process.env.PORT}  in ${process.env.NODE_ENV} mode`
    );
  });
};

start();

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
