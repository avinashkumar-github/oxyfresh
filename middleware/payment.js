function payment(req, res, next) {
  if (req.isAuthenticated() && req.session.cart) {
    return next();
  }

  res.redirect("/user/login");
}

module.exports = payment;
