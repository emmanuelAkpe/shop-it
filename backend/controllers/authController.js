const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEMail = require("../utils/sendEMail");
const crypto = require("crypto");

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

// forgot password  =>/api/v1/password/forgot

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler("user not found with this email address", 404)
    );
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset password url

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset token is:\n\n${resetUrl}\n\nIf you have not requested this email, then igonre it`;

  try {
    await sendEMail({
      email: user.email,
      subject: "Shop-it Password Recovery ",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password   =>  /api/v1/password/reset/:token
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// logout user => /api/v1/logout

const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
};
