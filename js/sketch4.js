function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  background(250);

  let cols = 18; 
  let rows = 18; 
  let cell = width / cols;

  let t = frameCount * 0.05;

  let amplitude = mouseIsPressed ? 12 : 8;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cx = (x + 0.5) * cell;
      let cy = (y + 0.5) * cell;

      let d = dist(cx, cy, width/2, height/2);
      let pulse = sin(t - d * 0.05);

      let sz = 12 + pulse * amplitude;

      if ((x + y) % 2 === 0) fill(30);
      else fill(220);

      rect(cx, cy, sz, sz, 2);
    }
  }
}
