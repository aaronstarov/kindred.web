///////////////-------------------------------------
// Basic Renderer
///////////////-------------------------------------

Kindred.basic = {};

Kindred.basic.presentation = {
    preprocess: function(obj) { return obj },

    init: function(context) {
        context.headers = {};
        return; 
    },
    
    of: {
        // Html Attributes 
        //
        html: function(element, tag, context) {}, // do nothing 
        attr: function(element, attr_obj, context) {
            Aux.apply_to_fields(style_obj, function(field) {
                element.setAttribute(field, attr_obj[field]);
            });
        },
        //
        style: function(element, style_obj, context) {
            Aux.apply_to_fields(style_obj, function(field) {
                element.style[field] = style_obj[field];
            });
        },
        header: function(element, text, context) {
            // find closest header in parent context
            var header_level = null;
            var check_children = function(element) {
                // To avoid this kind of traversal, we include abstraction of dom.
                Aux.iterate(element.children, function(child) {
                    switch(child.nodeName().toLowerCase()) {
                        case "h1": return 1;
                        case "h2": return 2;
                        case "h3": return 3;
                        case "h4": return 4;
                        case "h5": return 5;
                        case "h6": return 6;
                    }
                });
            };
            var parent_element = element.parentElement;
            while(header_level === null && typeof parent_element !== "undefined") {
                header_level = check_children(parent_element);
                parent_element = parent_element.parentElement();        
            }
            if(header_level) {
                if(header_level < 6) header_level++;
            } else {
                header_level = 1;
            }
            var header_element = document.createElement("h"+header_level.toString());
            element.appendChild(header_element);
            return header_element;
        },

        class: function(element, className, context) {
            element.className += " "+className;
        },

        // Events -- TODO template these to avoid repetitive code
        
        onclick: function(element, func, context) {
            element.addEventListener("click", function(e) {
                func.call(context, e);
            });

        },
        //
        onload: function(element, func, context) {
            element.addEventListener("load", function(e) {
                func.call(context, e);
            });

        },
        //
        onunload: function(element, func, context) {
            element.addEventListener("unload", function(e) {
                func.call(context, e);
            });

        },
        //
        onmouseover: function(element, func, context) {
            element.addEventListener("mouseover", function(e) {
                func.call(context, e);
            });
        },
        //
        onmouseout: function(element, func, context) {
            element.addEventListener("mouseout", function(e) {
                func.call(context, e);
            });
        },
        //
        onkeyup: function(element, func, context) {
            Kindred.events.register("keyup", element, func); 
        },
        //
        onkeypress: function(element, func, context) {
            Kindred.events.register("keypress", element, func);
        },
        //
        onkeydown: function(element, func, context) {
            Kindred.events.register("keydown", element, func);
        },
        //
    
    },

    // |  
    // In all functions below:
    // | 
    string: function(element, text, context) {
        element.innerHTML = text;
    },

    number: function(element, num, context) {
        element.innerHTML = num.toString();
    },
    
    boolean: function(element, bool, context) {
        element.innerHTML = bool.toString();
    },
    
    function: function(element, func, context) {
        element.innerHTML = Kindred.dom.func(func);
    },
    
    undefined: function(element, nothing, context) {},

    list: function(element, list, context) {
        element.className += " list";
    },
    
    object: function(element, obj, context) {
        //var rand_seq = Aux.get_random_buffer(4),
        //    almost_rand_color = "#90";
        //Aux.iterate(rand_seq, function(b) {
        //    almost_rand_color += (b%16).toString(16);
        //});
        //element.style.backgroundColor = almost_rand_color;
        // Nothing more to do here for now.
        //
        //Aux.apply_to_fields_of(obj, function(field) {
        //    switch(field) {
        //        default:
        //            return Kindred.dom.addHtml(p.element, {
        //                div: {
        //                    class: field
        //                }
        //            });
        //    }
        //});
    },

};

Kindred.basic.form = {

};


