const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    board.push(row);
    for (let j = 0; j < columns; j++) {
      row.push("");
    }
  }
  return { board };
})();

const gameBoardController = (function () {
  const game = gameBoard;
  const board = game.board;
  let playerOne = "playerOne";
  let playerTwo = "playerTwo";
  const players = [
    {
      name: playerOne,
      mark: "x",
    },
    {
      name: playerTwo,
      mark: "o",
    },
  ];
  let activePlayer = players[0];
  const changePlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const play = function (x, y) {
    let playerMark = activePlayer.mark;
    board[x][y] = playerMark;
    checkWinner();
    changePlayer();
    console.log(`${activePlayer.name}'s turn.`);
    console.log(board);
  };
  return { play, activePlayer };
})();

//Screen Controller

const screenController = (function () {
  const boardDiv = document.querySelector(".gameBoard");
  const playerTurnDiv = document.querySelector(".playerTurn");
  const game = gameBoard;
  const board = game.board;
  const gameController = gameBoardController;

  // generateBoard
  const generateBoard = function () {
    boardDiv.textContent = "";
    board.forEach((row, x) =>
      row.forEach((value, y) => {
        const cell = document.createElement("button");
        cell.dataset.position = [x, y];
        cell.classList.add("cell");
        boardDiv.appendChild(cell);
        cell.textContent = value;
      })
    );
  };

  boardDiv.addEventListener("click", playARound);

  function playARound(e) {
    let cell = e.target;
    if (cell.textContent == "x" || cell.textContent == "o") return;
    let xyPos = cell.dataset.position.split(",");
    let x = xyPos[0];
    let y = xyPos[1];
    gameController.play(x, y);
    generateBoard();
  }

  return { generateBoard };
})();
screenController.generateBoard();

//check winning condition
function checkWinner() {
  const game = gameBoard;
  const board = game.board;
  const columns = {};
  const rows = {};
  createColumn(board);
  createRow(board);
  function createColumn(board) {
    board.forEach((row) => {
      row.forEach((cell, index) => {
        if (cell != "") {
          if (!columns[`column${index}`]) {
            columns[`column${index}`] = [];
          }
          columns[`column${index}`].push(cell);
        }
      });
    });
  }
  function createRow(board) {
    board.forEach((row, index) => {
      row.forEach((cell) => {
        if (cell != "") {
          if (!rows[`row${index}`]) {
            rows[`row${index}`] = [];
          }
          rows[`row${index}`].push(cell);
        }
      });
    });
  }
}
