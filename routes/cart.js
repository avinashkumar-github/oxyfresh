const express = require("express");
const router = express.Router();
const payment = require("./../middleware/payment");

router.post("/update", (req, res) => {
  // delete req.session.cart;
  // res.send();
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0
    };
  }

  let cart = req.session.cart;

  //Check if the request to add in cart comes from detail page
  if (!req.body.qty) {
    if (!cart.items[req.body._id]) {
      cart.items[req.body._id] = {
        item: req.body,
        qty: 1
      };

      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.price;
    } else {
      cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.price;
    }
  } else {
    req.body.product = JSON.parse(req.body.product);
    let amt = req.body.qty * req.body.product.price;
    if (!cart.items[req.body.product._id]) {
      cart.items[req.body.product._id] = {
        item: req.body.product,
        qty: req.body.qty
      };
      cart.totalQty = parseInt(cart.totalQty) + parseInt(req.body.qty);
      cart.totalPrice = parseInt(cart.totalPrice) + parseInt(amt);
    } else {
      cart.items[req.body.product._id].qty =
        parseInt(cart.items[req.body.product._id].qty) + parseInt(req.body.qty);
      cart.totalQty = parseInt(cart.totalQty) + parseInt(req.body.qty);
      cart.totalPrice = parseInt(cart.totalPrice) + parseInt(amt);
    }
  }

  res.send(cart);
});

router.get("/view", (req, res) => {
  res.render("cart/view");
});

router.get("/checkout", payment, (req, res) => {
  res.render("cart/checkout");
});

router.post("/delete", (req, res) => {
  if (req.body.itemId) {
    let totalQty =
      parseInt(req.session.cart.totalQty) -
      parseInt(req.session.cart.items[req.body.itemId].qty);
    let totalPrice =
      parseInt(req.session.cart.totalPrice) -
      parseInt(
        req.session.cart.items[req.body.itemId].item.price *
          req.session.cart.items[req.body.itemId].qty
      );

    req.session.cart.totalQty = totalQty;
    req.session.cart.totalPrice = totalPrice;

    if (totalQty == 0) {
      delete req.session.cart;
      res.status(200).json({
        data: {},
        message: "Item deleted from cart"
      });
    } else {
      if (req.session.cart.items[req.body.itemId]) {
        delete req.session.cart.items[req.body.itemId];
        res.status(200).json({
          data: req.session.cart.items,
          message: "Item deleted from cart"
        });
      }
    }
  }
});

module.exports = router;
