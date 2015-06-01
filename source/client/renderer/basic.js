///////////////-------------------------------------
// Basic Renderer
///////////////-------------------------------------

Kindred.basic = {};

Kindred.basic.presentation = {
    init: function(state) {
        state.headers = {};
        return; 
    },

    
    of: {
        // Html Attributes 
        //
        html: function(element, tag, state) {}, // do nothing 
        attr: function(element, attr_obj, state) {
            Aux.apply_to_fields(style_obj, function(field) {
                element.setAttribute(field, attr_obj[field]);
            });
        },
        //
        style: function(element, style_obj, state) {
            Aux.apply_to_fields(style_obj, function(field) {
                element.style[field] = style_obj[field];
            });
        },
        header: function(parent_element, text, state) {
            // find closest header in parent context
            var header_level = null;
            var check_children = function(element) {
                // To avoid this kind of traversal, we include abstraction of dom.
                Aux.iterate(parent_element.children, function(child) {
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
            var element = parent_element.parentElement;
            while(header_level === null && typeof element !== "undefined") {
                header_level = check_children(element);
                element = element.parentElement();        
            }
            if(header_level) {
                if(header_level < 6) header_level++;
            } else {
                header_level = 1;
            }
            var header_element = document.createElement("h"+header_level.toString());
            parent_element.appendChild(header_element);
            return header_element;
        },
        class: function(element, className, state) {
            element.className += " "+className;
        },

        // Events
        //
        onclick: function(parent_element, func, state) {
            parent_element.className += " action";
            Kindred.dom.addFunc(parent_element, "onclick", func);
        },
        //
        onload: function(parent_element, func, state) {
            Kindred.dom.addFunc(parent_element, "onload", func);
        },
        //
        onunload: function(parent_element, func, state) {
            Kindred.dom.addFunc(parent_element, "onunload", func);
        },
        //
        onmouseover: function(parent_element, func, state) {
            Kindred.dom.addFunc(parent_element, "onmouseover", func);
        },
        //
        onmouseout: function(parent_element, func, state) {
            Kindred.dom.addFunc(parent_element, "onmouseout", func);
        },
    
    },

    // |  
    // In all functions below:
    // | 
    string: function(text, parent_element, state) {
        return Kindred.dom.addText(parent_element, text);
    },

    number: function(num, parent_element, state) {
        return Kindred.dom.addText(parent_element, num.toString());
    },
    
    boolean: function(bool, parent_element, state) {
        return Kindred.dom.addText(parent_element, bool.toString());
    },
    
    function: function(func, parent_element, state) {
        var onclick = parent_element.getAttribute("onclick");
        onclick = onclick ? onclick : "";
        parent_element.className += " action";
        parent_element.setAttribute("onclick",onclick+"("+func.toString()+")();"); 
    },
    
    undefined: function(nothing, parent_element, state) {},
    
    object: function(obj, parent_element, state) {
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


