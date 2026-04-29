function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  res.status(403).render("error", {
    message: "Only admins can do this.",
  });
}

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
};