
Kindred.make_reference = function(obj) {
    var fields_to_fill = Template.make_from(obj);
    // save to database, return unique id
    return reference_id;
};

Kindred.use_reference = function(id, values) {
    var template = get_template(id);
    for(var i in template.open_fields) {
        var open_field = template.open_fields[i];
        Aux.set_field(template.obj, open_field, values[i]);
    }
    return template.obj;
};

///////////////-------------------------------------
// Basic
///////////////-------------------------------------

Kindred.basic = {};

Kindred.basic.presentation = {
    addText: function(path, obj, state) {
        var parent_element = state.
    },

    // |  
    // In all functions below:
    // | 
    string: function(path, obj, state) {
        o.element = Kindred.dom.addText(path, obj);   
    },

    number: function(path, obj, state) {
        return Kindred.dom.addText(, o.toString());
    },
    
    boolean: function(path, obj, state) {
        return Kindred.dom.addText(p.element, o.toString());
    },
    
    function: function(path, obj, state) {
        p.element.className += " action";
        var onclick = p.element.getAttribute("onclick");
        onclick = onclick ? onclick : "";
        p.element.setAttribute("onclick",onclick+"("+o.toString()+")();"); 
    },
    
    undefined: function(path, obj, state) {},
    
    object: function(path, obj, state) {
        Aux.apply_to_fields_of(obj, function(field) {
            switch(field) {
                default:
                    return Kindred.dom.addHtml(p.element, {
                        div: {
                            class: field
                        }
                    });
            }
        });
    },


};

Kindred.basic.form = {

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
