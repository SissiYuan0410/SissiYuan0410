let faceType = "circle";
let faceColor, eyeColor;
let x, y;

function setup() {
  createCanvas(800, 500);
  noLoop(); 
  randomizeFace(); 
}

function draw() {
  background(255);

  
  fill(faceColor);
  stroke(0);
  strokeWeight(2);
  ellipse(x, y, 160, 160);

  
  fill(eyeColor);
  noStroke();
  let dx = 35, dy = -10; 
  if (faceType === "circle") {
    ellipse(x - dx, y + dy, 30, 30);
    ellipse(x + dx, y + dy, 30, 30);
  } else {
    drawHeart(x - dx, y + dy, 20);
    drawHeart(x + dx, y + dy, 20);
  }

  
  stroke(0);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(x - 40, y + 30);
  vertex(x - 15, y + 50);
  vertex(x, y + 30);
  vertex(x + 15, y + 50);
  vertex(x + 40, y + 30);
  endShape();
}

function keyPressed() {
  if (key === ' ') {
    randomizeFace();
    redraw();
  }
}


function randomizeFace() {
  x = random(100, width - 100);
  y = random(100, height - 100);
  faceColor = color(random(255), random(255), random(255));
  eyeColor  = color(random(255), random(255), random(255));
  faceType = random(["circle", "heart"]);
}


function drawHeart(cx, cy, size) {
  beginShape();
  vertex(cx, cy);
  bezierVertex(cx - size, cy - size, cx - size, cy + size, cx, cy + size*1.5);
  bezierVertex(cx + size, cy + size, cx + size, cy - size, cx, cy);
  endShape(CLOSE);
}
