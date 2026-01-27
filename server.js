const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const rooms = {}; 

app.get('/', (req, res) => {
  const { playerName = '', roomCode = '' } = req.query;
  res.render('index', { playerName, roomCode });
});

app.get('/main', (req, res) => {
  const { playerName, roomCode } = req.query;
  if (!playerName || !roomCode) return res.redirect('/');
  const Lobby_Config = { playerName, roomCode };
  res.render('main', { Lobby_Config });
});

// Tic-Tac-Toe logika
io.on("connection", socket => {

  socket.on("joinRoom", ({ playerName, roomCode }) => {
    if (!playerName || playerName.length <= 3) {
      socket.emit("errorMessage", { message: "Név túl rövid" });
      return;
    }

    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        players: [],
        board: Array(9).fill(""),
        turn: "X",
        status: "waiting",
        winner: null,
        rematchReady: new Set(),
        wins: { X: 0, O: 0 }
      };
    }

    const room = rooms[roomCode];
    if (room.players.length >= 2) {
      socket.emit("errorMessage", { message: "A szoba megtelt." });
      return;
    }

    const symbol = room.players.length === 0 ? "X" : "O";
    room.players.push({ socketId: socket.id, name: playerName, symbol });
    socket.join(roomCode);

    // Status update mindenki számára
    io.to(roomCode).emit("roomJoined", {
      roomCode,
      players: room.players,
      status: room.status
    });
    socket.emit("stateUpdate", {
      board: room.board,
      turn: room.turn,
      status: room.status,
      winner: room.winner,
      wins: room.wins
    });
  });

  socket.on("makeMove", ({ roomCode, index }) => {
    const room = rooms[roomCode];
    if (!room || room.status !== "playing") return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || room.turn !== player.symbol) return;
    if (room.board[index] !== "") return;

    room.board[index] = player.symbol;

    if (checkWin(room.board, player.symbol)) {
      room.status = "finished";
      room.winner = player.symbol;
      room.wins[player.symbol] += 1;
    } else if (!room.board.includes("")) {
      room.status = "finished";
      room.winner = null; // döntetlen
    } else {
      room.turn = room.turn === "X" ? "O" : "X";
    }

    io.to(roomCode).emit("stateUpdate", {
      board: room.board,
      turn: room.turn,
      status: room.status,
      winner: room.winner,
      wins: room.wins
    });
  });

  socket.on("requestRematch", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.rematchReady.add(socket.id); 
    io.to(roomCode).emit("rematchStatus", { readyCount: room.rematchReady.size });

    if (room.rematchReady.size === 2) {
      room.board = Array(9).fill("");
      room.turn = "X";
      room.status = "playing";
      room.winner = null;
      room.rematchReady.clear();

      io.to(roomCode).emit("stateUpdate", {
        board: room.board,
        turn: room.turn,
        status: room.status,
        winner: room.winner,
        wins: room.wins
      });
      io.to(roomCode).emit("rematchStatus", { readyCount: 0 }); 
    }
  });

  socket.on("disconnect", () => {
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const idx = room.players.findIndex(p => p.socketId === socket.id);
      if (idx !== -1) {
        room.players.splice(idx,1);
        room.status = "waiting";
        room.board = Array(9).fill("");
        room.turn = "X";
        room.winner = null;
        room.rematchReady.clear();
        socket.to(roomCode).emit("opponentLeft", { message: "Az ellenfél kilépett." });
        io.to(roomCode).emit("stateUpdate", {
          board: room.board,
          turn: room.turn,
          status: room.status,
          winner: room.winner,
          wins: room.wins 
        });
      }
    }
  });
});

// Nyerés ellenőrzés
function checkWin(board, player) {
  const combos = [
    [0,1,2], [3,4,5], [6,7,8], // sorok
    [0,3,6], [1,4,7], [2,5,8], // oszlopok
    [0,4,8], [2,4,6]           // átlók
  ];
  return combos.some(combo => combo.every(i => board[i] === player));
}

server.listen(port, ()=>console.log(`Server running on ${port}`));
