
// comment

Kindred.make_reference = function(obj) {
    var fields_to_fill = Template.make_from(obj);
    // save to database, return unique id
    return reference_id;
};

Kindred.use_reference = function(id, values) {
    var template = DB.get_template(id);
    Aux.iterate(template.vars, function(open_field) {
        Aux.set_field(template.base, open_field, values[i]);
    });
    return template.base;
};

/////////////---------------------------------------
// Main 
/////////////---------------------------------------

var renderer = new Kindred.Renderer();

renderer.register("form", Kindred.basic.form);
renderer.register("table", table_renderer);
//renderer.use("table");

var hey = { elem: { style: {backgroundColor:"red"}, c:"hey", onclick: function(a,b,c){ if(a) { alert("hi");}} }};
//var hey = { elem: "hey", };
renderer.use("form");
renderer.present(hey, Kindred.root, {mode: "form"});
console.log("Hey's now "+JSON.stringify(hey));
hey.elem.c = "something else";
hey.elem.c.style = { backgroundColor: "#900000" };

// TODO - remove old presentation

console.log("connecting");
var connect_socket = function(host) {
    return host ? io(host) : io();
};
var local_connection = connect_socket();
var home_is_set = false;
local_connection.on('home', function(home) {
    console.log("presenting "+JSON.stringify(home));
    if(!home_is_set){
        renderer.present(home, Kindred.root);
        home_is_set = true;
        Kindred.get_file(local_connection, "docs/documentation.md");
    }
});    

local_connection.on("file", function(file_obj) {
    console.log("got file: "+JSON.stringify(file_obj));
    renderer.present(file_obj, document.getElementById("dev-root"));
}); 
////var test_table = { render: { mode: "table", content: Test.report }};
////var test_table = { render: { mode: "table", content: { a: { b: "hi", c:"bye" }}}};
//renderer.use("table");
//var test_table = { a: { b: "hi", c:{ d:"bye", e:"end" } }};
////renderer.present("tests", test_table, document.getElementById("dev-root")); 
//renderer.present("tests", Test.report, document.getElementById("dev-root")); 
