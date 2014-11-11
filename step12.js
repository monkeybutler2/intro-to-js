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

  var brick_sprites = document.createElement("img");
  brick_sprites.src = "brick_sprites.png";
  function brick(b) {
    context.drawImage(brick_sprites,b.sx,b.sy,b.sw,b.sh,b.x,b.y,b.w,b.h);
  }

  return {
    rect: rect,
    circle: circle,
    clear: clear,
    brick: brick
  }
}

function Sound(src,repeat) {
  var elements = [];
  for (var i=0;i<repeat;i++) {
    var audio = document.createElement("audio");
    var mp3 = document.createElement("source");
    mp3.src = src + ".mp3";
    audio.appendChild(mp3);
    var wav = document.createElement("source");
    wav.src = src + ".wav";
    audio.appendChild(wav);
    elements.push(audio);
  }
  var last_played = 0;
  function play() {
    last_played +=1;
    if (last_played == repeat) {
      last_played = 0;
    }
    elements[last_played].play();
  }
  function stop() {
    elements[last_played].stop();
  }
  function set_volume(level) {
    for (var i=0;i<elements.length;i++) {
      elements[i].volume=level;
    }
  }
  return {
    play: play,
    stop: stop,
    set_volume: set_volume
  }
}

var draw = Draw(canvas);
var beep = new Sound("beep",1);
beep.set_volume(0.5);

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
  var sw = 16;
  var sh = 8;
  var sprite_rows = [0,1,2,3,4,5,6,7];
  for (var row=0; row<o.rows; row++) {
    col_max = Math.floor(o.canvas.width / (o.w+o.s));
    if (row%2 == 0) { col_max -=1; }
    y = (row+3)*(o.h + o.s) + o.s;
    for (var col=0; col<col_max; col++) {
      x = col*(o.s + o.w) + o.s;
      if (row%2 == 0) { x += o.w/2; }
      var sprite_row = sprite_rows[Math.floor((row+col)%sprite_rows.length)];
      sprite_col = Math.floor(Math.random()*5);
      var brick = {
        sx: sprite_col*sw,
        sy: sprite_row*sh,
        sw: sw,
        sh: sh,
        x: x,
        y: y,
        w: o.w,
        h: o.h,
        broken: false
      };
      out.push(brick);
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
  if (ball.x < ball.r) {
    ball.dx = Math.abs(ball.dx);
  }
  if (ball.x > WIDTH - ball.r) {
    ball.dx = -Math.abs(ball.dx) 
  } 
  if (ball.y < ball.r) {
    ball.dy = Math.abs(ball.dy);
  }
  if (ball.y > HEIGHT - ball.r) { resetBall(); }
  
  for (var i=0;i<bricks.length;i++) {
    var _b = bricks[i];
    if (!_b.broken) {
      var _c = collide(ball,_b);
      if (_c.x || _c.y) {
        _b.broken = true;
        beep.play();
        if (_c.x) { ball.dx = -ball.dx }
        if (_c.y) { ball.dy = -ball.dy }
        continue;
      }
    }
  }

  _c = collide(ball,paddle);
  if (_c.x || _c.y) {
    ball.dy = -Math.abs(ball.dy);
  }
}

function tick() {
  draw.clear();
  do_collisions()

  var now = new Date().valueOf();
  var elapsed_time = now - last_time;
  last_time = now;
  ball.x += ball.dx*elapsed_time/1000;
  ball.y += ball.dy*elapsed_time/1000;

  if (leftDown && paddle.x > 0) {
    paddle.x -= paddle.dx*elapsed_time/1000;
  }
  if (rightDown && paddle.x < WIDTH - paddle.w) {
    paddle.x += paddle.dx*elapsed_time/1000;
  }

  for (var i=0;i<bricks.length;i++) {
    _b = bricks[i];
    if (!_b.broken) {
      draw.brick(_b);
    }
  }

  draw.circle(ball);
  draw.rect(paddle);
  current_frame = requestAnimationFrame(tick);
}

function onMouseMove(event) {
  paddle.x = event.layerX-paddle.w/2;
}
//canvas.addEventListener("onmousemove",onMouseMove);
canvas.onmousemove = onMouseMove;

function tilt(bg) {
  var max_angle = 60;
  var angle = bg[1]+max_angle/2;
  paddle.x = angle/max_angle*WIDTH;
  paddle.x = Math.min(paddle.x,WIDTH - paddle.w);
  paddle.x = Math.max(paddle.x,0);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
        tilt([event.beta, event.gamma]);
    }, true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
    }, true);
} else {
    window.addEventListener("MozOrientation", function () {
        tilt([orientation.x * 50, orientation.y * 50]);
    }, true);
}

function stop() {
  cancelAnimationFrame(current_frame);
}

var last_time;
function start() {
  last_time = new Date().valueOf();
  var current_frame = requestAnimationFrame(tick);
}

resetBall();

