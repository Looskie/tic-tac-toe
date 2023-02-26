export const checkWinner = (board: string[][]): string | null => {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2] &&
      board[i][0] !== null
    ) {
      return board[i][0];
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (
      board[0][j] === board[1][j] &&
      board[1][j] === board[2][j] &&
      board[0][j] !== null
    ) {
      return board[0][j];
    }
  }

  // Check diagonals
  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== null
  ) {
    return board[0][0];
  }

  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== null
  ) {
    return board[0][2];
  }

  // check if all cells are filled (its a draw)
  if (board.flat().every((cell) => cell !== null)) {
    return "draw";
  }

  // If there is no winner, return null
  return null;
};
