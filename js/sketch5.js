const countsByDay = [5, 3, 1, 3, 1, 4, 2];

function setup(){
  createCanvas(600, 600);
  textFont('monospace');
}

function draw(){
  background(250);
  const margin = 60;
  const gap = (width - margin*2) / countsByDay.length;

  
  const maxCnt = max(countsByDay);
  const baseR = 40;       
  const addR  = 90;       

  
  fill(90); noStroke();
  textAlign(CENTER, TOP);
  text("Stomach Growth (per day total)", width/2, 16);

  for (let i=0; i<countsByDay.length; i++){
    const cnt = countsByDay[i];
    const x = margin + i*gap + gap/2;
    const y = height/2;

   
    const r = baseR + addR * (cnt / (maxCnt || 1));
  
    const pulse = 1 + 0.06 * sin(frameCount*0.05 + i);

  
    const t = cnt / (maxCnt || 1);
    fill(255*(0.6+t*0.4), 140*(1-t*0.6), 100*(1-t*0.8), 220);
    noStroke();
    circle(x, y, r * pulse);

  
    fill(80);
    textAlign(CENTER, TOP);
    text("Day " + (i+1) + "\n" + cnt, x, y + r*0.6);
  }
}
