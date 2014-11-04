var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "white";
context.beginPath();
context.rect(50,50,50,10);
context.fill();
context.closePath();
