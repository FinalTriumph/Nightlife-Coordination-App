document.getElementsByTagName("body")[0].style.opacity = "1";
document.getElementsByTagName("body")[0].style.transition = "linear 0.3s 0.3s";

document.getElementById("search-term").addEventListener("keypress", function(e){
    if (e.which == 13) {
        getbars();
    }
})