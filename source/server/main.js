try {

app.use(compress());
app.use(express.static(path.join(__dirname,'dist')));
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname,'index.html'));
});

var owner_port = 11248,
    other_port = 12248;

http.listen(owner_port, function(){
  console.log('listening on localhost:'+owner_port);
});

} catch(err) {
    console.log("ERROR OH NO BAD ERROR!: "+err);
}
