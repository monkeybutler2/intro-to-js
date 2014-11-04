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

var ball = {
  r: 10,
  y: HEIGHT - 45,
  dx: 150,
  dy: -150, // up is negative!
  color: "white"
}
ball.x = WIDTH/2;// arc is already centered!

var fps = 100;

function tick() {
  draw.clear();
  if (ball.x < 0 || ball.x > WIDTH) { ball.dx = -ball.dx }
  if (ball.y < 0 || ball.y > HEIGHT) { ball.dy = -ball.dy }
  ball.x += ball.dx/fps;
  ball.y += ball.dy/fps;
  draw.circle(ball);
  draw.rect(paddle);
}

var interval = setInterval(tick,1000/fps);
