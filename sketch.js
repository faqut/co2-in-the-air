let incomeGroups = ["High-income", "Upper-middle-income", "Lower-middle-income", "Low-income"];
let emissions = [1000, 750, 500, 250]; 
let colorsByYear = {
  "2010": ["#ff6f61", "#6baed6", "#78c679", "#fdae61"],
  "2015": ["#d62728", "#9467bd", "#8c564b", "#e377c2"],
  "2020": ["#1f77b4", "#ff7f0e", "#2ca02c", "#bcbd22"],
  "2025": ["#17becf", "#7f7f7f", "#c49c94", "#98df8a"]
};
let particles = [];
let bgImage; 
let yearSelector;
let years = ["2010", "2015", "2020", "2025"];
let currentYear = "2020";

function preload() {
  bgImage = loadImage("clouds.jpg"); 
}

function setup() 
{
  createCanvas(800, 600);
  
  for (let i = 0; i < 100; i++) {
    let groupIndex = floor(random(incomeGroups.length));
    let size = map(emissions[groupIndex], min(emissions), max(emissions), 30, 70); // Different size range
    let x = random(size, width - size);
     let y = random(size, height - size);
    particles.push(new Bubble(x, y, size, incomeGroups[groupIndex], emissions[groupIndex], colorsByYear[currentYear][groupIndex]));
  }

  // dropdown menu  
  yearSelector = createSelect();
  yearSelector.position(10, 10);
  for (let year of years) {
    yearSelector.option(year);
  }
  yearSelector.value(currentYear);
  yearSelector.changed(() => {
    currentYear = yearSelector.value();
    updateColorsForYear();
  });
}

function draw() {
  
    for (let y = 0; y < height; y++) {
    let c = lerpColor(color("#87CEEB"), color("#FFFFFF"), y / height);
    stroke(c);
    line(0, y, width, y);
  }

  tint(255, 150); 
  image(bgImage, 0, 0, width, height);


  //  particles
  for (let p of particles) {
    p.update();
    p.show();
    if (p.isHovered(mouseX, mouseY)) {
      p.explode();
      p.showInfo();
    }
  }

  //  title 
  fill(255, 204, 0);
  textSize(40);
  textAlign(CENTER);
  text("THE CO2 YOU MAKE AND BREATHE", width / 2, 50);
  
   textSize(16);
  fill(255);
  text("Bubbles represent income groups and their emissions in current year", width / 2, height - 20);
}


class Bubble {
  constructor(x, y, size, group, emissions, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.group = group;
    this.emissions = emissions;
    this.color = color;
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, 0.5);
    this.exploded = false;
    this.confetti = [];
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Bounce off side
    if (this.x > width - this.size / 2 || this.x < this.size / 2) {
      this.xSpeed *= -1;
    }
    if (this.y > height - this.size / 2 || this.y < this.size / 2) {
      this.ySpeed *= -1;
    }
 
    
    
    
    // Update confetti if exploded
    for (let c of this.confetti) {
      c.update();
    }
  }

  show() {
    // Create a gradient effect
    noStroke();
    let gradient = drawingContext.createRadialGradient(
      this.x, this.y, this.size / 4,
      this.x, this.y, this.size / 2
    );
    
    
  
    
       gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, color(255, 255, 255, 150));
    drawingContext.fillStyle = gradient;
    ellipse(this.x, this.y, this.size);

    // Show confetti if exploded
    for (let c of this.confetti) {
      c.show();
    }
  }

  isHovered(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.size / 2;
  }
  
  
  explode() {
    if (this.exploded) return; // Prevent multiple explosions
    this.exploded = true;

    for (let i = 0; i < 10; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 5);
      let confettiSize = random(this.size * 0.1, this.size * 0.2);
      this.confetti.push(new Confetti(this.x, this.y, confettiSize, angle, speed, this.color));
    }
  }

  showInfo() {
    fill(0);
    textSize(14);
    textAlign(CENTER);
    text(`${this.group}`, this.x, this.y - this.size / 2 - 15);
    text(`${this.emissions} tonnes`, this.x, this.y - this.size / 2);
  }
}

class Confetti {
  constructor(x, y, size, angle, speed, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.angle = angle;
    this.speed = speed;
    this.color = color;
     this.xSpeed = cos(angle) * speed;
    this.ySpeed = sin(angle) * speed;
    this.lifespan = 255;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.lifespan -= 5; // Fade out over time
  }

  show() {
    if (this.lifespan > 0) {
      fill(this.color);
      noStroke();
       ellipse(this.x, this.y, this.size);
     }  }
}

function updateColorsForYear() {
  let newColors = colorsByYear[currentYear];
  for (let i = 0; i < particles.length; i++) {
    let groupIndex = incomeGroups.indexOf(particles[i].group);
    if (groupIndex !== -1) {
      particles[i].color = newColors[groupIndex];
    }}
}

function mouseMoved() {
  redraw();
}
