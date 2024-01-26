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
  const score = {
    playerOne: 0,
    playerTwo: 0,
  };

  const addScore = (player) => score[player]++;
  const getScore = () => score;

  let activePlayer = players[0];
  const changePlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const play = function (x, y) {
    let playerMark = activePlayer.mark;
    board[x][y] = playerMark;
    checkWinner(x, y);
    changePlayer();
    console.log(`${activePlayer.name}'s turn.`);
    console.log(board);
  };
  return { play, getActivePlayer, addScore, getScore };
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
    renderPlayerTurn();
  };

  boardDiv.addEventListener("click", playARound);

  function currentPlayer() {
    return gameController.getActivePlayer();
  }

  function renderPlayerTurn() {
    playerTurnDiv.textContent = "";
    let activePlayer = currentPlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn`;
  }

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
function checkWinner(x, y) {
  const game = gameBoard;
  const board = game.board;
  const gameController = gameBoardController;
  const columns = [];
  const rows = [];
  const crosses = [];
  let hasWinner = false;
  createColumnObj(board);
  createRowObj(board);
  createCrossObj(board);
  console.log(columns);
  console.log(rows);
  console.log(crosses);
  function check(obj) {
    let currentPlayer = gameController.getActivePlayer();
    obj.forEach((array) => {
      if (array.length == 3) {
        hasWinner = array.every((cell) => cell == currentPlayer.mark);
        return hasWinner;
      }
    });
  }
  check(columns);
  check(rows);
  check(crosses);
  if (hasWinner) {
    let winner = gameController.getActivePlayer().name;
    gameController.addScore(winner);
    let score = gameController.getScore();
    console.log(
      `the score is updated to playerOne:${score.playerOne} and playerTwo:${score.playerTwo} `
    );
  }
  // function columnObj(x, y) {
  //   let cell = board[x][y];
  //   if (!columns[y]) {
  //     columns[y] = [];
  //   }
  //   columns[y].push(cell);
  // }
  // function rowObj(x, y) {
  //   let cell = board[x][y];
  //   if (!rows[x]) {
  //     rows[x] = [];
  //   }
  //   rows[x].push(cell);
  // }
  function createColumnObj(board) {
    board.forEach((row) => {
      row.forEach((cell, index) => {
        if (cell != "") {
          if (!columns[index]) {
            columns[index] = [];
          }
          columns[index].push(cell);
        }
      });
    });
  }
  function createRowObj(board) {
    board.forEach((row, index) => {
      row.forEach((cell) => {
        if (cell != "") {
          if (!rows[index]) {
            rows[index] = [];
          }
          rows[index].push(cell);
        }
      });
    });
  }
  function createCrossObj(board) {
    if (board[1][1]) {
      let [cell1, cell2, cell3] = [board[0][0], board[1][1], board[2][2]];
      let [cell4, cell5, cell6] = [board[0][2], board[1][1], board[2][0]];
      if (cell1 != "" && cell2 != "" && cell3 != "") {
        crosses[0] = [cell1, cell2, cell3];
      }
      if (cell4 != "" && cell5 != "" && cell6 != "") {
        crosses[1] = [cell4, cell5, cell6];
      }
    }
  }
}
