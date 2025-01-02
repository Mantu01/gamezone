const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const corners = [0, 2, 6, 8]

function checkWinner(board) {
  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (board[a][0] && board[a][0] === board[b][0] && board[a][0] === board[c][0]) {
      return true;
    }
  }
  return null;
};

function easyLevel(board) {
  let randomIndex = Math.floor(Math.random() * 9);
  while (board[randomIndex][0]) {
    randomIndex = Math.floor(Math.random() * 9);
  }
  return randomIndex;
};

function mediumLevel(board) {
  if (board[4] === null)
    return 4;
  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (board[a][0] && board[a][0] === board[b][0] && !board[c][0]) {
      return c;
    }
    if (board[a][0] && board[a][0] === board[c][0] && !board[b][0]) {
      return b;
    }
    if (board[b][0] && board[b][0] === board[c][0] && !board[a][0]) {
      return a;
    }
  }
  return easyLevel(board);
}

export {checkWinner, easyLevel, mediumLevel};