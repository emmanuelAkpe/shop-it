// create and send token and save in the cookie

const sendToken = (user, statusCode, res) => {
  // create the token

  const token = user.getJwtToken();

  // options for the tokens
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    //   dont forget the httpOnly flag else the token can be accessed with js
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
