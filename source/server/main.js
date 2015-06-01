try {

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    compress = require('compression');

app.use(compress());
app.use(express.static(path.join(__dirname,'dist')));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname,'index.html'));
});

var owner_port = 11248,
    other_port = 12248;

io.on('connection', function(socket){
  // establish whether owner, friend, or guest
  //
  //
  var home = {
    html: "p",
    //class: "h-me",
    style: {
        backgroundColor: "#900",
    },
    content: "This",
    child: {
        style: {
            color: "#fafafa",
        },
        contents: ["and that.", "And then..."],
    }
  };

  socket.emit('home', home)
  //socket.emit('tests', Test.report);
  console.log('a user connected, sending '+JSON.stringify(home));
});

http.listen(owner_port, function(){
  console.log('listening on localhost:'+owner_port);
});

} catch(err) {
    console.log("ERROR OH NO BAD ERROR!: "+err);
}
