let cam;
let appState = "start"; // start, camera, result

// attention box
let focusX, focusY;
let boxW = 220;
let boxH = 160;

// attention progress
let attentionValue = 0;
let attentionMax = 165;
let stableThreshold = 18;
let prevMouseX = 0;
let prevMouseY = 0;

// capture
let captureCount = 0;
let maxCaptures = 3;
let capturedShots = [];
let flashAlpha = 0;

// animation
let pulse = 0;

// colors
let COLORS = {
  bg: "#F4F1E8",
  panel: "#E7E1D2",
  panel2: "#D7DCC8",
  dark: "#354B3A",
  text: "#2A332B",
  softText: "#5E6B61",
  accent: "#8FAA7A",
  accent2: "#B9C9A7",
  line: "#C8C2B4",
  white: "#FAF8F2",
};

function setup() {
  let canvas = createCanvas(1280, 800);
  canvas.parent('canvas-container');
  rectMode(CENTER);
  imageMode(CENTER);
  textFont("Arial");

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  focusX = width / 2;
  focusY = height / 2;

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function draw() {
  background(COLORS.bg);
  pulse += 0.03;

  if (appState === "start") {
    drawStartScreen();
  } else if (appState === "camera") {
    drawCameraScreen();
  } else if (appState === "result") {
    drawResultScreen();
  }

  drawFlash();
}

function drawStartScreen() {
  drawBackgroundTexture();

  noStroke();
  fill(COLORS.dark);
  textAlign(CENTER, CENTER);
  textSize(66);
  text("ATTENTION CAMERA", width / 2, 135);

  fill(COLORS.softText);
  textSize(22);
  text(
    "A camera that does not value the entire image equally.\nIt records where attention lingers.",
    width / 2,
    210
  );

  fill(COLORS.white);
  stroke(COLORS.dark);
  strokeWeight(2);
  rect(width / 2, 425, 760, 340, 28);

  fill(COLORS.accent2);
  noStroke();
  rect(width / 2, 305, 760, 78, 28);

  fill(COLORS.dark);
  textSize(28);
  text("How it works", width / 2, 305);

  fill(COLORS.text);
  textSize(20);
  text(
    "1. Move the attention box with your mouse.\n" +
      "2. Keep it steady over something you want to focus on.\n" +
      "3. The progress bar fills as attention accumulates.\n" +
      "4. When full, the camera captures that moment.\n" +
      "5. Capture 3 moments to generate an attention report.",
    width / 2,
    445
  );

  noFill();
  stroke(COLORS.accent);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    ellipse(width / 2, 600, 70 + i * 26 + sin(pulse + i) * 3);
  }

  drawButton(width / 2, 690, 250, 70, "START");
}

function drawCameraScreen() {
  drawBackgroundTexture();

  // LEFT PANEL
  fill(COLORS.panel);
  stroke(COLORS.dark);
  strokeWeight(2);
  rectMode(CORNER);
  rect(22, 22, 270, height - 44, 24);

  fill(COLORS.dark);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(30);
  text("Attention\nCamera", 48, 48);

  fill(COLORS.softText);
  textSize(15);
  text("Selective recording system", 48, 132);

  fill(COLORS.text);
  textSize(18);
  text("Captured", 48, 192);

  fill(COLORS.dark);
  textSize(38);
  text(captureCount + " / " + maxCaptures, 48, 220);

  fill(COLORS.text);
  textSize(18);
  text("Attention level", 48, 310);

  fill(COLORS.white);
  stroke(COLORS.line);
  strokeWeight(1.5);
  rect(48, 345, 190, 18, 10);

  noStroke();
  fill(COLORS.accent);
  let progressW = map(attentionValue, 0, attentionMax, 0, 190);
  rect(48, 345, progressW, 18, 10);

  fill(COLORS.softText);
  textSize(14);
  text(getAttentionStatus(), 48, 372);

  fill(COLORS.text);
  textSize(18);
  text("Instructions", 48, 450);

  fill(COLORS.softText);
  textSize(15);
  text(
    "Move the frame with your mouse.\n" +
      "Stay on one area to build focus.\n" +
      "The camera only captures sustained attention.\n" +
      "Collect three moments.",
    48,
    480
  );

  drawSmallButton(157, 715, 180, 50, "RESET SESSION");

  // HEADER AREA
  fill(COLORS.dark);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(40);
  text("Camera Interface", 340, 42);

  fill(COLORS.softText);
  textSize(18);
  text(
    "Only the attended area remains visible and becomes recordable.",
    340,
    92
  );

  fill(COLORS.text);
  textSize(17);
  text("System status: " + getAttentionStatus(), 340, 126);

  // MAIN FRAME
  let camX = 815;
  let camY = 420;
  let camW = 865;
  let camH = 560;

  fill(COLORS.white);
  stroke(COLORS.dark);
  strokeWeight(2);
  rectMode(CENTER);
  rect(camX, camY, camW, camH, 28);

  // CAMERA VIEW
  let viewX = camX;
  let viewY = 405;
  let viewW = 760;
  let viewH = 470;

  push();
  translate(viewX, viewY);

  fill(210);
  noStroke();
  rect(0, 0, viewW, viewH, 18);

  image(cam, 0, 0, viewW, viewH);

  fill(40, 90);
  rect(0, 0, viewW, viewH, 18);

  drawGrid(viewW, viewH);

  let camLeft = viewX - viewW / 2;
  let camTop = viewY - viewH / 2;

  focusX = constrain(mouseX, camLeft + boxW / 2, camLeft + viewW - boxW / 2);
  focusY = constrain(mouseY, camTop + boxH / 2, camTop + viewH - boxH / 2);

  let sx = map(focusX, camLeft, camLeft + viewW, 0, cam.width);
  let sy = map(focusY, camTop, camTop + viewH, 0, cam.height);
  let sw = map(boxW, 0, viewW, 0, cam.width);
  let sh = map(boxH, 0, viewH, 0, cam.height);

  image(
    cam,
    focusX - viewX,
    focusY - viewY,
    boxW,
    boxH,
    sx - sw / 2,
    sy - sh / 2,
    sw,
    sh
  );

  noFill();
  stroke(255, 150);
  strokeWeight(10);
  rect(focusX - viewX, focusY - viewY, boxW + 10, boxH + 10, 18);

  stroke(COLORS.accent2);
  strokeWeight(3);
  rect(focusX - viewX, focusY - viewY, boxW, boxH, 14);

  pop();

  updateAttention(camX, viewY);
  drawThumbnails();

  if (captureCount >= maxCaptures) {
    appState = "result";
  }
}

function drawResultScreen() {
  drawBackgroundTexture();

  fill(COLORS.dark);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(54);
  text("ATTENTION REPORT", width / 2, 90);

  fill(COLORS.softText);
  textSize(22);
  text(
    "The camera preserved only what attention chose to hold.",
    width / 2,
    140
  );

  let startX = 250;
  let gap = 350;

  for (let i = 0; i < capturedShots.length; i++) {
    let x = startX + i * gap;
    let y = 355;

    fill(COLORS.white);
    stroke(COLORS.dark);
    strokeWeight(2);
    rect(x, y, 290, 235, 20);

    fill(COLORS.accent2);
    noStroke();
    rect(x, y - 92, 290, 46, 20);

    fill(COLORS.dark);
    textSize(18);
    text("Capture " + (i + 1), x, y - 92);

    if (capturedShots[i]) {
      image(capturedShots[i], x, y + 12, 242, 170);
    }
  }

  fill(COLORS.panel);
  stroke(COLORS.dark);
  strokeWeight(2);
  rect(width / 2, 635, 760, 130, 20);

  noStroke();
  fill(COLORS.text);
  textSize(21);
  text(
    "This prototype suggests that seeing is selective.\n" +
      "What is remembered is not everything in the frame,\n" +
      "but only what attention stays with.",
    width / 2,
    635
  );

  drawButton(width / 2, 745, 240, 60, "TRY AGAIN");
}

function drawBackgroundTexture() {
  noStroke();

  fill(255, 30);
  ellipse(180, 130, 240, 120);
  ellipse(1110, 150, 280, 130);
  ellipse(1100, 690, 230, 110);

  stroke(255, 25);
  strokeWeight(1);
  for (let y = 0; y < height; y += 34) {
    line(0, y, width, y);
  }
}

function drawGrid(w, h) {
  stroke(255, 35);
  strokeWeight(1);
  for (let x = -w / 2; x <= w / 2; x += 65) {
    line(x, -h / 2, x, h / 2);
  }
  for (let y = -h / 2; y <= h / 2; y += 54) {
    line(-w / 2, y, w / 2, y);
  }
}

function updateAttention(camX, camY) {
  let moveAmount = dist(mouseX, mouseY, prevMouseX, prevMouseY);

  if (moveAmount < stableThreshold) {
    attentionValue += 1.25;
  } else {
    attentionValue -= 2.2;
  }

  attentionValue = constrain(attentionValue, 0, attentionMax);

  prevMouseX = mouseX;
  prevMouseY = mouseY;

  if (attentionValue >= attentionMax) {
    saveAttentionMoment(camX, camY);
    attentionValue = 0;
  }
}

function saveAttentionMoment(camX, camY) {
  if (captureCount >= maxCaptures) return;

  let viewW = 760;
  let viewH = 470;
  let camLeft = camX - viewW / 2;
  let camTop = camY - viewH / 2;

  let sx = map(focusX, camLeft, camLeft + viewW, 0, cam.width);
  let sy = map(focusY, camTop, camTop + viewH, 0, cam.height);
  let sw = map(boxW, 0, viewW, 0, cam.width);
  let sh = map(boxH, 0, viewH, 0, cam.height);

  let shot = cam.get(sx - sw / 2, sy - sh / 2, sw, sh);

  capturedShots.push(shot);
  captureCount++;
  flashAlpha = 180;
}

function drawThumbnails() {
  fill(COLORS.text);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
  text("Saved moments", 340, 620);

  for (let i = 0; i < maxCaptures; i++) {
    let x = 340 + i * 138;
    let y = 655;

    fill(COLORS.white);
    stroke(COLORS.line);
    strokeWeight(1.5);
    rectMode(CORNER);
    rect(x, y, 118, 76, 12);

    if (capturedShots[i]) {
      imageMode(CORNER);
      image(capturedShots[i], x + 7, y + 7, 104, 62);
      imageMode(CENTER);
    }
  }
}

function drawFlash() {
  if (flashAlpha > 0) {
    noStroke();
    fill(255, flashAlpha);
    rectMode(CORNER);
    rect(0, 0, width, height);
    flashAlpha -= 12;
  }
}

function getAttentionStatus() {
  if (attentionValue < attentionMax * 0.25) {
    return "scanning...";
  } else if (attentionValue < attentionMax * 0.6) {
    return "focusing...";
  } else if (attentionValue < attentionMax) {
    return "locking attention...";
  } else {
    return "captured";
  }
}

function drawButton(x, y, w, h, label) {
  let hover =
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2;

  fill(hover ? COLORS.accent : COLORS.dark);
  stroke(COLORS.dark);
  strokeWeight(2);
  rectMode(CENTER);
  rect(x, y, w, h, 16);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(label, x, y);
}

function drawSmallButton(x, y, w, h, label) {
  let hover =
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2;

  fill(hover ? COLORS.accent : COLORS.softText);
  stroke(COLORS.dark);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(x, y, w, h, 12);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(label, x, y);
}

function mousePressed() {
  if (appState === "start") {
    if (overButton(width / 2, 690, 250, 70)) {
      resetSession();
      appState = "camera";
    }
  } else if (appState === "camera") {
    if (overButton(157, 715, 180, 50)) {
      resetSession();
    }
  } else if (appState === "result") {
    if (overButton(width / 2, 745, 240, 60)) {
      resetSession();
      appState = "camera";
    }
  }
}

function overButton(x, y, w, h) {
  return (
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2
  );
}

function resetSession() {
  attentionValue = 0;
  captureCount = 0;
  capturedShots = [];
  flashAlpha = 0;
}
