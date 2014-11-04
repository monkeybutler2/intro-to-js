var canvas = document.getElementById("canvas");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var rightDown = false;
var leftDown = false;

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(event) {
  if (event.keyCode == 39) rightDown = true;
  else if (event.keyCode == 37) leftDown = true;
}

//and unset them when the right or left key is released
function onKeyUp(event) {
  if (event.keyCode == 39) rightDown = false;
  else if (event.keyCode == 37) leftDown = false;
}

document.addEventListener("keydown",onKeyDown);
document.addEventListener("keyup",onKeyUp);

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
  dx: 200,
  color: "white"
}

paddle.x = WIDTH/2 - paddle.w/2;

var ball = {
  r: 10,
  y: HEIGHT - 45,
  color: "white"
}
ball.x = WIDTH/2;// arc is already centered!

var fps = 100;

function createBricks(o) {
  var out = [], x, y, col_max, color;
  var colors = ["red","green","blue","yellow"];
  for (var row=0; row<o.rows; row++) {
    col_max = Math.floor(o.canvas.width / (o.w+o.s));
    if (row%2 == 0) { col_max -=1; }
    y = (row+3)*(o.h + o.s) + o.s;
    for (var col=0; col<col_max; col++) {
      x = col*(o.s + o.w) + o.s;
      if (row%2 == 0) { x += o.w/2; }
      color = colors[Math.floor((row+col)%colors.length)];
      out.push({x: x, y: y, w: o.w, h: o.h, color: color, broken: false});
    }
  }
  return out;
}

var brick_options = {w: 40, h: 15, s: 5, canvas: canvas, rows: 4};
var bricks = createBricks(brick_options);

function collide(ball,brick) {
  var out = { x: false, y: false };
  var d_left = ball.x + ball.r - brick.x;
  var d_right = brick.x + brick.w - ball.x + ball.r;
  var d_top = ball.y + ball.r - brick.y;
  var d_bot = brick.y + brick.h - ball.y + ball.r;
  if (d_left > 0 && d_right > 0 && d_top > 0 && d_bot > 0) {
    if (Math.min(d_left,d_right) > Math.min(d_top,d_bot)) {
      out.y = true;
    }
    else {
      out.x = true;
    }
  }
  return out;
}

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
  if (ball.y < ball.r) {
    ball.dy = -ball.dy;
  }
  if (ball.y > HEIGHT - ball.r) { resetBall(); }
  
  for (var i=0;i<bricks.length;i++) {
    var _b = bricks[i];
    if (!_b.broken) {
      var _c = collide(ball,_b);
      if (_c.x || _c.y) {
        _b.broken = true;
        if (_c.x) { ball.dx = -ball.dx }
        if (_c.y) { ball.dy = -ball.dy }
        continue;
      }
      draw.rect(_b);
    }
  }

  _c = collide(ball,paddle);
  if (_c.x || _c.y) {
    ball.dy = - ball.dy;
  }
}

function tick() {
  draw.clear();
  do_collisions()

  ball.x += ball.dx/fps;
  ball.y += ball.dy/fps;
  if (leftDown) {
    paddle.x -= paddle.dx/fps;
  }
  if (rightDown) {
    paddle.x += paddle.dx/fps;
  }

  for (var i=0;i<bricks.length;i++) {
    _b = bricks[i];
    if (!_b.broken) {
      draw.rect(_b);
    }
  }

  draw.circle(ball);
  draw.rect(paddle);

}

resetBall();
var interval = setInterval(tick,1000/fps);
