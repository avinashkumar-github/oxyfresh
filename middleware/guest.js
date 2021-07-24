function guest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect("/user/dashboard");
}

module.exports = guest;
