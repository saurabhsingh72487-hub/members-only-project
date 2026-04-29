const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { body, validationResult } = require("express-validator");

// SIGNUP
exports.signupGet = (req, res) => {
  res.render("signup");
};

exports.signupPost = [
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("signup", { errors: errors.array() });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);

    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashed,
      isAdmin: req.body.isAdmin ? true : false,
    });

    res.redirect("/login");
  },
];

// LOGIN
exports.loginGet = (req, res) => {
  res.render("login");
};

// JOIN CLUB
exports.joinGet = (req, res) => {
  res.render("join");
};

exports.joinPost = async (req, res) => {
  if (req.body.passcode === process.env.CLUB_PASSCODE) {
    await req.user.update({ membershipStatus: true });
    return res.redirect("/");
  }

  res.render("join", { error: "Wrong passcode" });
};