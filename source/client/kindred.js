
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

renderer.register("presentation", Kindred.basic.presentation);
renderer.register("form", Kindred.basic.form);
renderer.use("presentation");

console.log("connecting");
var connect_socket = function(host) {
    return host ? io(host) : io();
};
var local_connection = connect_socket();
var home_is_set = false;
local_connection.on('home', function(home) {
    console.log(JSON.stringify(home));
    if(!home_is_set){
        renderer.present(Kindred.root, home);
        //Kindred.dom.addHTML(Kindred.root.element, home);
        home_is_set = true;
    }
});
