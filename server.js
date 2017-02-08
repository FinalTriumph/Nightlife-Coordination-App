"use strict";

var express = require("express");
var app = express();
var session = require("express-session");
var mongourl = process.env.MONGOLAB_URI || "mongodb://localhost:27017/data";
var passport = require("passport");
var mongoose = require("mongoose");
var routes = require("./routes/index.js");
var bodyParser = require("body-parser");

require("dotenv").load();
require("./config/passport")(passport);

mongoose.connect(mongourl);
mongoose.Promise = global.Promise;

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/controllers", express.static(process.cwd() + "/controllers"));

app.use(session({
    secret: "numberOneSecret",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log("Listening on port " + port);
})