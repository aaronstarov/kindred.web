/////////////---------------------------------------
// Main 
/////////////---------------------------------------

var home_is_set = false;

Kindred.socket.on('home', _.once(function(home) {
    Kindred.present(home, Kindred.root);
    home_is_set = true;
    Kindred.get_file("docs/documentation.md");
}));    

Kindred.socket.on("file", function(file_obj) {
    Kindred.present({file: {css:Kindred.css, css_of:Kindred.css_of, content:file_obj}}, Kindred.dev_root);
    
    Kindred.present(our_obj, document.getElementById("example1")); 
    Kindred.present(numbers, document.getElementById("example2"));
}); 
