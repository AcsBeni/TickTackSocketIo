const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const xWinsEl = document.getElementById("xWins");
const oWinsEl = document.getElementById("oWins");

let currentPlayer = "X";
let gameActive = true;
let gameState = Array(9).fill("");

let xPlayerWins=0
let oPlayerWins=0

const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function handleCellClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());

  if (checkWin()) {
  turnText.textContent = `Player ${currentPlayer} wins!`;

  if (currentPlayer === "X") {
    xPlayerWins++;
    xWinsEl.textContent = xPlayerWins;
  } else {
    oPlayerWins++;
    oWinsEl.textContent = oPlayerWins;
  }

  gameActive = false;

  setTimeout(resetGame, 1500);
  return;
}
function resetGame() {
  gameState = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  turnText.textContent = "Your turn: X";

  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });
}



  if (!gameState.includes("")) {
    turnText.textContent = "Draw!";
    gameActive = false;
    setTimeout(resetGame, 1500);
    return; 
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnText.textContent = `Your turn: ${currentPlayer}`;
}

function checkWin() {
  return winningCombinations.some(combo => {
    return combo.every(i => gameState[i] === currentPlayer);
  });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
