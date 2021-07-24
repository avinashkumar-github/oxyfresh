const express = require("express");
const Order = require("../resources/models/Order");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { v4: uuidv4 } = require("uuid");
const { response } = require("express");

const router = express.Router();

router.post("/add", async (req, res) => {
  const { stripeToken, address_payment } = req.body;
  console.log(req.body);
  console.log(req.session.cart);
  console.log(req.user);
  try {
    //Payment flow first
    stripe.charges
      .create({
        amount: req.session.cart.totalPrice * 100,
        source: stripeToken,
        currency: "inr",
        description: `Oxyfresh order: ${uuidv4()}`
      })
      .then((response) => {
        let order = new Order({
          name: `Oxyfresh order: ${uuidv4()}`,
          customerId: req.user._id,
          address: address_payment
        });

        order
          .save()
          .then(() => {
            res.status(200).json({
              message: "Payment successful, thank you for order!!"
            });
          })
          .catch((error) => {
            res.status(200).json({
              message:
                "Payment successful, but error in placing order!! Refund initiated!!"
            });
          });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Payment unsuccessful, please try again!!"
        });
      });
  } catch (e) {}
});

module.exports = router;
