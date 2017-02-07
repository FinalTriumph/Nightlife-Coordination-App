function addbutton(objButton){
    objButton.style.display = "none";
    document.getElementById("remove" + objButton.value).style.display = "inline";
    
    var targetval = document.getElementById(objButton.value);
    targetval.innerHTML = Number(targetval.innerHTML) + 1;
    
    var barName = document.querySelectorAll("a[href='" + objButton.value + "']");
    var imgLink = document.getElementById("image" + objButton.value).src;
    var descr = document.getElementById("descr" + objButton.value).innerHTML;
    
    var http = new XMLHttpRequest();
    var params = "bar=" + objButton.value + "&user=" + user + "&name=" + barName[0].innerHTML + "&image=" + imgLink + "&descr=" + descr;
    http.open("POST", window.location.origin + "/addmetobar", true);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    http.send(params);
    
    alert('You have been added to "' + barName[0].innerHTML + '".');
}

function removebutton(objButton){
    objButton.style.display = "none";
    document.getElementById("add" + objButton.value).style.display = "inline";
    
    var targetval = document.getElementById(objButton.value);
    targetval.innerHTML = Number(targetval.innerHTML) - 1;
    
    var http = new XMLHttpRequest();
    var params = "bar=" + objButton.value + "&user=" + user;
    http.open("POST", window.location.origin + "/removemefrombar", true);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    http.send(params);
    
    var barName = document.querySelectorAll("a[href='" + objButton.value + "']");
    alert('You have been removed from "' + barName[0].innerHTML + '".');
}