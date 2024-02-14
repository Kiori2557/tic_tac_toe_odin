const dialog = document.querySelector("dialog");
const show = document.querySelector("#show");
const startNewRoundBtn = document.querySelector(".newRoundBtn");
const startNewGameBtn = document.querySelector(".newGameBtn");

const gameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    board.push(row);
    for (let j = 0; j < columns; j++) {
      row.push(cell());
    }
  }
  const getBoard = () => board;
  const printBoard = () =>
    board.map((row) => row.map((cell) => cell.getValue()));
  return { board, printBoard, getBoard };
})();

function cell() {
  let value = "";
  const mark = (playerMarker) => (value = playerMarker);
  const getValue = () => value;
  return { getValue, mark };
}

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
  const resetScore = () => {
    score[playerOne] = 0;
    score[playerTwo] = 0;
  };

  let activePlayer = players[0];
  const changePlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;
  const getPlayer = () => players;

  const play = function (x, y) {
    let playerMark = activePlayer.mark;
    board[x][y].mark(playerMark);
    checkWinner();
    checkDraw();
    changePlayer();
    return board;
  };
  return { play, getPlayer, getActivePlayer, addScore, getScore, resetScore };
})();

//Screen Controller

const screenController = (function () {
  const displayScoreDiv = document.querySelector(".displayScore");
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
        cell.textContent = value.getValue();
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
  function updateScore(score, players) {
    const title = document.createElement("h3");
    const playOneScore = document.createElement("p");
    const playTwoScore = document.createElement("p");
    title.textContent = `Game Score`;
    playOneScore.textContent = `${players[0].name} : ${score.playerOne}`;
    playTwoScore.textContent = `${players[1].name} : ${score.playerTwo}`;
    displayScoreDiv.textContent = "";
    displayScoreDiv.append(title, playOneScore, playTwoScore);
  }
  return { generateBoard, updateScore };
})();
screenController.generateBoard();

//check winning condition
function checkWinner() {
  const dialog = document.querySelector("dialog");
  const board = gameBoard.getBoard();
  const boardWithValues = gameBoard.printBoard();
  const gameController = gameBoardController;
  const columns = [];
  const rows = [];
  const crosses = [];
  let hasWinner = false;
  createColumnObj(boardWithValues);
  createRowObj(boardWithValues);
  createCrossObj(boardWithValues);
  check(columns);
  check(rows);
  check(crosses);
  if (hasWinner) {
    let winner = gameController.getActivePlayer().name;
    gameController.addScore(winner);
    let score = gameController.getScore();
    let players = gameBoardController.getPlayer();
    screenController.updateScore(score, players);
    dialog.showModal();
  }
  function createColumnObj(boardWithValues) {
    boardWithValues.forEach((row) => {
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
  function createRowObj(boardWithValues) {
    boardWithValues.forEach((row, index) => {
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
  function createCrossObj(boardWithValues) {
    if (boardWithValues[1][1]) {
      let [cell1, cell2, cell3] = [
        boardWithValues[0][0],
        boardWithValues[1][1],
        boardWithValues[2][2],
      ];
      let [cell4, cell5, cell6] = [
        boardWithValues[0][2],
        boardWithValues[1][1],
        boardWithValues[2][0],
      ];
      if (cell1 != "" && cell2 != "" && cell3 != "") {
        crosses[0] = [cell1, cell2, cell3];
      }
      if (cell4 != "" && cell5 != "" && cell6 != "") {
        crosses[1] = [cell4, cell5, cell6];
      }
    }
  }
  function check(obj) {
    let player = gameController.getActivePlayer();

    obj.forEach((array) => {
      if (array.length == 3) {
        if (!hasWinner) {
          hasWinner = array.every((cell) => cell == player.mark);
        }
      }
    });
  }
}

function checkDraw() {
  let isDraw = false;
  let rowHasFreeCell = [true, true, true];
  const boardWithValues = gameBoard.printBoard();
  boardWithValues.forEach((row, index) => {
    rowHasFreeCell[index] = row.includes("");
  });
  isDraw = rowHasFreeCell.every((status) => status == false);
  if (isDraw) {
    dialog.showModal();
  }
}

startNewRoundBtn.addEventListener("click", resetRound);
startNewGameBtn.addEventListener("click", resetGame);

function resetRound() {
  const board = gameBoard.getBoard();
  let defaultMark = "";
  board.forEach((row) => {
    row.forEach((cell) => cell.mark(defaultMark));
  });
  screenController.generateBoard();
  dialog.close();
}
function resetGame() {
  resetRound();
  let score = gameBoardController.getScore();
  let players = gameBoardController.getPlayer();
  gameBoardController.resetScore();
  screenController.updateScore(score, players);
}
