const boardElement = document.querySelector("#board");
if (boardElement == null) throw new Error("#board element not found");

function Empty() {
  return { type: "empty" };
}

function Target() {
  return { type: "empty", target: true };
}

function Player() {
  return { type: "player" };
}

function Box() {
  return { type: "box", movable: true };
}

function Obstacle() {
  return { type: "obstacle", immovable: true };
}

const firstLevelData = {
  width: 6,
  height: 7,
  board: [
    [Obstacle(), Empty(), Empty(), Empty(), Empty(), Empty()],
    [Obstacle(), Empty(), Player(), Box(), Target(), Empty()],
    [Empty(), Empty(), Empty(), Empty(), Empty(), Empty()],
    [Empty(), Box(), Target(), Empty(), Empty(), Empty()],
    [Empty(), Empty(), Box(), Empty(), Empty(), Empty()],
    [Empty(), Empty(), Empty(), Empty(), Empty(), Empty()],
    [Empty(), Empty(), Empty(), Empty(), Empty(), Empty()],
  ],
};

function getPlayerCoordinates(board) {
  for (let x = 0; x < board.length; x++) {
    let y = board[x].findIndex((tile) => tile.type === "player");
    if (y !== -1) {
      return [y, x];
    }
  }
  throw new Error("Player was not found in the level");
}

class Level {
  constructor(levelData) {
    this.width = levelData.width;
    this.height = levelData.height;
    this.board = levelData.board;
    [this.playerX, this.playerY] = getPlayerCoordinates(this.board);
    console.log(this);
  }

  get tiles() {
    return this.board.flat();
  }

  get currentTile() {
    return this.board[this.playerY][this.playerX];
  }

  getTile(x, y) {
    try {
      return this.board[y][x];
    } catch {
      return undefined;
    }
  }

  /*
  1. if targetTile.immovable then early return
  2. if targetTile is a box, check if that box can be moved in the same direction to the next tile
  3. if targetTile is a box, and the next target tile is a "target" type, need a way to distinguish 
     this type of tile
  */

  moveUp() {
    const targetTile = this.getTile(this.playerX, this.playerY - 1);
    if (targetTile == null) return;

    if (targetTile.type === "empty") {
      this.board[this.playerY - 1][this.playerX].type = "player";
      this.board[this.playerY][this.playerX].type = "empty";
      this.playerY--;
    } else if (targetTile.type === "box") {
      const nextTargetTile = this.getTile(this.playerX, this.playerY - 2);
      if (nextTargetTile == null) return;
      if (nextTargetTile.type == "empty") {
        this.board[this.playerY - 2][this.playerX].type = "box";
        this.board[this.playerY - 1][this.playerX].type = "player";
        this.board[this.playerY][this.playerX].type = "empty";
        this.playerY--;
      }
    }
  }

  moveDown() {
    const targetTile = this.getTile(this.playerX, this.playerY + 1);
    if (targetTile == null) return;

    if (targetTile.type === "empty") {
      this.board[this.playerY + 1][this.playerX].type = "player";
      this.board[this.playerY][this.playerX].type = "empty";
      this.playerY++;
    } else if (targetTile.type === "box") {
      const nextTargetTile = this.getTile(this.playerX, this.playerY + 2);
      if (nextTargetTile == null) return;
      if (nextTargetTile.type == "empty") {
        this.board[this.playerY + 2][this.playerX].type = "box";
        this.board[this.playerY + 1][this.playerX].type = "player";
        this.board[this.playerY][this.playerX].type = "empty";
        this.playerY++;
      }
    }
  }

  moveLeft() {
    const targetTile = this.getTile(this.playerX - 1, this.playerY);
    if (targetTile == null) return;

    if (targetTile.type === "empty") {
      this.board[this.playerY][this.playerX - 1].type = "player";
      this.board[this.playerY][this.playerX].type = "empty";
      this.playerX--;
    } else if (targetTile.type === "box") {
      const nextTargetTile = this.getTile(this.playerX - 2, this.playerY);
      if (nextTargetTile == null) return;
      if (nextTargetTile.type == "empty") {
        this.board[this.playerY][this.playerX - 2].type = "box";
        this.board[this.playerY][this.playerX - 1].type = "player";
        this.board[this.playerY][this.playerX].type = "empty";
        this.playerX--;
      }
    }
  }

  moveRight() {
    const targetTile = this.getTile(this.playerX + 1, this.playerY);
    if (targetTile == null) return;

    if (targetTile.type === "empty") {
      this.board[this.playerY][this.playerX + 1].type = "player";
      this.board[this.playerY][this.playerX].type = "empty";
      this.playerX++;
    } else if (targetTile.type === "box") {
      const nextTargetTile = this.getTile(this.playerX + 2, this.playerY);
      if (nextTargetTile == null) return;
      if (nextTargetTile.type == "empty") {
        this.board[this.playerY][this.playerX + 2].type = "box";
        this.board[this.playerY][this.playerX + 1].type = "player";
        this.board[this.playerY][this.playerX].type = "empty";
        this.playerX++;
      }
    }
  }
}

function setupBoardElement(level) {
  boardElement.style.setProperty("--width", level.width);
  boardElement.style.setProperty("--height", level.height);
  renderBoard();
}

function renderBoard() {
  boardElement.replaceChildren();
  for (const tile of level.tiles) {
    const node = document.createElement("div");

    node.classList.add("tile");
    if (tile.type === "empty" && tile.target) {
      node.classList.add("tile-target");
    } else {
      node.classList.add(`tile-${tile.type}`);
    }
    boardElement.appendChild(node);
  }
}

let level = new Level(firstLevelData);
setupBoardElement(level);

document.addEventListener("keydown", (event) => {
  const viewPlayElement = document.querySelector("#view-play");
  const userIsInGameView = viewPlayElement.style.display != "none";
  if (!userIsInGameView) return;

  var code = event.code;

  switch (code) {
    case "ArrowUp":
      level.moveUp();
      break;

    case "ArrowDown":
      level.moveDown();
      break;

    case "ArrowLeft":
      level.moveLeft();
      break;

    case "ArrowRight":
      level.moveRight();
      break;
    default:
      return;
  }
  renderBoard();
});
