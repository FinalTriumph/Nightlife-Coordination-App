"use strict";

var user;


document.getElementById("results").innerHTML = "";
document.getElementById("loader").style.display = "block";
    
var apiUrl = window.location.origin + "/api/:id/mybars";

function ready(fn) {
    if (typeof fn !== "function") {
        return;
    }
    if (document.readyState === "complete") {
        return fn();
    }
    document.addEventListener("DOMContentLoaded", fn, false);
}

function ajaxRequest(method, url, callback) {
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
    var barsObject = JSON.parse(data);
    console.log(barsObject);
    user = barsObject.auth;
    
    if (barsObject.allBars.length === 0) {
        document.getElementById("loader").style.display = "none";
        
        var newdiv = document.createElement("div");
        newdiv.className += "bardiv";
        newdiv.setAttribute("id", "nobarsyet");
        newdiv.innerHTML = "You haven't added yourself to any bars yet.";
        
        document.getElementById("results").appendChild(newdiv);
    }
    
    barsObject.allBars.forEach(function(bar){
        var newdiv = document.createElement("div");
        newdiv.className += "bardiv";
       
        var newImg = document.createElement("img");
        newImg.setAttribute("src", bar.image);
        newImg.setAttribute("alt", "Bar Image");
        newImg.setAttribute("class", "barimage");
        newImg.setAttribute("id", "image" + bar.url);
        newdiv.appendChild(newImg);
       
        var newTextDiv = document.createElement("div");
        newTextDiv.className += "textdiv";
       
        var newAnc = document.createElement("a");
        newAnc.setAttribute("href", bar.url);
        newAnc.setAttribute("target", "_blank");
        newAnc.setAttribute("class", "bartext");
        newAnc.innerHTML = bar.name;
        newTextDiv.appendChild(newAnc);
            
            
        var newGo = document.createElement("p1");
        newGo.className += "goingcnt";
        newGo.innerHTML = bar.going.length;
        newGo.setAttribute("id", bar.url);
        newTextDiv.appendChild(newGo);
            
        var newGoText = document.createElement("p1");
        newGoText.innerHTML = " going";
        newTextDiv.appendChild(newGoText);
            
        if (user !== "Not Logged In") {
            var added = false;
            for (var i = 0; i < bar.going.length; i++) {
                if (bar.going[i] === user) {
                    added = true;
                    break;
                }
            }
                
            var newAdd = document.createElement("button");
            newAdd.className += "gbtn";
            newAdd.setAttribute("id", "add" + bar.url);
            newAdd.innerHTML = "Add me";
            newAdd.value = bar.url;
            newAdd.setAttribute("onclick", "addbutton(this)");
                
            var newRemove = document.createElement("button");
            newRemove.className += "gbtn";
            newRemove.setAttribute("id", "remove" + bar.url);
            newRemove.innerHTML = "Remove me";
            newRemove.value = bar.url;
            newRemove.setAttribute("onclick", "removebutton(this)");
                
            if (added === true) {
                newAdd.style.display = "none";
            } else {
                newRemove.style.display = "none";
            }
                
            newTextDiv.appendChild(newAdd);
            newTextDiv.appendChild(newRemove);
                
        }
       
            
            
        var newBrake = document.createElement("br");
        newTextDiv.appendChild(newBrake);
       
        var newDescr = document.createElement("p1");
        newDescr.innerHTML = bar.snippet;
        newDescr.setAttribute("class", "bartext");
        newDescr.setAttribute("id", "descr" + bar.url);
        newTextDiv.appendChild(newDescr);
       
        newdiv.appendChild(newTextDiv);
            
        document.getElementById("loader").style.display = "none";
        document.getElementById("results").appendChild(newdiv);
    });
}));