const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const path = require('path')


function matchIsOver(player){
  matchOver = true
  setTimeout(() => {
    matchOver = false
  }, 500);
  message="Round over"
  switch(player){
    case "X":
      playerXpoint ++;
      winner = "X"
      break;
    case "Y":
      playerYpoint ++;
      winner = "Y"
      break;
    default:
      break
  }
}

winner = ""
details =""
matchOver=false
playerXpoint=0
playerOpoint=0

const ROOMS=[]
const ERRORS ={
    missingFields: "Hiányzó adatok"
}

/*Színek
#3DBF91
#F05D5E
#272932
*/
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   
    res.render('index');
})
app.get('/main', (req, res) => {
   
    res.render('main');
})

app.get('/message', (req, res) => {
  const { msg, winner, details } = req.query;
  res.render('message', {
    message: msg || "Game Over!",
    winner: winner,      // 'X' or 'O'
    details: details     // optional
  });
});

server.listen(3000, ()=>{
})