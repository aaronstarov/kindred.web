var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    compress = require('compression');

// local imports
app.use(compress());
app.use(express.static('lib'));
app.use(express.static('test'));
app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

var owner_port = 8421,
    other_port = 8422;

app.listen(owner_port, 'localhost', function() {
    // send owner token
});

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

http.listen(7777, function(){
  console.log('listening on *:7777');
});
