const express = require("express");
const Category = require("../resources/models/Category");
const Product = require("../resources/models/Product");

const router = express.Router();

router.get("/:type", async (req, res) => {
  //Get the category Id
  let category = await Category.findOne({ slug: req.params.type });
  if (!category) {
    return res.redirect("/");
  }

  let products = await Product.find({ categoryId: category._id })
    .populate("categoryId")
    .exec();

  res.render("product/home", {
    products,
    title: category.name
  });
});

router.get("/main/:detail", async (req, res) => {
  try {
    let product = await Product.findById(req.params.detail);
    if (!product) {
      return res.redirect(`/`);
    }
    res.render("product/detail", { product });
  } catch (e) {
    return res.redirect(`/`);
  }
});

router.get("/:type/:detail", async (req, res) => {
  try {
    let product = await Product.findById(req.params.detail);
    if (!product) {
      return res.redirect(`/product/${req.params.type}`);
    }
    res.render("product/detail", { product });
  } catch (e) {
    return res.redirect(`/product/${req.params.type}`);
  }
});

module.exports = router;
