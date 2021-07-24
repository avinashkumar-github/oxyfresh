const express = require("express");
const indexController = require("../resources/controllers/indexController");
const Category = require("../resources/models/Category");

const route = express.Router();

route.get("/", indexController().home);

module.exports = route;
