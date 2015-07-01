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
        //
        innerHTML: function(element, html, context) {
            element.innerHTML = html;
        },
        //
        attr: function(element, attr_obj, context) {
            Aux.apply_to_fields(attr_obj, function(field) {
                element.setAttribute(field, attr_obj[field]);
            });
        },
        //
        style: function(element, style_obj, context) {
            Aux.apply_to_fields(style_obj, function(field) {
                element.style[field] = style_obj[field];
            });
        },
        //
        css: function(element, css, context) {
            Kindred.dom.cssFunc(Kindred.dom.css_selector(element), css);
        },
        //
        css_of: function(element, css_obj, context) {
            var base_selector = Kindred.dom.css_selector(element);
            Aux.apply_to_fields(css_obj, function(selector) {
                // TODO (maybe) introduce hierarchical selection via
                // a check of whether the field is an object or a string
                var selectors = selector.split(','), 
                    rule = css_obj[selector],
                    // take something like "h1, h2, h3" and make:
                    // ".parent_class h1, .parent_class h2, .parent_class h3"
                    final_selector = base_selector+' '+selectors.join(', '+base_selector);
                Kindred.dom.cssFunc(final_selector, rule);   
            });
        },
        //
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

        className: function(element, className, context) {
            element.className += " "+className;
        },

        // Events -- TODO template these to avoid repetitive code
        
        onclick: function(element, func, context) {
            element.addEventListener("click", function(e) {
                func.call(context, e);
            });

        },
        //
        ondblclick: function(element, func, context) {
            element.addEventListener("dblclick", function(e) {
                func.call(context, e);
            });
        },
        //
        oncontextmenu: function(element, func, context) {
            element.addEventListener("contextmenu", function(e) {
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
        onmousemove: function(element, func, context) {
            element.addEventListener("mousemove", function(e) {
                func.call(context, e);
            });
        },
        //
        onmouseenter: function(element, func, context) {
            element.addEventListener("mouseenter", function(e) {
                func.call(context, e);
            });
        },
        //
        onmouseleave: function(element, func, context) {
            element.addEventListener("mouseleave", function(e) {
                func.call(context, e);
            });
        },
        //
        onmousedown: function(element, func, context) {
            element.addEventListener("mousedown", function(e) {
                func.call(context, e);
            });
        },
        //
        onmouseup: function(element, func, context) {
            element.addEventListener("mouseup", function(e) {
                func.call(context, e);
            });
        },
        //
        onkeyup: function(element, func, context) {
            // XXX - I fear this Kinderd.events.register() method
            // was overly complex -- leaving it here until that's
            // verified.
            //Kindred.events.register("keyup", element, func); 
            element.addEventListener("keyup", function(e) {
                func.call(context, e);
            });
        },
        //
        onkeypress: function(element, func, context) {
            //Kindred.events.register("keypress", element, func);
            element.addEventListener("keypress", function(e) {
                func.call(context, e);
            });
        },
        //
        onkeydown: function(element, func, context) {
            //Kindred.events.register("keydown", element, func);
            element.addEventListener("keydown", function(e) {
                func.call(context, e);
            });
        },
        //
        
        //
        //
        markdown: function(element, md, context) {
            element.innerHTML = marked(md);     
        },
    },

    // |  
    // All functions below will be called when
    // the renderer encounters a field with that
    // type.
    // | 

    html_for: {
        string: "span",
        number: "span",
        boolean: "span",
    },

    string: function(element, text, context) {
        element.innerHTML = text+' ';
    },

    number: function(element, num, context) {
        element.innerHTML = num.toString()+' ';
    },
    
    boolean: function(element, bool, context) {
        element.innerHTML = bool.toString()+' ';
    },
    
    function: function(element, func, context) {
        element.innerHTML = Kindred.dom.func(func);
    },
    
    undefined: function(element, nothing, context) {},

    null: function(element, nothing, context) {},

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

