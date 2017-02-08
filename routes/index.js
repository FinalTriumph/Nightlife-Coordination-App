"use strict";

require("dotenv").load();
var path = process.cwd();
var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: process.env.YELP_Consumer_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});
var Bar = require("../models/bars");


module.exports = function(app, passport) {
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.sendFile(path + "/public/homeNLI.html");
        }
    }
    
    app.route("/")
        .get(isLoggedIn, function(req, res){
            res.sendFile(path + "/public/homeLI.html");
        });
        
    app.route("/mybars")
        .get(isLoggedIn, function(req, res){
            res.sendFile(path + "/public/myBars.html");
        });
        
    app.route("/auth/twitter")
        .get(passport.authenticate("twitter"));
        
    app.route("/auth/twitter/callback")
        .get(passport.authenticate("twitter", {
            successRedirect: "/",
            failureRedirect: "/"
        }));
        
    app.route("/twitter-logout")
        .get(function(req, res) {
            req.logout();
            res.redirect("/");
        });
        
    app.route("/api/:id")
        .get(isLoggedIn, function(req, res){
            res.json(req.user.twitter);
        });
        
    app.route("/api/:id/search/:term")
        .get(function(req, res) {
            yelp.search({ term: "bars", location: req.params.term })
                .then(function (data) {
                    var allBarsArray = data.businesses;
                    var auth;
                    if (req.isAuthenticated()) {
                            auth = req.user.twitter.username;
                        } else {
                            auth = "Not Logged In";
                        }
                    
                    var allBars = {"auth": auth, "allBars": []};
                    
                    var i = -1;
                    var next = function() {
                        i++;
                        if (i < allBarsArray.length) {
                            var going = [];
                        
                            var urlArr = allBarsArray[i].url.split("");
                            var ind = urlArr.indexOf("&");
                            urlArr.splice(ind);
                            var readyUrl = urlArr.join("");
                            var readyEncUrl = decodeURIComponent(readyUrl);
                            
                            Bar.findOne({ "bar.url": readyEncUrl }, function (err, bar) {
                                if (err) console.log(err);
                                if (bar) {
                                    going = bar.bar.going;
                                
                                }
                                allBars.allBars.push({
                                    "image": allBarsArray[i].image_url,
                                    "url": readyEncUrl,
                                    "name": allBarsArray[i].name,
                                    "snippet": allBarsArray[i].snippet_text,
                                    "going": going
                                });
                                going = [];
                                next();
                            });
                        } else {
                            res.json(allBars);
                        }
                    }
                    next();
                })
                .catch(function (err) {
                    console.error(err);
                });
        });
        
    app.post("/addmetobar", function (req, res) {
        Bar.findOne({ "bar.url": req.body.bar }, function (err, bar) {
            if (err) console.log(err);
            if (bar) {
                var goingArr = bar.bar.going;
                goingArr.push(req.body.user);
                bar.bar.going = goingArr;
                bar.save(function (err){
                    if (err) console.log(err);
                })
            } else {
                var newBar = new Bar();
                
                newBar.bar.url = req.body.bar;
                newBar.bar.going = [req.body.user];
                newBar.bar.name = req.body.name;
                newBar.bar.image = req.body.image;
                newBar.bar.descr = req.body.descr;
                
                
                newBar.save(function (err) {
                    if (err) console.log(err);
                })
            }
        })
    });
    
    app.post("/removemefrombar", function (req, res) {
        Bar.findOne({ "bar.url": req.body.bar }, function (err, bar) {
            if (err) console.log(err);
            if (bar) {
                var goingArr = bar.bar.going;
                for (var i = 0; i < goingArr.length; i++) {
                    if (goingArr[i] === req.body.user) {
                        goingArr.splice(i, 1);
                        break;
                    }
                }
                bar.bar.going = goingArr;
                bar.save(function (err){
                    if (err) console.log(err);
                })
            } else {
                console.log("Not Found!");
            }
        })
    });
    
    app.route("/api/:id/mybars")
        .get(isLoggedIn, function(req, res){
            Bar.find({ "bar.going": req.user.twitter.username }, function (err, data) {
                if (err) console.log(err);
                var allBars = {"auth": req.user.twitter.username, "allBars": []};
                
                data.forEach(function(doc) {
                    allBars.allBars.push({
                            "image": doc.bar.image,
                            "url": doc.bar.url,
                            "name": doc.bar.name,
                            "snippet": doc.bar.descr,
                            "going": doc.bar.going
                        });
                });
                res.json(allBars);
            });
        });
};