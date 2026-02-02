let grains = [];
let size = 4;
let cols;
let heights;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('canvas-container');
  colorMode(HSB, 360, 100, 100);
  noStroke();
  cols = width / size;
  heights = new Array(cols).fill(0);
}

function draw() {
  background(220, 15, 25);

  
  if (frameCount % 60 == 0) {
    let col = floor(random(cols));
    let hue = map(hour() % 24, 0, 23, 0, 360);
    grains.push({x: col, y: 0, c: color(hue, 80, 90)});
  }

  
  for (let i = grains.length - 1; i >= 0; i--) {
    let g = grains[i];
    g.y += 2; 

    
    let floorY = height - heights[g.x] * size - size;
    if (g.y >= floorY) {
      heights[g.x]++;
      grains.splice(i, 1);
    } else {
      fill(g.c);
      rect(g.x * size, g.y, size, size);
    }
  }

  for (let x = 0; x < cols; x++) {
    for (let h = 0; h < heights[x]; h++) {
      let hue = map(hour() % 24, 0, 23, 0, 360);
      fill(hue, 80, 90);
      rect(x * size, height - (h + 1) * size, size, size);
    }
  }
}
