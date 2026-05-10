let state = "start";

let startTime;
let baseWaitDuration = 10000;
let currentWaitDuration = 10000;
let clickCount = 0;

let result = "";
let resultCategory = "";

let bgColor;
let stageColor;

let data = {
  still: [
    "You are fully present. The answer is already within you.",
    "Silence holds more truth than movement.",
    "Nothing needs to be done.",
  ],
  calm: [
    "Patience reveals what force cannot.",
    "You are aligned with the pace of things.",
    "Clarity is forming naturally.",
  ],
  uneasy: [
    "A slight tension clouds your perception.",
    "You are beginning to doubt what you already know.",
    "Stillness is slipping away.",
  ],
  anxious: [
    "Your urgency creates noise around the truth.",
    "You are searching too hard for certainty.",
    "The answer is being buried by your movement.",
  ],
  restless: [
    "You cannot stay with the unknown.",
    "Your mind is pulling away from stillness.",
    "The answer becomes distorted through action.",
  ],
  impatient: [
    "You reached for the answer too quickly.",
    "Some truths close themselves when chased.",
    "You moved before the moment was ready.",
  ],
};

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent('canvas-container');

  textAlign(CENTER, CENTER);
}

function draw() {
  updateVisualStage();
  background(bgColor);

  if (state === "start") drawStart();
  if (state === "waiting") drawWaiting();
  if (state === "result") drawResult();
}

function drawStart() {
  fill(40);
  textSize(34);
  text("Time Delay Oracle", width / 2, 100);

  textSize(20);
  fill(70);
  text("Think of a question silently.", width / 2, 180);
  text("Hold it in your mind.", width / 2, 215);
  text("Then begin.", width / 2, 250);

  textSize(14);
  fill(120);
  text("The oracle reads your behavior, not your words.", width / 2, 315);

  drawButton(width / 2 - 55, 390, 110, 42, "Begin");
}

function drawWaiting() {
  let elapsed = millis() - startTime;

  currentWaitDuration = baseWaitDuration + clickCount * 600;

  let progress = constrain(elapsed / currentWaitDuration, 0, 1);

  fill(40);
  textSize(28);
  text("Waiting...", width / 2, 105);

  textSize(16);
  fill(90);
  text("The oracle is observing you.", width / 2, 150);

  textSize(14);
  fill(stageColor);
  text("State: " + getCurrentStage(), width / 2, 190);

  // bar background
  noStroke();
  fill(220);
  rect(width / 2 - 220, 245, 440, 20, 10);

  // bar fill
  fill(stageColor);
  rect(width / 2 - 220, 245, 440 * progress, 20, 10);

  fill(120);
  textSize(13);
  text("Clicks: " + clickCount, width / 2, 305);

  if (elapsed >= currentWaitDuration) {
    generateResult();
    state = "result";
  }
}

function drawResult() {
  fill(40);
  textSize(34);
  text("Your Result", width / 2, 95);

  textSize(18);
  fill(stageColor);
  text("State: " + resultCategory, width / 2, 145);

  fill(50);
  textSize(22);
  text(result, width / 2 - 220, 235, 440);

  fill(120);
  textSize(14);
  text("Click Restart to begin again.", width / 2, 360);

  drawButton(width / 2 - 55, 390, 110, 42, "Restart");
}

function startWaiting() {
  clickCount = 0;
  result = "";
  resultCategory = "";
  currentWaitDuration = baseWaitDuration;
  startTime = millis();
  state = "waiting";
}

function mousePressed() {
  if (state === "start" && overButton(width / 2 - 55, 390, 110, 42)) {
    startWaiting();
    return false;
  }

  if (state === "waiting") {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      clickCount++;
    }
    return false;
  }

  if (state === "result" && overButton(width / 2 - 55, 390, 110, 42)) {
    resetSketch();
    return false;
  }
}

function getCurrentStage() {
  if (clickCount <= 1) return "still";
  if (clickCount <= 4) return "calm";
  if (clickCount <= 8) return "uneasy";
  if (clickCount <= 14) return "anxious";
  if (clickCount <= 22) return "restless";
  return "impatient";
}

function updateVisualStage() {
  bgColor = color(248, 246, 242); // 米白

  let stage = getCurrentStage();

  if (stage === "still") stageColor = color(120, 170, 200);
  else if (stage === "calm") stageColor = color(130, 190, 160);
  else if (stage === "uneasy") stageColor = color(220, 180, 120);
  else if (stage === "anxious") stageColor = color(230, 140, 120);
  else if (stage === "restless") stageColor = color(220, 110, 140);
  else stageColor = color(200, 80, 80);
}

function generateResult() {
  resultCategory = getCurrentStage();
  result = random(data[resultCategory]);
}

function resetSketch() {
  state = "start";
  clickCount = 0;
  result = "";
  resultCategory = "";
}

function drawButton(x, y, w, h, label) {
  let hover = overButton(x, y, w, h);

  stroke(40);
  strokeWeight(1);
  fill(hover ? stageColor : color(248, 246, 242));
  rect(x, y, w, h, 20);

  noStroke();
  fill(hover ? 255 : 40);
  textSize(16);
  text(label, x + w / 2, y + h / 2);
}

function overButton(x, y, w, h) {
  return mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
}
