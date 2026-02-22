let font;
let points = [];
let bites = [];

function preload() {
  font = loadFont("./assets/copenhagen.otf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');

  const fontSize = 200;

  points = font.textToPoints("APPLE", 0, 0, fontSize, {
    sampleFactor: 0.18,
  });

  const bounds = font.textBounds("APPLE", 0, 0, fontSize);

  const offsetX = width / 2 - (bounds.x + bounds.w / 2);
  const offsetY = height / 2 - (bounds.y + bounds.h / 2);

  for (let p of points) {
    p.x += offsetX;
    p.y += offsetY;
  }
}

function mousePressed() {
  bites.push({
    x: mouseX,
    y: mouseY,
    r: 32,
  });
}

function draw() {
  background(255, 247, 240);

  noStroke();
  for (let p of points) {
    if (!isBitten(p.x, p.y)) {
      let rr = map(p.y, 0, height, 255, 205);
      let gg = map(p.y, 0, height, 90, 25);
      let bb = 90;
      fill(rr, gg, bb);
      circle(p.x, p.y, 5);
    }
  }

  fill(120);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("Click to take a bite", width / 2, height - 30);
}

function isBitten(x, y) {
  for (let b of bites) {
    if (dist(x, y, b.x, b.y) < b.r) return true;
  }
  return false;
}
