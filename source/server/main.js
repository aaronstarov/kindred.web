var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    compress = require('compression');

app.use(compress());
app.use(express.static(__dirname+'/dist'));
app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

var owner_port = 8421,
    other_port = 8422;

io.on('connection', function(socket){
  // establish whether owner, friend, or guest
  //
  //
  var home = {
    html: {
        div:{
            class: "home",
            style: {
                backgroundColor: "#900",
            },
            content: "this",
        }
    }
  };
  socket.emit('home', home)
  console.log('a user connected, sending '+JSON.stringify(home));
});

http.listen(owner_port, function(){
  console.log('listening on *:'+owner_port);
});
