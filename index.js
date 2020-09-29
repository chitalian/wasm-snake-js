import { Universe, Cell, Direction } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg";

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
const CELL_SIZE = 10; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const FOOD_COLOR = "#00F000";


// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const getIndex = (row, column) => {
    return row * width + column;
  };
  
  const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  
    ctx.beginPath();
  
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);
        if (cells[idx] === Cell.Dead) {
          ctx.fillStyle = DEAD_COLOR;
        } else if (cells[idx] === Cell.Alive) {
          ctx.fillStyle = ALIVE_COLOR;
        } else if (cells[idx] === Cell.Food) {
          ctx.fillStyle = FOOD_COLOR;
        }
  
        ctx.fillRect(
          col * (CELL_SIZE + 1) + 1,
          row * (CELL_SIZE + 1) + 1,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }
  
    ctx.stroke();
  };

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines.
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }
  
    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }
  
    ctx.stroke();
};

const renderLoop = () => {
  if (!universe.is_gameover()) {
    universe.tick();
    sleepFor(100)
  
    drawGrid();
    drawCells();
  
    requestAnimationFrame(renderLoop);
  } else {
    alert("gameover")
  }

};

document.onkeydown = checkKey;

console.log("Hello")

function checkKey(e) {
    console.log("Hello")
    e.preventDefault(); 


    e = e || window.event;

    if (e.keyCode == '38') {
        console.log("Hello")
        universe.change_direction(Direction.Up);
    }
    else if (e.keyCode == '40') {
        universe.change_direction(Direction.Down);

        // down arrow
    }
    else if (e.keyCode == '37') {
        universe.change_direction(Direction.Left);

       // left arrow
    }
    else if (e.keyCode == '39') {
        universe.change_direction(Direction.Right);

       // right arrow
    }

}

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);