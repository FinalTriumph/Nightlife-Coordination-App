"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Bar = new Schema({
   bar: {
       name: String,
       url: String,
       image: String,
       descr: String,
       going: Array
   } 
});

module.exports = mongoose.model("Bar", Bar);