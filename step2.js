var canvas = document.getElementById("canvas");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

function Draw(canvas) {
  var context = canvas.getContext("2d");
  function rect(r) {
    context.fillStyle = r.color;
    context.beginPath();
    context.rect(r.x, r.y, r.w, r.h);
    context.fill();
    context.closePath();
  }

  function circle(c) {
    context.fillStyle = c.color;
    context.beginPath();
    context.arc(c.x, c.y, c.r, 0, Math.PI*2, true);
    context.fill();
    context.closePath();
  }

  function clear() { context.clearRect(0,0,WIDTH,HEIGHT); }

  return {
    rect: rect,
    circle: circle,
    clear: clear
  }
}

var draw = Draw(canvas);

var paddle = {
  w: 60,
  h: 15,
  y: HEIGHT - 30,
  color: "white"
}

paddle.x = WIDTH/2 - paddle.w/2;

var ball = { r: 10, y: HEIGHT - 45, color: "white" }
ball.x = WIDTH/2;// arc is already centered!

draw.rect(paddle);
draw.circle(ball);
