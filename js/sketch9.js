let state = 0; // 0=start, 1-7=questions, 8=result

let userHand = "";
let easyMode = false;

// Q2 drag task
let boxX = 150;
let boxY = 320;
let q2Done = false;
let boxSize = 52;

// Q3 typing on canvas
let typedText = "";
let q3Done = false;

// Q4 moving button
let runBtnX = 320;
let runBtnY = 320;
let q4Clicks = 0;
let q4NeededClicks = 0;
let q4Done = false;

// Q5 timing task
let q5StartTime = 0;
let q5EndTime = 0;
let q5Done = false;
let q5TargetX = 450;
let q5TargetY = 315;
let extraDelay = 0;

// Q6 feeling
let feelingAnswer = "";

// Q7 inclusive
let inclusiveAnswer = "";

// style
let bgColor = "#F5F1EA";
let panelColor = "#FFFDF8";
let accentColor = "#7E9B76";
let darkColor = "#2F2F2F";
let softLine = "#D8D2C8";

function setup() {
  let canvas = createCanvas(900, 650);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);
  rectMode(CORNER);
  textFont("Arial");
}

function draw() {
  background(bgColor);
  drawPanel();
  drawProgressBar();

  if (state === 0) startScreen();
  else if (state === 1) q1();
  else if (state === 2) q2();
  else if (state === 3) q3();
  else if (state === 4) q4();
  else if (state === 5) q5();
  else if (state === 6) q6();
  else if (state === 7) q7();
  else if (state === 8) resultScreen();
}

function drawPanel() {
  noStroke();
  fill(panelColor);
  rect(35, 35, width - 70, height - 70, 20);
}

function drawProgressBar() {
  if (state === 0) return;

  let totalSteps = 7;
  let currentStep = min(state, totalSteps);
  let barX = 100;
  let barY = 75;
  let barW = 700;
  let barH = 10;

  noStroke();
  fill(230);
  rect(barX, barY, barW, barH, 10);

  fill(accentColor);
  rect(barX, barY, map(currentStep, 0, totalSteps, 0, barW), barH, 10);

  fill(darkColor);
  textSize(14);
  text("Step " + currentStep + " / " + totalSteps, width / 2, 55);
}

function changeState(newState) {
  state = newState;

  if (state === 5) {
    q5StartTime = millis();
    q5Done = false;
  }
}

function drawButton(x, y, w, h, label, filled = false) {
  let hovering = overButton(x, y, w, h);

  stroke(accentColor);
  strokeWeight(1.5);

  if (filled) {
    fill(hovering ? "#93B08B" : accentColor);
  } else {
    fill(hovering ? "#F0ECE4" : "#FFFFFF");
  }

  rect(x, y, w, h, 14);

  noStroke();
  fill(filled ? "#FFFFFF" : darkColor);
  textSize(20);
  text(label, x + w / 2, y + h / 2);
}

function overButton(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}

function drawTitle(title, subtitle = "") {
  fill(darkColor);
  textSize(28);
  text(title, width / 2, 155);

  if (subtitle !== "") {
    textSize(17);
    fill(80);
    text(subtitle, width / 2, 195);
  }
}

function startScreen() {
  fill(accentColor);
  textSize(42);
  text("Designed for Right Hands", width / 2, 185);

  fill(darkColor);
  textSize(18);
  text(
    "A short interactive quiz about left-handed experience in everyday design.",
    width / 2,
    245
  );

  textSize(16);
  fill(90);
  text(
    "This version focuses on interaction, usability, and reflection.",
    width / 2,
    280
  );

  drawButton(width / 2 - 110, 355, 220, 58, "Start", true);
}

function q1() {
  drawTitle(
    "Which one are you?",
    "Your answer will change the difficulty of the next tasks."
  );

  drawButton(250, 285, 170, 65, "Left-handed", userHand === "Left-handed");
  drawButton(480, 285, 170, 65, "Right-handed", userHand === "Right-handed");

  if (userHand !== "") {
    fill(100);
    textSize(16);
    text("Selected: " + userHand, width / 2, 400);
    drawButton(width / 2 - 90, 490, 180, 56, "Next", true);
  }
}

function q2() {
  drawTitle(
    "Drag the square into the target.",
    easyMode
      ? "Left-handed mode: normal movement."
      : "Right-handed mode: movement is reversed."
  );

  let targetX = easyMode ? 640 : 650;
  let targetY = 260;
  let targetSize = easyMode ? 125 : 100;

  noFill();
  stroke(accentColor);
  strokeWeight(3);
  rect(targetX, targetY, targetSize, targetSize, 8);

  noStroke();
  fill(darkColor);
  textSize(18);
  text("Target", targetX + targetSize / 2, targetY + targetSize + 28);

  fill("#9E9E9E");
  stroke(darkColor);
  strokeWeight(1.5);
  rect(boxX, boxY, boxSize, boxSize, 6);

  noStroke();
  fill(darkColor);
  textSize(18);
  text("Drag me", boxX + boxSize / 2, boxY + boxSize + 22);

  if (
    boxX > targetX &&
    boxX + boxSize < targetX + targetSize &&
    boxY > targetY &&
    boxY + boxSize < targetY + targetSize
  ) {
    q2Done = true;
  }

  if (q2Done) {
    fill(accentColor);
    textSize(17);
    text("Nice. You got it.", width / 2, 455);
    drawButton(width / 2 - 90, 520, 180, 56, "Next", true);
  }
}

function q3() {
  drawTitle(
    "Type a short sentence.",
    "Part of the beginning is hidden, like a hand covering what was just written."
  );

  let boxAreaX = 180;
  let boxAreaY = 280;
  let boxAreaW = 540;
  let boxAreaH = 70;

  stroke(softLine);
  strokeWeight(1.5);
  fill("#FFFFFF");
  rect(boxAreaX, boxAreaY, boxAreaW, boxAreaH, 12);

  fill(darkColor);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(28);
  text(
    typedText + (frameCount % 60 < 30 ? "|" : ""),
    boxAreaX + 18,
    boxAreaY + boxAreaH / 2
  );

  let coverW = easyMode ? 110 : 190;

  fill(bgColor);
  rect(boxAreaX + 5, boxAreaY + 5, coverW, boxAreaH - 10, 10);

  fill("#D9D1C7");
  rect(boxAreaX - 5, boxAreaY - 5, coverW - 25, boxAreaH + 10, 20);
  ellipse(boxAreaX + coverW - 18, boxAreaY + boxAreaH / 2, 78, 78);

  fill(100);
  textAlign(CENTER, CENTER);
  textSize(14);
  text("hidden area", boxAreaX + coverW / 2, boxAreaY + 100);

  stroke(softLine);
  line(180, 385, 720, 385);

  if (typedText.length > 0) {
    q3Done = true;
    drawButton(width / 2 - 90, 520, 180, 56, "Next", true);
  }
}

function q4() {
  drawTitle(
    "Try to catch the button.",
    easyMode
      ? "It moves, but a little more slowly."
      : "It keeps moving away from you."
  );

  drawButton(runBtnX, runBtnY, 170, 60, "Catch me", true);

  if (q4Done) {
    fill(accentColor);
    textSize(17);
    text("You finally got it.", width / 2, 450);
    drawButton(width / 2 - 90, 520, 180, 56, "Next", true);
  }
}

function q5() {
  drawTitle(
    "Click the target as fast as you can.",
    "Your real time will be recorded and adjusted on the result page."
  );

  let targetSize = easyMode ? 46 : 30;

  fill(q5Done ? accentColor : "#FFFFFF");
  stroke(accentColor);
  strokeWeight(2);
  ellipse(q5TargetX, q5TargetY, targetSize, targetSize);

  noStroke();
  fill(darkColor);
  textSize(16);

  if (!q5Done) {
    let currentTime = ((millis() - q5StartTime) / 1000).toFixed(2);
    text("Current time: " + currentTime + "s", width / 2, 405);
  } else {
    let realTime = ((q5EndTime - q5StartTime) / 1000).toFixed(2);
    text("Recorded real time: " + realTime + "s", width / 2, 405);
    drawButton(width / 2 - 90, 520, 180, 56, "Next", true);
  }
}

function q6() {
  drawTitle("How did these interactions feel?");

  drawButton(170, 285, 150, 62, "Easy", feelingAnswer === "Easy");
  drawButton(375, 285, 150, 62, "Awkward", feelingAnswer === "Awkward");
  drawButton(580, 285, 150, 62, "Frustrating", feelingAnswer === "Frustrating");

  if (feelingAnswer !== "") {
    fill(100);
    textSize(16);
    text("Selected: " + feelingAnswer, width / 2, 405);
    drawButton(width / 2 - 90, 520, 180, 56, "Next", true);
  }
}

function q7() {
  drawTitle("Do you think everyday design is truly inclusive?");

  drawButton(255, 290, 150, 62, "Yes", inclusiveAnswer === "Yes");
  drawButton(495, 290, 180, 62, "Not really", inclusiveAnswer === "Not really");

  if (inclusiveAnswer !== "") {
    fill(100);
    textSize(16);
    text("Selected: " + inclusiveAnswer, width / 2, 410);
    drawButton(width / 2 - 105, 520, 210, 56, "See Result", true);
  }
}

function resultScreen() {
  let realTime = ((q5EndTime - q5StartTime) / 1000).toFixed(2);
  let adjustedTime = (Number(realTime) + extraDelay).toFixed(2);

  fill(accentColor);
  textSize(38);
  text("Result", width / 2, 155);

  fill(darkColor);
  textSize(22);
  text(
    "Small frustrations like these can be part of everyday life for left-handed users.",
    width / 2,
    240
  );

  textSize(18);
  fill(70);
  text("Your real click time: " + realTime + "s", width / 2, 325);
  text("System-adjusted time: " + adjustedTime + "s", width / 2, 360);

  textSize(17);
  fill(90);
  text(
    easyMode
      ? "Because you selected left-handed, the tasks were made easier for you."
      : "Because you selected right-handed, the tasks were made more difficult.",
    width / 2,
    420
  );

  text(
    "This project explores how design can quietly include some people and exclude others.",
    width / 2,
    455
  );

  drawButton(width / 2 - 100, 525, 200, 58, "Restart", true);
}

function mousePressed() {
  if (state === 0 && overButton(width / 2 - 110, 355, 220, 58)) {
    resetAll();
    changeState(1);
    return;
  }

  if (state === 1) {
    if (overButton(250, 285, 170, 65)) {
      userHand = "Left-handed";
      easyMode = true;
      q4NeededClicks = 2;
      extraDelay = 1.5;
    }

    if (overButton(480, 285, 170, 65)) {
      userHand = "Right-handed";
      easyMode = false;
      q4NeededClicks = 4;
      extraDelay = 4;
    }

    if (userHand !== "" && overButton(width / 2 - 90, 490, 180, 56)) {
      changeState(2);
    }
    return;
  }

  if (state === 2) {
    if (q2Done && overButton(width / 2 - 90, 520, 180, 56)) {
      changeState(3);
    }
    return;
  }

  if (state === 3) {
    if (q3Done && overButton(width / 2 - 90, 520, 180, 56)) {
      changeState(4);
    }
    return;
  }

  if (state === 4) {
    if (!q4Done && overButton(runBtnX, runBtnY, 170, 60)) {
      q4Clicks++;

      if (q4Clicks >= q4NeededClicks) {
        q4Done = true;
      } else {
        if (easyMode) {
          runBtnX = random(220, 510);
          runBtnY = random(270, 380);
        } else {
          runBtnX = random(120, 610);
          runBtnY = random(240, 420);
        }
      }
      return;
    }

    if (q4Done && overButton(width / 2 - 90, 520, 180, 56)) {
      changeState(5);
    }
    return;
  }

  if (state === 5) {
    let targetSize = easyMode ? 46 : 30;
    let d = dist(mouseX, mouseY, q5TargetX, q5TargetY);

    if (!q5Done && d < targetSize / 2) {
      q5Done = true;
      q5EndTime = millis();
      return;
    }

    if (q5Done && overButton(width / 2 - 90, 520, 180, 56)) {
      changeState(6);
    }
    return;
  }

  if (state === 6) {
    if (overButton(170, 285, 150, 62)) feelingAnswer = "Easy";
    if (overButton(375, 285, 150, 62)) feelingAnswer = "Awkward";
    if (overButton(580, 285, 150, 62)) feelingAnswer = "Frustrating";

    if (feelingAnswer !== "" && overButton(width / 2 - 90, 520, 180, 56)) {
      changeState(7);
    }
    return;
  }

  if (state === 7) {
    if (overButton(255, 290, 150, 62)) inclusiveAnswer = "Yes";
    if (overButton(495, 290, 180, 62)) inclusiveAnswer = "Not really";

    if (inclusiveAnswer !== "" && overButton(width / 2 - 105, 520, 210, 56)) {
      changeState(8);
    }
    return;
  }

  if (state === 8 && overButton(width / 2 - 100, 525, 200, 58)) {
    resetAll();
    changeState(0);
  }
}

function mouseDragged() {
  if (state === 2 && !q2Done) {
    if (easyMode) {
      boxX += movedX;
      boxY += movedY;
    } else {
      boxX -= movedX;
      boxY -= movedY;
    }

    boxX = constrain(boxX, 80, width - 140);
    boxY = constrain(boxY, 180, height - 170);
  }
}

function keyTyped() {
  if (state === 3) {
    if (typedText.length < 26) {
      typedText += key;
    }
    return false;
  }
}

function keyPressed() {
  if (state === 3) {
    if (keyCode === BACKSPACE && typedText.length > 0) {
      typedText = typedText.substring(0, typedText.length - 1);
      return false;
    }
  }
}

function resetAll() {
  userHand = "";
  easyMode = false;

  boxX = 150;
  boxY = 320;
  q2Done = false;

  typedText = "";
  q3Done = false;

  runBtnX = 320;
  runBtnY = 320;
  q4Clicks = 0;
  q4NeededClicks = 0;
  q4Done = false;

  q5StartTime = 0;
  q5EndTime = 0;
  q5Done = false;

  feelingAnswer = "";
  inclusiveAnswer = "";

  extraDelay = 0;
}
