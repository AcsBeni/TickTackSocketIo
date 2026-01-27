window.socket = io();
const { playerName, roomCode } = window.LOBBY_CONFIG;

socket.emit("joinRoom", { playerName, roomCode });

socket.on("roomJoined", ({ players, status }) => {
  updatePlayers(players);
  const turnText = status === "waiting" ? "Várakozás a másik játékosra..." : `Rajtad a sor: X`;
  document.getElementById("turnText").innerText = turnText;
});

socket.on("stateUpdate", ({ board, turn, status, winner }) => {
  updateBoard(board, turn);
  if (status === "finished") {
    showMessage(
      "Játék vége",
      winner ? `Győztes: ${winner}` : "Döntetlen!",
      "Nyomjatok új játékot a folytatáshoz"
    );
  }
});
const leaveBtn = document.getElementById("btnLeave");

leaveBtn.addEventListener("click", () => {
  const roomCode = window.LOBBY_CONFIG.roomCode;
  socket.emit("leaveRoom", { roomCode }); 
  window.location.href = "/"; 
});


function showMessage(title, winner = null, subtext = "") {
  const container = document.getElementById("messageContainer");
  if (!container) return;

  // Győztes osztály hozzáadása
  let winnerText = "";
  let winnerClass = "";
  if (winner === "X") {
    winnerText = "Győztes: Player X";
    winnerClass = "winnerX";
  } else if (winner === "O") {
    winnerText = "Győztes: Player O";
    winnerClass = "winnerO";
  } else if (winner === null && title === "Játék vége") {
    winnerText = "Döntetlen!";
  }

  container.innerHTML = `
    <div class="app-card-message">
      <div class="message-box">
        <h2>${title}</h2>
        ${winnerText ? `<p class="winner ${winnerClass}">${winnerText}</p>` : ""}
        ${subtext ? `<p>${subtext}</p>` : ""}
      </div>
    </div>
  `;

  setTimeout(() => {
    const msg = container.querySelector(".app-card-message");
    if (msg) {
      msg.classList.add("fade-out");
      msg.addEventListener("transitionend", () => msg.remove());
    }
  }, 3000);
}


socket.on("errorMessage", ({ message }) => {
  showMessage("Hiba", message);
});
socket.on("opponentLeft", ({ message }) => {
  showMessage("Kapcsolat megszakadt", message);
});

socket.on("rematchStatus", ({ readyCount }) => document.getElementById("playerReady").innerText = readyCount);
