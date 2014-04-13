define([], {
    log:function(msg){
        var p = document.createElement("p");
        p.innerHTML = msg;
        document.getElementById("log").appendChild(p);
    }
});