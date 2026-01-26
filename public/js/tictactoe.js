const cells = document.querySelectorAll(".cell");
const readyBtn = document.querySelector(".btn-ready");

let hasReady = false;

// Cell click – lépések
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const index = Number(cell.dataset.index);
    socket.emit("makeMove", { roomCode: window.LOBBY_CONFIG.roomCode, index });
  });
});

// Ready gomb – rematch kérése
readyBtn.addEventListener("click", () => {
  if (hasReady) return;
  hasReady = true;
  socket.emit("requestRematch", { roomCode: window.LOBBY_CONFIG.roomCode });
});

// Frissíti a játékosokat
function updatePlayers(players) {
  const xPlayer = players.find(p => p.symbol === "X");
  const oPlayer = players.find(p => p.symbol === "O");

  document.getElementById("roomCode").innerText = window.LOBBY_CONFIG.roomCode;
  document.getElementById("playerX").innerText = xPlayer ? xPlayer.name : "Várakozás...";
  document.getElementById("playerO").innerText = oPlayer ? oPlayer.name : "Várakozás...";
}

// Frissíti a boardot és győzelmeket
function updateBoard(board, turn, wins) {
  document.getElementById("turnText").innerText = `Rajtad a sor: ${turn}`;

  cells.forEach((cell, i) => {
    cell.innerText = board[i] || "";
    cell.classList.remove("x","o");
    if(board[i]==="X") cell.classList.add("x");
    else if(board[i]==="O") cell.classList.add("o");
  });

  if(wins){
    document.getElementById("xWins").innerText = wins.X;
    document.getElementById("oWins").innerText = wins.O;
  }
}

// Socket események

// Játékosok frissítése
socket.on("roomJoined", ({ players, status }) => updatePlayers(players));

// Board és állapot frissítése
socket.on("stateUpdate", ({ board, turn, status, winner, wins }) => {
  updateBoard(board, turn, wins);

  if(status==="finished"){
    setTimeout(()=>{
      alert(winner ? `${winner} nyert!` : "Döntetlen!");
    },100);
    hasReady = false;              
    document.getElementById("playerReady").innerText = "0";
});

// Rematch státusz
socket.on("rematchStatus", ({ readyCount }) => {
  document.getElementById("playerReady").innerText = readyCount;
  if(readyCount === 0) hasReady = false; 
});

// Ellenfél kilépett
socket.on("opponentLeft", ({ message })=>{
  alert(message);
  document.getElementById("turnText").innerText = "Várakozás a másik játékosra...";
  updateBoard(Array(9).fill(""), "X", {
    X: document.getElementById("xWins").innerText,
    O: document.getElementById("oWins").innerText
  });
  hasReady = false; 
  document.getElementById("playerReady").innerText = "0";
});

// Hibakezelés
socket.on("errorMessage", ({ message }) => alert(message));
