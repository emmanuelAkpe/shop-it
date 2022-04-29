const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");

// register user route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
