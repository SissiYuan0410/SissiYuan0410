let font;

const BG = [255, 247, 240];
const WORD = "SWIM";

let pos;
let vel;
let heading = 0;

const SPEED = 3.2;
const TURN = 0.08;

function preload() {
  font = loadFont("./assets/copenhagen.otf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');
  textFont(font);
  pos = createVector(width / 2, height / 2);
  vel = createVector(0, 0);
}

function draw() {
  background(...BG);
  drawWater();
  updateSwim();
  drawSwim();
  drawHint();
}

function updateSwim() {
  let ax = 0;
  let ay = 0;

  if (keyIsDown(65)) ax -= 1;
  if (keyIsDown(68)) ax += 1;
  if (keyIsDown(87)) ay -= 1;
  if (keyIsDown(83)) ay += 1;

  let a = createVector(ax, ay);
  if (a.magSq() > 0) {
    a.normalize().mult(0.28);
    vel.add(a);
    vel.limit(SPEED);
  } else {
    vel.mult(0.92);
  }

  if (vel.magSq() > 0.001) {
    const target = atan2(vel.y, vel.x);
    heading = lerpAngle(heading, target, TURN);
  }

  pos.add(vel);

  const m = 40;
  if (pos.x < m) pos.x = m;
  if (pos.x > width - m) pos.x = width - m;
  if (pos.y < m) pos.y = m;
  if (pos.y > height - m) pos.y = height - m;
}

function drawSwim() {
  push();
  translate(pos.x, pos.y);
  rotate(heading);

  const spacing = 46;

  textAlign(CENTER, CENTER);
  noStroke();
  fill(20, 140, 70);
  textSize(88);

  let totalW = 0;
  for (let i = 0; i < WORD.length; i++) totalW += textWidth(WORD[i]);
  totalW += spacing * (WORD.length - 1);

  let xCursor = -totalW / 2;

  for (let i = 0; i < WORD.length; i++) {
    const ch = WORD[i];
    const w = textWidth(ch);
    const x = xCursor + w / 2;

    const wiggle = sin(frameCount * 0.12 + i * 0.9) * 4;
    const roll = sin(frameCount * 0.1 + i * 0.7) * 0.05;

    push();
    translate(x, wiggle);
    rotate(roll);
    text(ch, 0, 0);
    pop();

    xCursor += w + spacing;
  }

  pop();
}

function drawWater() {
  noFill();
  stroke(120, 195, 255, 110);
  strokeWeight(2);

  const base = height * 0.55;
  const t = frameCount * 0.02;

  for (let k = 0; k < 3; k++) {
    beginShape();
    for (let x = -10; x <= width + 10; x += 12) {
      const y =
        base +
        k * 42 +
        sin(x * 0.02 + t * 1.6 + k) * 10 +
        sin(x * 0.06 + t * 2.2 + k * 0.7) * 4;
      vertex(x, y);
    }
    endShape();
  }
}

function drawHint() {
  noStroke();
  fill(120);
  textAlign(LEFT, TOP);
  textSize(12);
  text("WASD to swim", 14, 14);
}

function lerpAngle(a, b, t) {
  let d = ((b - a + PI) % TWO_PI) - PI;
  return a + d * t;
}
