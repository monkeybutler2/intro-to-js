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

var ball = {
  r: 10,
  y: HEIGHT - 45,
  color: "white"
}
ball.x = WIDTH/2;// arc is already centered!

var fps = 100;

function resetBall() {
  ball.y = HEIGHT - 45;
  ball.x = WIDTH/2; // arc is already centered! 
  ball.dx = 150;
  ball.dy = -150; // up is negative!
}

function do_collisions() {
  if (ball.x < ball.r || ball.x > WIDTH - ball.r) {
    ball.dx = -ball.dx;
  }
  if (ball.y < ball.r || ball.y > HEIGHT - ball.r) {
    ball.dy = -ball.dy;
  }
}

var start = new Date().valueOf();
var last_time = new Date().valueOf();
var frames = 0;

function tick() {
  draw.clear();
  do_collisions()

  var now = new Date().valueOf();
  var elapsed_time = last_time - now;
  last_time = now;
  ball.x += ball.dx*elapsed_time/1000;
  ball.y += ball.dy*elapsed_time/1000;
  frames += 1;

  var time = (now-start)/1000;
  document.getElementById('frames').innerHTML = frames+" frames";
  document.getElementById('fps').innerHTML = Math.round(frames/time)+" fps";
  document.getElementById('mspf').innerHTML = Math.round(100*1000*time/frames)/100+" milliseconds per frame";
  draw.circle(ball);
  // adjust max value of i to slow this down
  for (var i=0;i<10000000;i++) { Math.sqrt(2) }
}

resetBall();
var interval = setInterval(tick,1000/fps);
