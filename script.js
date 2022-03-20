let canvasX
let canvasY
let backgroundColor
let fps = 5
let grid
let gridDensity = 50
let gridSpacing
let gameRunning = false;
let gridX
let gridY
let prevGridX
let prevGridY

function setup() {
  canvasX = windowWidth// * 0.95
  canvasY = windowHeight * 0.85
  canvasX = min(canvasX, canvasY)
  canvasY = canvasX
  let myCanvas = createCanvas(canvasX + 1, canvasY + 1)
  myCanvas.parent("#canvas")
  backgroundColor = window.getComputedStyle(document.getElementById("canvas")).getPropertyValue('background-color')
  background(backgroundColor)

  gridSpacing = canvasX / gridDensity

  grid = []
  for (let i = 0; i < canvasX / gridSpacing; i++) {
    grid.push([])
    for (let j = 0; j < canvasY / gridSpacing; j++) {
      grid[i].push(new cell())
      grid[i][j].spot = createVector(i, j)
      grid[i][j].draw()
    }
  }

}

function draw() {

  if (gameRunning) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        grid[i][j].numNeighbors = grid[i][j].countNeighbors()
      }
    }
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].alive && (grid[i][j].numNeighbors < 2 || grid[i][j].numNeighbors > 3)) {
          grid[i][j].changeStatus()
        } else if (!grid[i][j].alive && grid[i][j].numNeighbors == 3) {
          grid[i][j].changeStatus()
        }
      }
    }
  } else {
    if (mouseIsPressed) {
      prevGridX = gridX
      prevGridY = gridY
      gridX = floor(mouseX / gridSpacing)
      gridY = floor(mouseY / gridSpacing)
      if (gridX < 0 || gridX > gridDensity - 1 || gridY < 0 || gridY > gridDensity - 1 || (prevGridX == gridX && prevGridY == gridY)) {
        return
      }
      grid[gridX][gridY].changeStatus()
    }
  }
}

function mousePressed() {
  mouseIsPressed = true
}

function mouseClicked() {
  mouseIsPressed = false
  gridX = -1
  gridY = -1
}

function start() {
  gameRunning = true
  frameRate(fps)
}

function reset() {
  gameRunning = false
  frameRate(60)
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j].alive = false
      grid[i][j].draw()
    }
  }
}

class cell {
  constructor(spot = 0, alive = false, numNeighbors = 0) {
    this.spot = spot
    this.alive = alive
    this.numNeighbors = numNeighbors
    this.countNeighbors = function() {
      let neighbors = 0
      neighbors -= this.alive
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          let neighborX = this.spot.x + i
          let neighborY = this.spot.y + j
          if (neighborX < 0) {
            neighborX += gridDensity
          } else if (neighborX > gridDensity - 1) {
            neighborX -= gridDensity
          }
          if (neighborY < 0) {
            neighborY += gridDensity
          } else if (neighborY > gridDensity - 1) {
            neighborY -= gridDensity
          }

          neighbors += grid[neighborX][neighborY].alive
        }
      }
      return neighbors
    }
    this.draw = function() {
      stroke(backgroundColor)
      strokeWeight(1)
      if (this.alive) {
        fill(color(255, 0, 0))
      } else {
        fill(255)
      }
      rect(this.spot.x * gridSpacing, this.spot.y * gridSpacing, gridSpacing, gridSpacing)
    }
    this.changeStatus = function() {
      this.alive = !this.alive
      this.draw()
    }
  }
}
