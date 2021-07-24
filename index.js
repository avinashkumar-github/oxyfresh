const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path");
const expressEjsLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const router = express.Router();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Database connection
mongoose.connect(
  process.env.MONGO_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  },
  () => {
    console.log("Database connected!!");
  }
);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB
    }),
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

//Passport config
const passportConfig = require("./config/passport");
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global middleware
//Global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

//routes
const userRoute = require("./routes/user");
const indexRoute = require("./routes/index");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./resources/views"));

app.use(express.static("public"));

app.use("/user", userRoute);
app.use("/", indexRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is connected at ${PORT}`);
});
