const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../resources/models/User");
const router = express.Router();
const flash = require("express-flash");
const Category = require("../resources/models/Category");
const passport = require("passport");
const authorize = require("./../middleware/authorize");
const guest = require("./../middleware/guest");
const Order = require("../resources/models/Order");
const moment = require("moment");

router.get("/login", guest, (req, res) => {
  res.render("user/login");
});

router.get("/logout", authorize, (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully");
  res.redirect("/user/login");
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error", info.message);
    }

    //Check use exist
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/user/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", info.message);
        return next(err);
      }
      return res.redirect("/user/dashboard");
    });
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.get("/forgot_password", (req, res) => {
  res.render("user/forgot_password");
});

router.get("/dashboard", authorize, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }, null, {
      sort: {
        createdAt: -1
      }
    });
    res.render("user/dashboard", { orders, moment });
  } catch (e) {}
});

router.post("/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (name == "" || mobile == "" || email == "" || password == "") {
      req.flash("name", name);
      req.flash("email", email);
      req.flash("mobile", mobile);
      req.flash("error", "All fields are required");
      res.redirect("/user/login");
    } else {
      //Save data into database
      let userObj = new User({
        name,
        mobile,
        email,
        password: await bcrypt.hash(password, 10)
      });

      let user = await userObj.save();
      // res.status(200).json({
      //   message: "User created successfully",
      //   data: user
      // });
      req.flash("success", "User created successfully");
      res.redirect("/user/login");
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/user/login");

    // res.status(500).json({
    //   message: "Error in user registration",
    //   data: {}
    // });
  }
});

module.exports = router;
