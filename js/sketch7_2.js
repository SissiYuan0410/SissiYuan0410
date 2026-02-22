let font;

let mode = "word";
let chosen = null;
let inputStr = "";
let feedback = null;

let items = [];
let hoverIdx = -1;

const WORD = "LOGIC";
const BG = [255, 247, 240];

function preload() {
  font = loadFont("./assets/copenhagen.otf");
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');
  textFont(font);
  resetAll();
}

function draw() {
  background(...BG);

  if (mode === "word") {
    drawWord();
  } else {
    drawSolve();
  }
}

function mouseMoved() {
  if (mode !== "word") return;
  hoverIdx = pickNearest(mouseX, mouseY, 22);
}

function mousePressed() {
  if (mode !== "word") return;

  const idx = pickNearest(mouseX, mouseY, 24);
  if (idx !== -1) {
    chosen = items[idx];
    mode = "solve";
    inputStr = "";
    feedback = null;
  }
}

function keyPressed() {
  if (key === "r" || key === "R") {
    resetAll();
    return;
  }

  if (mode === "solve") {
    if (keyCode === ESCAPE) {
      mode = "word";
      chosen = null;
      inputStr = "";
      feedback = null;
      return;
    }

    if (key === "Enter") {
      if (!chosen) return;
      const val = int(inputStr);
      feedback = val === chosen.ans;
      return;
    }

    if (key === "Backspace") {
      inputStr = inputStr.slice(0, -1);
      return;
    }

    if ((key >= "0" && key <= "9") || (key === "-" && inputStr.length === 0)) {
      inputStr += key;
    }
  }
}
function resetAll() {
  mode = "word";
  chosen = null;
  inputStr = "";
  feedback = null;
  hoverIdx = -1;

  buildDenseMathLetters(WORD);
}

function makeRandomProblem() {
  const op = random(["+", "-", "×"]);
  let a, b, ans;

  if (op === "+") {
    a = floor(random(0, 10));
    b = floor(random(0, 10));
    ans = a + b;
  } else if (op === "-") {
    a = floor(random(0, 10));
    b = floor(random(0, 10));
    if (b > a) [a, b] = [b, a];
    ans = a - b;
  } else {
    a = floor(random(1, 8));
    b = floor(random(1, 8));
    ans = a * b;
  }

  return { expr: `${a}${op}${b}`, ans };
}

function buildDenseMathLetters(word) {
  items = [];

  let letterFontSize = 210;
  let wordBounds;

  for (let k = 0; k < 35; k++) {
    wordBounds = font.textBounds(word, 0, 0, letterFontSize);
    if (wordBounds.w <= width * 0.84 && wordBounds.h <= height * 0.3) break;
    letterFontSize *= 0.92;
  }

  const letters = word.split("");
  let bList = letters.map((ch) => font.textBounds(ch, 0, 0, letterFontSize));

  const spacing = letterFontSize * 0.1;

  let totalW = 0;
  for (let b of bList) totalW += b.w;
  totalW += spacing * (letters.length - 1);

  const startX = width / 2 - totalW / 2;

  const centerY = height * 0.36;

  let cursorX = startX;

  for (let i = 0; i < letters.length; i++) {
    const ch = letters[i];
    const b = bList[i];

    const letterCx = cursorX + b.w / 2;
    const letterCy = centerY;

    const pts = font.textToPoints(ch, 0, 0, letterFontSize, {
      sampleFactor: 0.22,
    });
    const bounds = font.textBounds(ch, 0, 0, letterFontSize);

    const ox = letterCx - (bounds.x + bounds.w / 2);
    const oy = letterCy - (bounds.y + bounds.h / 2);

    const cell = 10;
    const hash = new Map();
    for (let p of pts) {
      const x = p.x + ox;
      const y = p.y + oy;
      const gx = floor(x / cell);
      const gy = floor(y / cell);
      const key = `${gx},${gy}`;
      if (!hash.has(key)) hash.set(key, []);
      hash.get(key).push({ x, y });
    }

    const stepX = 18;
    const stepY = 16;

    const left = bounds.x + ox;
    const top = bounds.y + oy;
    const right = left + bounds.w;
    const bottom = top + bounds.h;

    const insideRadius = 14;
    const shrink = 6;

    for (let y = top + shrink; y <= bottom - shrink; y += stepY) {
      for (let x = left + shrink; x <= right - shrink; x += stepX) {
        if (isNearLetterShape(x, y, hash, cell, insideRadius)) {
          const prob = makeRandomProblem();
          items.push({
            x,
            y,
            expr: prob.expr,
            ans: prob.ans,
            letterIndex: i,
          });
        }
      }
    }

    cursorX += b.w + spacing;
  }

  centerItemsOnCanvas();
}

function isNearLetterShape(x, y, hash, cell, r) {
  const gx = floor(x / cell);
  const gy = floor(y / cell);

  for (let yy = gy - 1; yy <= gy + 1; yy++) {
    for (let xx = gx - 1; xx <= gx + 1; xx++) {
      const key = `${xx},${yy}`;
      const arr = hash.get(key);
      if (!arr) continue;
      for (let p of arr) {
        if (dist(x, y, p.x, p.y) <= r) return true;
      }
    }
  }
  return false;
}

function pickNearest(mx, my, thresh) {
  let best = -1;
  let bestD = 1e9;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const d = dist(mx, my, it.x, it.y);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return bestD <= thresh ? best : -1;
}

function centerItemsOnCanvas() {
  if (items.length === 0) return;

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const it of items) {
    minX = min(minX, it.x);
    maxX = max(maxX, it.x);
    minY = min(minY, it.y);
    maxY = max(maxY, it.y);
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const dx = width / 2 - cx;
  const dy = height / 2 - cy;

  for (const it of items) {
    it.x += dx;
    it.y += dy;
  }
}

function drawWord() {
  textAlign(CENTER, CENTER);
  textSize(12);

  for (let i = 0; i < items.length; i++) {
    const it = items[i];

    if (i === hoverIdx) {
      fill(230, 35, 55, 235);
    } else {
      fill(70);
    }

    noStroke();
    textSize(12);
    text(it.expr, it.x, it.y);
  }
}

function drawSolve() {
  if (!chosen) return;

  textAlign(CENTER, CENTER);
  noStroke();
  fill(40);
  textSize(54);
  text(chosen.expr, width / 2, height * 0.34);

  const bx = width / 2;
  const by = height * 0.53;
  const bw = 260;
  const bh = 64;

  rectMode(CENTER);
  noFill();
  stroke(150);
  strokeWeight(3);
  rect(bx, by, bw, bh, 14);

  noStroke();
  fill(60);
  textSize(30);
  text(inputStr.length ? inputStr : "…", bx, by);

  if (feedback !== null) {
    textSize(20);
    if (feedback) {
      fill(20, 140, 70);
      text("Correct", width / 2, height * 0.67);
    } else {
      fill(200, 40, 60);
      text(`Wrong  ${chosen.ans}`, width / 2, height * 0.67);
    }
  }
  fill(120);
  textAlign(LEFT, TOP);
  textSize(12);
  text("Enter submit · ESC back · R regenerate", 14, 14);
}
