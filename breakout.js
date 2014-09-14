
function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function createBricks(o) {
  var out = [], x, y, col_max, color;
  var colors = ["red","green","blue","yellow"]
  for (var row=0; row<4; row++) {
    col_max = Math.floor(o.canvas.width / (o.w+o.s));
    if (row%2 == 0) { col_max -=1; }
    y = row*(o.h + o.s) + o.s;
    for (var col=0; col<col_max; col++) {
      x = col*(o.s + o.w) + o.s;
      color = colors[Math.floor((row+col)/colors.length)];
      out.push({x: x, y: y, color: color});
    }
  }
}

function startGame() {
  alert("Hello World"); //step 1

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var bricks = createBricks({w: 40, h: 15, s: 5, canvas: canvas})
  console.log(bricks);
}
