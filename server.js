const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const path = require('path')

/*Színek
#3DBF91
#F05D5E
#272932


*/
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   
    res.render('main');
})

server.listen(3000, ()=>{
    console.log('http://localhost:3000')
})