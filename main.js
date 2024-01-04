const gameBoard = function () {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    board.push(row);
    for (let j = 0; j < columns; j++) {
      row.push(0);
    }
  }
  return { board };
};

const gameBoardController = (function () {
  const game = gameBoard();
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
      mark: "y",
    },
  ];
  let activePlayer = players[0];
  const changePlayer = function () {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const play = function (x, y) {
    let playerMark = activePlayer.mark;
    board[x][y] = playerMark;
    changePlayer();
    console.log(`${activePlayer.name}'s turn.`);
    console.log(board);
  };
  return { game, play };
})();
