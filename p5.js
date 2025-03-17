// Forest Fire Simulation with p5.js
// Features:
// - Spreading flames with particle effects
// - Smoke plumes rising from burning trees
// - Wind direction affecting fire spread
// - Regeneration over time

// Simulation constants
const GRID_SIZE = 80;
const CELL_SIZE = 6;

// States
const EMPTY = 0;
const TREE = 1;
const BURNING = 2;
const BURNT = 3;

// Forest parameters
const GROWTH_PROBABILITY = 0.00002; // Chance for a new tree to grow
const LIGHTNING_PROBABILITY = 0.000005; // Chance for lightning to strike
const FIRE_SPREAD_PROBABILITY = 0.15; // Base chance for fire to spread
const BURN_TIME = 300; // How long a tree burns before turning to ash

let grid = [];
let burnTimer = [];
let particles = [];
let windDirection = 90; // in degrees, 0 is up, 90 is right
let windStrength = 3;

// UI Controls
let igniteButton, resetButton;
let windDirSlider, windStrSlider;

function setup() {
  createCanvas(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
  
  // Create UI controls
  igniteButton = createButton('Start Fire');
  igniteButton.position(10, 10);
  igniteButton.mousePressed(igniteRandomFire);
  
  resetButton = createButton('Reset Forest');
  resetButton.position(100, 10);
  resetButton.mousePressed(initializeForest);
  
  windDirSlider = createSlider(0, 360, 90, 15);
  windDirSlider.position(10, 40);
  
  windStrSlider = createSlider(0, 10, 3, 1);
  windStrSlider.position(10, 70);
  
  // Initialize forest
  initializeForest();
}

function initializeForest() {
  grid = [];
  burnTimer = [];
  particles = [];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = [];
    burnTimer[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      // More trees in the middle, fewer on the edges
      let distFromCenter = dist(x, y, GRID_SIZE/2, GRID_SIZE/2) / (GRID_SIZE/2);
      let treeProbability = 0.65 * (1 - distFromCenter * 0.7);
      
      if (random() < treeProbability) {
        grid[y][x] = TREE;
      } else {
        grid[y][x] = EMPTY;
      }
      burnTimer[y][x] = 0;
    }
  }
}

function igniteRandomFire() {
  let x = floor(random(GRID_SIZE));
  let y = floor(random(GRID_SIZE));
  if (grid[y][x] === TREE) {
    grid[y][x] = BURNING;
    burnTimer[y][x] = BURN_TIME;
  }
}

function createFlameParticle(x, y) {
  particles.push({
    x: x * CELL_SIZE + CELL_SIZE/2 + random(-2, 2),
    y: y * CELL_SIZE + CELL_SIZE/2 + random(-2, 2),
    vx: random(-1, 1),
    vy: random(-3, -1), // Always rise upward
    size: random(2, 5),
    life: random(20, 60),
    color: color(255, random(100, 200), 0, random(150, 250)),
    isSmoke: false
  });
}

function createSmokeParticle(x, y) {
  // Calculate wind influence on particles
  let windRadians = radians(windDirection);
  let windX = cos(windRadians) * windStrength * 0.1;
  let windY = sin(windRadians) * windStrength * 0.1;
  
  particles.push({
    x: x * CELL_SIZE + CELL_SIZE/2 + random(-2, 2),
    y: y * CELL_SIZE + random(-2, 2),
    vx: random(-0.2, 0.2) + windX,
    vy: random(-1.5, -0.5) + windY,
    size: random(3, 8),
    life: random(100, 200),
    color: color(100, 100, 100, random(50, 150)),
    isSmoke: true
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Smoke is affected by wind
    if (p.isSmoke) {
      let windRadians = radians(windDirection);
      p.vx += cos(windRadians) * 0.01 * windStrength;
      p.vy += sin(windRadians) * 0.01 * windStrength;
      
      // Smoke particles grow and fade
      p.size += 0.05;
    }
    
    // Decrease life
    p.life--;
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    let alpha = p.life / (p.isSmoke ? 200 : 60) * 255;
    let c = p.color;
    fill(red(c), green(c), blue(c), alpha);
    ellipse(p.x, p.y, p.size, p.size);
  }
}

function updateFire() {
  let newGrid = JSON.parse(JSON.stringify(grid));
  
  // Calculate wind influence
  let windRadians = radians(windDirection);
  let windX = cos(windRadians);
  let windY = sin(windRadians);
  
  // Matrix to check neighbors, influenced by wind direction
  let neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1]
  ];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      
      // Tree growth in empty spaces
      if (grid[y][x] === EMPTY && random() < GROWTH_PROBABILITY) {
        newGrid[y][x] = TREE;
      }
      
      // Lightning strike on trees
      else if (grid[y][x] === TREE && random() < LIGHTNING_PROBABILITY) {
        newGrid[y][x] = BURNING;
        burnTimer[y][x] = BURN_TIME;
      }
      
      // Handle burning trees
      else if (grid[y][x] === BURNING) {
        // Create visual effects for burning trees
        if (random() < 0.3) createFlameParticle(x, y);
        if (random() < 0.1) createSmokeParticle(x, y);
        
        // Decrease burn timer
        burnTimer[y][x]--;
        
        // When burn timer runs out, tree becomes burnt
        if (burnTimer[y][x] <= 0) {
          newGrid[y][x] = BURNT;
        }
        
        // Check for fire spread to neighbors
        for (let n of neighbors) {
          let nx = x + n[0];
          let ny = y + n[1];
          
          // Check if neighbor is in bounds
          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            if (grid[ny][nx] === TREE) {
              // Calculate wind influence on fire spread
              let dotProduct = n[0] * windX + n[1] * windY;
              let windInfluence = 1 + (dotProduct > 0 ? dotProduct * windStrength * 0.1 : 0);
              
              // Higher chance to spread in wind direction
              if (random() < FIRE_SPREAD_PROBABILITY * windInfluence) {
                newGrid[ny][nx] = BURNING;
                burnTimer[ny][nx] = BURN_TIME;
              }
            }
          }
        }
      }
      
      // Burnt trees can slowly regrow
      else if (grid[y][x] === BURNT && random() < GROWTH_PROBABILITY * 5) {
        newGrid[y][x] = EMPTY;
      }
    }
  }
  
  grid = newGrid;
}

function draw() {
  background(30);
  
  // Update wind parameters from sliders
  windDirection = windDirSlider.value();
  windStrength = windStrSlider.value();
  
  // Update simulation
  updateFire();
  updateParticles();
  
  // Draw trees and fire
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let cellX = x * CELL_SIZE;
      let cellY = y * CELL_SIZE;
      
      if (grid[y][x] === TREE) {
        // Draw trees as green squares
        fill(0, 120 + random(-10, 10), 0);
        rect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      } 
      else if (grid[y][x] === BURNING) {
        // Draw burning trees with flickering effect
        let intensity = map(burnTimer[y][x], 0, BURN_TIME, 0, 1);
        let r = 200 + random(-20, 50) * intensity;
        let g = 100 + random(-50, 50) * intensity;
        fill(r, g, 0);
        rect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === BURNT) {
        // Draw burnt trees as dark gray
        fill(30 + random(-5, 5), 30 + random(-5, 5), 30 + random(-5, 5));
        rect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  
  // Draw particles on top
  drawParticles();
  
  // Draw wind direction indicator
  drawWindIndicator();
  
  // Draw control labels
  fill(255);
  text("Wind Direction: " + windDirection + "°", 180, 45);
  text("Wind Strength: " + windStrength, 180, 75);
}

function drawWindIndicator() {
  // Draw wind direction indicator
  let arrowLength = 30;
  let arrowX = width - 50;
  let arrowY = 50;
  
  push();
  translate(arrowX, arrowY);
  rotate(radians(windDirection));
  
  stroke(255);
  strokeWeight(2);
  line(0, 0, arrowLength, 0);
  line(arrowLength, 0, arrowLength - 10, -5);
  line(arrowLength, 0, arrowLength - 10, 5);
  
  // Wind strength indicator
  for (let i = 0; i < windStrength; i++) {
    line(i * 5, -2, i * 5 - 5, 0);
  }
  
  pop();
  
  // Text label
  fill(255);
  noStroke();
  textAlign(RIGHT);
  text("Wind", arrowX - 15, arrowY + 5);
}
