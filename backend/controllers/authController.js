const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const sendToken = require("../utils/jwtToken");

// Register a user => /api/v1/register

const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "xxxx",
      url: "xxxx",
    },
  });

  // // Note:getJwtToken is created as a method of the userSchema in the user model
  // const token = user.getJwtToken();

  // res.status(201).json({
  //   success: true,
  //   token,
  // });
  sendToken(user, 200, res);
});

// Login User => /api/v1/login

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password are entered
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  // finding  the user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("please enter a valid Email or password", 401)
    );
  }

  //  checking if password is correct
  // Note:comparePassword is created as a method of the userSchema in the user model
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("please enter a valid password", 401));
  }

  // const token = user.getJwtToken();
  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  sendToken(user, 200, res);
});

module.exports = {
  registerUser,
  loginUser,
};
