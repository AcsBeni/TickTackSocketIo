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
    alert(winner ? `${winner} nyert!` : "Döntetlen!");
  }
});
const leaveBtn = document.getElementById("btnLeave");

leaveBtn.addEventListener("click", () => {
  const roomCode = window.LOBBY_CONFIG.roomCode;
  socket.emit("leaveRoom", { roomCode }); 
  window.location.href = "/"; 
});
socket.on("errorMessage", ({ message }) => alert(message));
socket.on("opponentLeft", ({ message }) => alert(message));
socket.on("rematchStatus", ({ readyCount }) => document.getElementById("playerReady").innerText = readyCount);
