var Kindred = {};

Kindred.root = {
    element: document.getElementById("kindred-root"),
};

Kindred.dom = {};

Kindred.dom.addHTML = function(parent_element, html_obj) {
    var elements = [];
    aux.apply_to_fields(html_obj, function(tag) {
        var tag_obj = html_obj[tag];
        var element = document.createElement(tag);
        aux.apply_to_fields(tag_obj, function(field) {
            switch(field) {
                case "style":
                    var style_obj = tag_obj["style"];
                    aux.apply_to_fields(style_obj, function(style_field) {
                        console.log("style "+style_field+": "+style_obj[style_field]);
                        element.style[style_field] = style_obj[style_field]; 
                    });
                    break;
                case "content":
                    Kindred.dom.addText(element, tag_obj["content"]);
                    break;
                default:
                    element.setAttribute(field, tag_obj[field]);    
            }
        });
        console.log(JSON.stringify(html_obj)); 

        parent_element.appendChild(element);
        elements.push(element);
    });
    return elements;
};

Kindred.dom.addText = function(parent_element, text) {
    parent_element.appendChild(document.createTextNode(text));
};

Kindred.Renderer = function() {
    var T = this;

    T.renderer = {};
    
    T.mode = ""; 
    
    T.modes = {};

    T.state = {};

    T.register = function(mode, renderer) {
        T.modes[mode] = renderer;    
        T.state[mode] = {};
    };

    T.use = function(mode) {
        T.mode = mode;
        T.renderer = T.modes[mode];
        if(typeof T.renderer === "undefined") {
            throw "No mode '"+mode+"' registered for renderer.";
        }
    };

    T.set = function(key, value) {
        T.state[T.mode][key] = value;
    };
   
    var error = "The Renderer could not finish because "; 

    T.present = function(parent_obj, obj) { 
        console.log("rendering "+JSON.stringify(obj));

        aux.apply_to_fields(obj, function(field) {
            switch(field) {
                case "element": 
                    // skip over dom elements 
                    break;
                case "html":
                    console.log("adding html");
                    Kindred.dom.addHTML(parent_obj.element, obj["html"]);
                    break;
                case "view":
                    var view_obj = obj["view"];
                    if(!view_obj.hasOwnProperty("mode") 
                    || !view_obj.hasOwnProperty("content")) {
                        throw error+"view must have 'mode' and 'content' fields.";
                    }
                    var mode = view_obj["mode"];
                    console.log("using render mode "+mode);
                    T.use(mode);
                    T.present(parent_obj, view_obj["content"]);
                    break;
                default:
                    var field_obj = obj[field];
                    if(Array.isArray(field_obj)) {
                        obj.element.className += " array";
                        for(var item in field_obj) {
                            T.present(obj, item);
                        }
                    } else {
                        T.renderer[typeof field_obj](obj, field_obj, T.state);
                        T.present(obj, field_obj);
                    }
            }
        });
    };
};

Kindred.make_reference = function(obj) {
    var fields_to_fill = find_undefined_fields(obj, "");
    // save to database, return unique id
    return reference_id;
};

Kindred.use_reference = function(id, values) {
    var template = get_template(id);
    for(var i in template.open_fields) {
        var open_field = template.open_fields[i];
        aux.set_field(template.obj, open_field, values[i]);
    }
    return template.obj;
};

///////////////-------------------------------------
// Basic
///////////////-------------------------------------

Kindred.basic = {};

Kindred.basic.presentation = {
    // |  
    // In all functions below:
    // | p = parent element
    // | o = object  
    // | 
    string: function(p, o, state) {
        o.element = Kindred.dom.addText(p.element, o);   
    },

    number: function(p, o, state) {
        o.element = Kindred.dom.addText(p.element, o.toString());
    },
    
    boolean: function(p, o, state) {
        o.element = Kindred.dom.addText(p.element, o.toString());
    },
    
    function: function(p, o, state) {
        p.element.className += " action";
        var onclick = p.element.getAttribute("onclick");
        onclick = onclick ? onclick : "";
        p.element.setAttribute("onclick",onclick+"("+o.toString()+")();"); 
    },
    
    undefined: function(p, o, state) {},
    
    object: function(p, o, state) {
        aux.apply_to_fields_of(o, function(field) {
            switch(field) {
                default:
                    o[field].element = Kindred.dom.addHtml(p.element, {
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
