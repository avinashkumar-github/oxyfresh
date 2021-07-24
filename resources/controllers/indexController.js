const Category = require("../models/Category");
const Product = require("../models/Product");

function indexController() {
  return {
    async home(req, res) {
      if (!req.session.category) {
        const category = await Category.find();
        req.session.category = category;
      }
      //Get products
      let best_products = await Product.find({ best_seller: true }).limit(4);
      let featured_products = await Product.find({ featured: true }).limit(4);
      let new_products = await Product.find({ new_arrival: true }).limit(4);
      let slider_products = await Product.find({ on_slider: true });
      res.render("home", {
        best_products,
        featured_products,
        new_products,
        slider_products
      });
    }
  };
}

module.exports = indexController;
