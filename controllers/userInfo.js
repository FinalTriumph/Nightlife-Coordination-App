"use strict";

var apiUrl = window.location.origin + "/api/:id";

function ready(fn) {
    if (typeof fn !== "function") {
        return;
    }
    if (document.readyState === "complete") {
        return fn();
    }
    document.addEventListener("DOMContentLoaded", fn, false);
}

function ajaxRequest (method, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
        }
    };
    xmlhttp.open(method, url, true);
    xmlhttp.send();
}

ready(ajaxRequest("GET", apiUrl, function(data) {
    var userObject = JSON.parse(data);
    
    if (userObject.displayName !== null) {
        document.getElementById("displayName").innerHTML = userObject.displayName;
    } else {
        document.getElementById("displayName").innerHTML = userObject.username;
    }
}));