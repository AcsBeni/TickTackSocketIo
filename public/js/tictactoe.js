const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const turnText = document.getElementById("turnText");
const xWinsEl = document.getElementById("xWins");
const oWinsEl = document.getElementById("oWins");
const playerReady = document.getElementById("playerReady")
const buttonReady = document.querySelector(".btn-ready")


let currentPlayer = "X";
let gameActive = true;
let gameState = Array(9).fill("");

let matchEnded = false

let xPlayerWins=0
let oPlayerWins=0
let playersReady=0

function getReady(){
    if(matchEnded){
        playersReady++
        if(playersReady >=2){
            playersReady=2
            playerReady.textContent = playersReady
            setTimeout(resetGame, 2000);
            setTimeout(resetNumbers, 2000)
            return
        }
        playerReady.textContent = playersReady
    }
    function resetNumbers(){
        playersReady =0
        playerReady.textContent = playersReady
        matchEnded = false
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
}

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

  matchEnded = true
  return;
}


    if (!gameState.includes("")) {
        turnText.textContent = "Draw!";
        gameActive = false;
        matchEnded = true
        return; 
    }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  turnText.textContent = `Rajtad a sor: ${currentPlayer}`;
}

function checkWin() {
  return winningCombinations.some(combo => {
    return combo.every(i => gameState[i] === currentPlayer);
  });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
buttonReady.addEventListener("click", getReady)
