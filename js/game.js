const boardElement = document.querySelector("#board");
if (boardElement == null) throw new Error("#board element not found");

const levelsData = [
  {
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
  },
];

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
    this.board = JSON.parse(JSON.stringify(levelData.board));
    [this.playerX, this.playerY] = getPlayerCoordinates(this.board);
  }

  get tiles() {
    return this.board.flat();
  }

  getTile(x, y) {
    try {
      return this.board[y][x];
    } catch {
      return undefined;
    }
  }

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

function renderBoard() {
  boardElement.replaceChildren();
  for (const tile of gameState.level.tiles) {
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

function setupBoardElement() {
  boardElement.style.setProperty("--width", gameState.level.width);
  boardElement.style.setProperty("--height", gameState.level.height);
}

function resetLevel() {
  gameState.level = new Level(levelsData[gameState.currentLevelId]);
  setupBoardElement();
  renderBoard();
}

document.addEventListener("keydown", (event) => {
  const viewPlayElement = document.querySelector("#view-play");
  const userIsInGameView = viewPlayElement.style.display != "none";
  if (!userIsInGameView) return;

  var code = event.code;

  switch (code) {
    case "ArrowUp":
      gameState.level.moveUp();
      break;

    case "ArrowDown":
      gameState.level.moveDown();
      break;

    case "ArrowLeft":
      gameState.level.moveLeft();
      break;

    case "ArrowRight":
      gameState.level.moveRight();
      break;
    default:
      return;
  }
  renderBoard();
});

let gameState = {
  currentLevelId: 0,
  level: new Level(levelsData[0]),
};

setupBoardElement();
renderBoard();
