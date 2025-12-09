let scene = 0; 
let canvas;
const PREVENT_KEYS = [32, 37, 38, 39, 40]; 

function setup() {
  canvas = createCanvas(800, 416);
  canvas.elt.tabIndex = 0;
  canvas.elt.focus();

 
  window.addEventListener(
    "keydown",
    (e) => { if (PREVENT_KEYS.includes(e.keyCode)) e.preventDefault(); },
    { passive: false }
  );

  shooterSetup();
}

function draw() {
  if (scene === 0) shooterUpdate();
  else             mazeUpdate();
}


let worldSpeed = 5.5;
let player, obstacles, bullets, particles, clouds, hills;
let spawnTimer, score, targetScore, lives, fireCooldown;
let shootHeld = false;    
let canProceed = false;    

const questionTexts = [
  "How are your grades this semester?",
  "Where do you rank in your class?",
  "Are you still top five?",
  "Why aren't you studying harder?",
  "Can you get into a good school?",
  "This kid doesn’t talk much.",
  "Why doesn’t she say hello?",
  "Be more confident, speak up.",
  "Others are improving faster.",
  "Take more after-school classes.",
  "Am I good enough?",
  "What if I fail this exam?",
  "Everyone else seems better.",
  "Why can’t I focus like them?"
];

function shooterSetup() {
  player = new ShooterPlayer();
  obstacles = [];
  bullets = [];
  particles = [];
  clouds = [];
  hills = [];
  spawnTimer = 0;
  score = 0;
  targetScore = 500; 
  lives = 3;
  fireCooldown = 0;
  shootHeld = false;
  canProceed = false;

  for (let i = 0; i < 6; i++)
    clouds.push(new Cloud(random(width), random(40, 160), random(60, 140), random(0.2, 0.6)));
  for (let i = 0; i < 4; i++)
    hills.push(new Hill(i * 280 + random(-40, 40), random(280, 330), random(220, 320), random(0.4, 0.7)));
}

class ShooterPlayer {
  constructor() {
    this.x = 100;
    this.y = height / 2 - 18;
    this.w = 28;
    this.h = 28;
    this.speed = 5;
  }
  update() {
    if (keyIsDown(87)) this.y -= this.speed; // W
    if (keyIsDown(83)) this.y += this.speed; // S
    if (keyIsDown(65)) this.x -= this.speed; // A
    if (keyIsDown(68)) this.x += this.speed; // D

    this.y = constrain(this.y, 48, height - 48 - this.h);
    this.x = constrain(this.x, 40, width * 0.5 - this.w); 
  }
  hitbox() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }
  draw() {
    noStroke();
    fill(0, 0, 0, 25);
    rect(this.x - 3, this.y - 3, this.w + 6, this.h + 6, 6);
    fill(40);
    rect(this.x, this.y, this.w, this.h, 6);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 16; this.h = 6;
    this.vx = 11;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();
    this.x += this.vx;
  }
  offscreen() { return this.x > width + 20; }
  hitbox() { return { x: this.x, y: this.y, w: this.w, h: this.h }; }
  draw() {
    noStroke();
    for (let i = 0; i < this.trail.length; i++) {
      let a = map(i, 0, this.trail.length - 1, 40, 150);
      fill(255, 255, 255, a);
      rect(this.trail[i].x, this.trail[i].y, this.w, this.h, 2);
    }
    fill(255);
    rect(this.x, this.y, this.w, this.h, 2);
  }
}

class QuestionObstacle {
  constructor() {
    this.text = random(questionTexts);
    textSize(24);
    const tw = textWidth(this.text);
    this.w = constrain(tw + 60, 150, 360); 
    this.h = 28;
    this.x = width + 20;
    const bands = [100, 150, 200, 250, 300];
    this.y = random(bands);
  }
  update() { this.x -= worldSpeed; }
  offscreen() { return this.x + this.w < -30; }
  hitbox() {
    return { x: this.x - this.w / 2, y: this.y - 18, w: this.w, h: this.h + 18 };
  }
  draw() {
    textSize(24);
    textAlign(CENTER, CENTER);
    fill(0, 120);
    text(this.text, this.x + 2, this.y + 2);
    fill(255);
    text(this.text, this.x, this.y);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = random(-2.2, 2.2);
    this.vy = random(-2.2, 2.2);
    this.a = 255;
    this.size = random(2, 4);
  }
  update() { this.x += this.vx; this.y += this.vy; this.a -= 15; }
  dead() { return this.a <= 0; }
  draw() { noStroke(); fill(255, this.a); rect(this.x, this.y, this.size, this.size); }
}

function drawGradient() {
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(color(50, 70, 200), color(140, 190, 255), t);
    stroke(c); line(0, y, width, y);
  }
}
class Cloud {
  constructor(x, y, w, s) { this.x = x; this.y = y; this.w = w; this.s = s; }
  update() { this.x -= this.s; if (this.x < -this.w - 40) this.x = width + random(60, 160); }
  draw() {
    noStroke(); fill(255, 180);
    ellipse(this.x, this.y, this.w, this.w * 0.6);
    ellipse(this.x + this.w * 0.3, this.y - 8, this.w * 0.7, this.w * 0.45);
  }
}
class Hill {
  constructor(x, y, w, par) { this.x = x; this.y = y; this.w = w; this.par = par; }
  update() { this.x -= worldSpeed * this.par * 0.25; if (this.x < -this.w) this.x = width + random(100, 180); }
  draw() { noStroke(); fill(40, 60, 120, 120); arc(this.x, this.y, this.w, this.w * 0.6, PI, TWO_PI); }
}

function shooterUpdate() {
  drawGradient();
  for (const h of hills) { h.update(); h.draw(); }
  for (const c of clouds) { c.update(); c.draw(); }

  fill(255); textSize(16); textAlign(LEFT, TOP);
  text("Scene 1 – Shoot the Questions  |  WASD move   LEFT MOUSE shoot", 16, 12);

  if (fireCooldown > 0) fireCooldown--;
  if (shootHeld && !canProceed && fireCooldown === 0) {
    tryShoot();
  }

  spawnTimer--;
  if (spawnTimer <= 0 && !canProceed) {
    const ob = new QuestionObstacle();
    obstacles.push(ob);
    spawnTimer = int(random(40, 70));
  }

  player.update();
  bullets = bullets.filter(b => !b.offscreen());
  obstacles = obstacles.filter(o => !o.offscreen());
  for (const b of bullets) b.update();
  for (const o of obstacles) o.update();
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].dead()) particles.splice(i, 1);
  }

  for (let b = bullets.length - 1; b >= 0; b--) {
    let hit = false;
    for (let i = obstacles.length - 1; i >= 0; i--) {
      if (rectRect(bullets[b].hitbox(), obstacles[i].hitbox())) {
        for (let k = 0; k < 18; k++) particles.push(new Particle(obstacles[i].x, obstacles[i].y));
        bullets.splice(b, 1);
        obstacles.splice(i, 1);
        score += 50;
        hit = true;
        break;
      }
    }
    if (hit) break;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    if (rectRect(player.hitbox(), obstacles[i].hitbox())) {
      obstacles.splice(i, 1);
      lives--;
      for (let k = 0; k < 12; k++) particles.push(new Particle(player.x, player.y));
    }
  }


  for (const o of obstacles) o.draw();
  for (const bl of bullets) bl.draw();
  for (const p of particles) p.draw();
  player.draw();

  fill(255); textSize(20); textAlign(LEFT, BOTTOM);
  text("Score: " + score, 16, height - 18);
  textAlign(RIGHT, BOTTOM);
  text("Target: " + targetScore + "    Lives: " + lives, width - 16, height - 18);


  if (lives <= 0) {
    banner("Overwhelmed by questions. Click to retry.");
    return;
  }

  if (!canProceed && score >= targetScore) {
    canProceed = true;
    shootHeld = false;
  }
  if (canProceed) {
    banner("Target reached — LEFT CLICK to enter Scene 2.");
  }
}

function tryShoot() {
  bullets.push(new Bullet(player.x + player.w, player.y + player.h / 2 - 3));
  fireCooldown = 6;
}

const CELL = 32;
let maze, mPlayer, goalCell;

const MAZE_MAP = [
  "1111111111111111111111111",
  "1S00000100000001110000001",
  "1011100101111100100111111",
  "1000100100000100100000001",
  "1110100111110100111110101",
  "1000100000100100000010101",
  "1000000000100100000010101",
  "1011111100100111111010101",
  "1000000100100000001010001",
  "1111100100111111101011111",
  "1000000100000000101000001",
  "1011111111111100101111101",
  "10000000000001000000000G1"
];

function mazeSetup() { maze = new Maze(MAZE_MAP); }

class Maze {
  constructor(map) {
    this.rows = map.length;
    this.cols = map[0].length;
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        const ch = map[r][c];
        this.grid[r][c] = ch;
        if (ch === "S") mPlayer = new MazePlayer(c, r);
        if (ch === "G") goalCell = { c, r };
      }
    }
  }
  isWall(c, r) {
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return true;
    return this.grid[r][c] === "1";
  }
  drawBase() {
    for (let y = 0; y < height; y++) {
      let t = y / height;
      let c = lerpColor(color(230, 238, 255), color(210, 224, 255), t);
      stroke(c); line(0, y, width, y);
    }
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const ch = this.grid[r][c];
        noStroke();
        if (ch === "1") fill(60, 90, 160, 170);
        else fill(255, 230);
        rect(c * CELL, r * CELL, CELL, CELL, 6);
        if (ch === "S") { fill(40); textSize(14); text("S", c * CELL + 11, r * CELL + 21); }
        if (ch === "G") { fill(20); textSize(14); text("G", c * CELL + 11, r * CELL + 21); }
      }
    }
  }
}

class MazePlayer {
  constructor(c, r) { this.c = c; this.r = r; }
  tryMove(dc, dr) {
    const nc = this.c + dc, nr = this.r + dr;
    if (!maze.isWall(nc, nr)) { this.c = nc; this.r = nr; }
  }
  draw() { fill(40); rect(this.c * CELL + 6, this.r * CELL + 6, CELL - 12, CELL - 12, 6); }
  atGoal() { return this.c === goalCell.c && this.r === goalCell.r; }
}

function mazeUpdate() {
  maze.drawBase();
  fill(30); textSize(16); textAlign(LEFT, TOP);
  text("Scene 2 – Maze of Choices  |  Arrow keys (All roads lead to the Gate)", 16, 12);
  if (keyIsDown(LEFT_ARROW))  mPlayer.tryMove(-1, 0);
  if (keyIsDown(RIGHT_ARROW)) mPlayer.tryMove(1, 0);
  if (keyIsDown(UP_ARROW))    mPlayer.tryMove(0, -1);
  if (keyIsDown(DOWN_ARROW))  mPlayer.tryMove(0, 1);

  mPlayer.draw();

  fill(30); textSize(14); textAlign(CENTER, BOTTOM);
  const px = mPlayer.c * CELL + CELL / 2;
  const py = height - 14;
  if (mPlayer.r >= 2 && mPlayer.r <= 4)
    text("Path A: Stay in the domestic system — narrow but familiar.", px, py);
  else if (mPlayer.r >= 5 && mPlayer.r <= 7)
    text("Path B: Transition to international — between two worlds.", px, py);
  else if (mPlayer.r >= 8)
    text("Path C: Study abroad — lonely, but there is light ahead.", px, py);
  else text("Choose your path.", px, py);

  if (mPlayer.atGoal()) {
    banner("Different paths, same destination — but the journey shapes me. THE END.");
  }
}
function mousePressed() {
  if (canvas && canvas.elt) canvas.elt.focus();

  if (scene === 0) {
    if (canProceed) {
      scene = 1;
      mazeSetup();
      return false;
    }
    shootHeld = true;
    if (fireCooldown === 0) tryShoot();
    return false;
  }
  return true;
}

function mouseReleased() {
  if (scene === 0) {
    shootHeld = false;
    return false;
  }
  return true;
}

function rectRect(a, b) {
  return (a.x < b.x + b.w &&
          a.x + a.w > b.x &&
          a.y < b.y + b.h &&
          a.y + a.h > b.y);
}

function banner(msg) {
  push();
  noStroke();
  fill(0, 170);
  rect(80, height / 2 - 40, width - 160, 80, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(msg, width / 2, height / 2);
  pop();
}
