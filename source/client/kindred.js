/////////////---------------------------------------
// Main 
/////////////---------------------------------------

var home_is_set = false;

Kindred.socket.on('home', function(home) {
    console.log("presenting "+JSON.stringify(home));
    if(!home_is_set){
        Kindred.present(home, Kindred.root);
        home_is_set = true;
        Kindred.get_file("docs/documentation.md");
    }
});    

Kindred.socket.on("file", function(file_obj) {
    console.log("got file: "+JSON.stringify(file_obj));
    var css = "margin: 40px auto; width: 800px; font-family: Lustria;";
    var css_of = {
        "h1, h2, h3": "font-family: Cinzel;",
        h1: "text-align: center; line-height: 400px; font-size: 3em;",
        h2: "border-top: 8px solid black; line-height: 80px; margin-top: 100px; font-size: 1.7em;",
        h3: "margin-top: 40px; font-size: 1.5em;",
        h4: "font-size: 1.2em;",
        h5: "font-size: 1em;",
        a: "text-decoration: none; color: #900; font-weight: bold;",
        ".sidenote-wrapper": "position: relative; width: 0; height: 0",
        ".sidenote": "position: absolute; width: 200px; left: -220px; top: -80px; font-size: .7em; border-right: 4px solid black;",
        pre: "margin-left: 50px;",
        code: "font-weight: bold; color: #333;",
    };
    Kindred.present({file: {css:css, css_of:css_of, content:file_obj}}, document.getElementById("dev-root"));
    
    Kindred.present(our_obj, document.getElementById("example1")); 
}); 
