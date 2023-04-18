var time = new Date();
var deltaTime = 0;

if(document.readyState === "complete" || document.readyState === "interactive"){
    setTimeout(main, 1);
}else{
    document.addEventListener("DOMContentLoaded", main); 
}

function main() {
    time = new Date();
    start();
    loop();
}

function loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    update();
    requestAnimationFrame(loop);
}
