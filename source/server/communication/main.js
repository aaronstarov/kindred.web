try{ 

io.on("connection", function(socket) {
    // TODO establish whether owner, friend, or guest

    socket.on("file", function(file_path) {
        fs.readFile(path.normalize(__dirname+"/../../data/"+file_path), "utf-8", function(err, data) {
            if(err) { 
                console.log("error retrieving file "+file_path+": "+err);
                socket.send({ name: file_path, error: err }); 
            } else {
                var file_obj = {
                    name: file_path,
                    // TODO - adapt to different file types
                    // e.g. markdown for .md extenstions,
                    // javascript for .js, downloads for .doc 
                    // files, etc.
                    markdown: data,
                };
                socket.emit("file", file_obj);
            }
        });
    });

    var home = {
        style: {
            background: "linear-gradient(#420008,#42001b)",
            color: "#fafafa",
            padding: "5px 12px",
            fontFamily: "Cinzel",
        },
        css_of: {
            ".author":"border-left: 2px solid white; padding-left: 8px; margin-left: 8px;",
        },
        copyright: "&copy; 2015",
        // TODO make copyright keyword -- automatically extends year to current one if < current one
        author: "Aaron Starov",
    };

    socket.emit('home', home);
    //socket.emit('tests', Test.report);

});

} catch(err) {
    console.log("socket error: "+err);
}
