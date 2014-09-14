rightDown = false;
leftDown = false;

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

function createBricks(o) {
  var out = [], x, y, col_max, color;
  var colors = ["red","green","blue","yellow"]
  for (var row=0; row<4; row++) {
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

function _draw(canvas) {
  var WIDTH = canvas.width, HEIGHT = canvas.height;
  var ctx = canvas.getContext("2d");
  function circle(c) {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(c.x,c.y,c.r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  function rect(r) {
    ctx.fillStyle = r.color;
    ctx.beginPath();
    ctx.rect(r.x,r.y,r.w,r.h);
    ctx.closePath();
    ctx.fill();
  }

  function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }
  return {
    circle: circle,
    rect: rect,
    clear: clear
  }
}

function getBounds(rect,r) {
  return {
    l: rect.x-r,
    r: rect.x+rect.w+r,
    t: rect.y-r,
    b: rect.y+rect.h+r
  }
}

function collide(ball,bricks,paddle,canvas) {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.x > canvas.width-ball.r) { ball.dx = -ball.dx }
  if (ball.x < ball.r) { ball.dx = -ball.dx }
  if (ball.y < ball.r) { ball.dy = -ball.dy }
  if (ball.y > canvas.height-ball.r) { return false; } // yer ded;
  bounds = getBounds(paddle,ball.r);
  if (ball.x > bounds.l && ball.x < bounds.r && ball.y > bounds.t && ball.y < bounds.b) {
    ball.dy = -Math.abs(ball.dy);
  }
  for (var i=0;i<bricks.length;i++) {
    var b = bricks[i];
    if (b.broken) { continue; }
    bounds = getBounds(b,ball.r);
    if (ball.x > bounds.l && ball.x < bounds.r && ball.y > bounds.t && ball.y < bounds.b) {
      var dxl = ball.x-bounds.l;
      var dxr = bounds.r+ball.x;
      if (dxl < ball.r || dxr < ball.r) { ball.dx = -ball.dx; }
      else { ball.dy = -ball.dy; }
      b.broken = true;
    }
  }
  return true; // doing science, still alive
}

function makeBall(canvas) {
  var ball = {
    dx: 3,
    dy: -3,
    r: 5
  }
  ball.x = (canvas.width - ball.r)/2;
  ball.y = canvas.height - 50;
  return ball;
}

function startGame() {
  window.stopGame = function() { clearInterval(game_interval); }
  window.stopGame();
  var canvas = document.getElementById("canvas");
  var paddle = {w: 60, h: 15, color: "white",v:4}
  paddle.x = (canvas.width - paddle.w)/2;
  paddle.y = (canvas.height - 30);
  var brick_options = {w: 40, h: 15, s: 5, canvas: canvas};
  var bricks = createBricks(brick_options);
  var ball = makeBall(canvas);

  var draw = _draw(canvas);

  function tick() {
    draw.clear();
    var alive = collide(ball,bricks,paddle,canvas);
    if (!alive) {
      ball = makeBall(canvas);
    }
    for(var i=0; i<bricks.length; i++) {
      var b = bricks[i];
      if (!b.broken) { draw.rect(b) };
    }
    if (rightDown) { paddle.x += paddle.v }
    if (leftDown) { paddle.x -= paddle.v }
    paddle.x = Math.min(paddle.x,canvas.width-paddle.w)
    paddle.x = Math.max(paddle.x,0)
    draw.rect(paddle);
    draw.circle(ball);
    draw.circle({x:ball.x,y:ball.y,color: "red",r:1})
  }
  var game_interval = setInterval(tick,15);
}
