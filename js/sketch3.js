function setup() {
  createCanvas(400, 600);
  stroke(0);
  strokeWeight(3);
  noFill();
}

function draw() {
  background(255);

rect(120, 50, 160, 100);
rect(150, 80, 100, 50);
line(200, 50, 170, 20);
line(200, 50, 230, 20);

rect(170, 95, 12, 8);
rect(220, 95, 12, 8);
line(180, 115, 220, 115);

rect(100, 180, 200, 180);

line(160, 180, 200, 250);
line(240, 180, 200, 250);

rect(191, 255, 18, 18);
line(200, 273, 188, 320);
line(200, 273, 212, 320);
line(188, 320, 200, 340);
line(212, 320, 200, 340);

const bodyBottomY = 180 + 180;
const centerX = 100 + 200/2;

line(centerX, bodyBottomY, centerX, 500);

line(centerX, 500, 160, 540);
line(centerX, 500, 240, 540);
line(centerX, 500, centerX, 550);

rect(155, 535, 12, 12);
rect(235, 535, 12, 12);
rect(194, 550, 12, 12);
}
