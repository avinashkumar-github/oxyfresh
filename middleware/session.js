const axios = require("axios");
const e = require("express");
const Category = require("../resources/models/Category");
function session() {
  return {
    async setCategory(req, res, next) {
      if (!req.session.category) {
        const category = await Category.find();
        req.session.category = category;
        res.locals.session = req.session;
      }
      next();
    }
  };
}

module.exports = session;
