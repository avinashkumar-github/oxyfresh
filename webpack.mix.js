let mix = require("laravel-mix");

mix.js("resources/app.js", "public/js/app.js");
mix.sass("resources/scss/app.scss", "public/css/app.css");
