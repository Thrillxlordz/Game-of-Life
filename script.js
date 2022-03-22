let canvasX
let canvasY
let backgroundColor
let fps = 5
let grid
let savedGrid
let saveExists = false
let gridDensity = 60
let gridSpacing
let gameRunning = false;
let gridX
let gridY
let prevGridX
let prevGridY
let settingAlive

function setup() {
  canvasX = windowWidth
  canvasY = windowHeight * 0.85
  canvasX = min(canvasX, canvasY)
  canvasY = canvasX
  let myCanvas = createCanvas(canvasX + 1, canvasY + 1)
  myCanvas.parent("#canvas")
  backgroundColor = window.getComputedStyle(document.getElementById("canvas")).getPropertyValue('background-color')
  background(backgroundColor)

  gridSpacing = canvasX / gridDensity

  grid = []
  savedGrid = []
  for (let i = 0; i < canvasX / gridSpacing; i++) {
    grid.push([])
    savedGrid.push([])
    for (let j = 0; j < canvasY / gridSpacing; j++) {
      grid[i].push(new cell())
      savedGrid[i].push(new cell())
      grid[i][j].spot = createVector(i, j)
      savedGrid[i][j].spot = createVector(i, j)
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
          grid[i][j].setLifeStatus(false)
        } else if (!grid[i][j].alive && grid[i][j].numNeighbors == 3) {
          grid[i][j].setLifeStatus(true)
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
      grid[gridX][gridY].setLifeStatus(settingAlive)
    }
  }
  strokeWeight(2)
  for (let i = 0; i < grid.length; i += 4) {
    line(i * gridSpacing, 0, i * gridSpacing, canvasY)
    line(0, i * gridSpacing, canvasX, i * gridSpacing)
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > canvasX || mouseY < 0 || mouseY > canvasY) {
    return
  }
  settingAlive = !grid[floor(mouseX / gridSpacing)][floor(mouseY / gridSpacing)].alive
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
  gameStarter.disabled = true
  gameSaveState.disabled = true
  gameLoadState.disabled = true
}

function reset() {
  gameRunning = false
  frameRate(60)

  gameStarter.disabled = false
  gameSaveState.disabled = false
  gameLoadState.disabled = !saveExists

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j].alive = false
      grid[i][j].draw()
    }
  }
}

function saveState() {
  if (gameRunning) {
    return
  }

  saveExists = true
  gameLoadState.disabled = false

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j].alive != savedGrid[i][j].alive) {
        savedGrid[i][j].alive = grid[i][j].alive
      }
    }
  }
}

function loadState() {
  if (gameRunning) {
    return
  }

  reset()
  for (let i = 0; i < savedGrid.length; i++) {
    for (let j = 0; j < savedGrid[0].length; j++) {
      if (grid[i][j].alive != savedGrid[i][j].alive) {
        grid[i][j].setLifeStatus(savedGrid[i][j].alive)
      }
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
    this.setLifeStatus = function(lifeStatus) {
      this.alive = lifeStatus
      this.draw()
    }
  }
}
