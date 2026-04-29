const express = require("express");
const router = express.Router();
const passport = require("passport");

const authController = require("../controllers/authController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

router.get("/signup", authController.signupGet);
router.post("/signup", authController.signupPost);

router.get("/login", authController.loginGet);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

router.get("/join", ensureAuthenticated, authController.joinGet);
router.post("/join", ensureAuthenticated, authController.joinPost);

module.exports = router;