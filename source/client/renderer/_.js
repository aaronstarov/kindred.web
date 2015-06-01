Kindred.Renderer = function() {
    'use strict';
    var T = this;

    T.renderer = {};
    
    T.mode = ""; 
    
    T.modes = {};

    T.state = {};

    // HTML elements will live here with paths like:
    //      "kin1234.class.names.of.elements"
    // where kin1234 is a unique identifier that allows 
    // us to relate original javascript objects to elements.
    //  
    // Each element will have an 'active' and 'elem' field,
    // active marking whether or not we should bother making
    // changes to the representative html element.
    T.html = {
        last_id: 0,
        ids_taken: 0,
        elements: {},

    };

    T.get_id = function() {
        return "kin"+T.html.last_id;
    };

    T.cleanup = function() {
        // TODO - remove from T.objects elements that are most 
        // remote from the viewer (or most distantly clicked on
        // or something else). Hopefully, we will not have to call
        // this manually too often, and can instead perform
        // cleanup logic in reponse to use actions.
        console.log("Cleaning up first 2015 elements. This should not happen.");
        // For now, messy cleanup of early elements.
        for(var i = 0; i < 2015; i++) {
            T.html.elements["kin"+i.toString()] = undefined;
            --T.html.ids_taken;
        }
    };

    T.register = function(mode, renderer) {
        T.modes[mode] = renderer;    
        T.state[mode] = new State();
    };

    T.use = function(mode) {
        console.log("using render mode "+mode);
        T.mode = mode;
        T.renderer = T.modes[mode];
        if(typeof T.renderer === "undefined") {
            throw "No mode '"+mode+"' registered for renderer.";
        }
    };

    T.get = function(key) {
        T.state[T.mode].get(key);
    };

    T.set = function(key, value) {
        T.state[T.mode].set(key, value);
    };
   
    T.base_error = "The Renderer could not finish because "; 

    T.add_element = function(new_elem, field_path) {
        Aux.set_field(T.html.elements, T.get_id()+'.'+field_path, {
            active:true, 
            elem: new_elem,
        });
    };

    var present = function(obj_name, obj, parent_element) { 

        console.log("rendering "+obj_name+':'+JSON.stringify(obj));

        var obj_name_parts = obj_name.split('.'),
            obj_name_len = obj_name_parts.length,
            parent_name = obj_name_parts.slice(0, obj_name_len-1),
            immediate_name = obj_name_parts[obj_name_len-1],
            obj_type = typeof obj;

        // check if this is a keyword
        var field_func = T.renderer.of[immediate_name];
        if(typeof field_func === "function") { 
            var new_elem = field_func(element, obj, T.state[T.mode]);  
            //if(typeof new_elem != "undefined") {
            //    T.add_element(new_elem, field_path);
            //}
        } else if(immediate_name === "render") { // check if we're switching render modes
            if(!obj.hasOwnProperty("mode") ||
               !obj.hasOwnProperty("content")) {
                throw error+"'render' object must have 'mode' and 'content' fields.";
            }
            T.use(obj.mode);
            T.present(parent_name, render_obj.content, element);

        } else {
            
            var elem_type = obj.html ? obj.html : "div";
            var element = document.createElement(elem_type);
            element.className = immediate_name;
            parent_element.appendChild(element);

            if(obj_type === "object") {
                if(Array.isArray(obj)) {
                    console.log("rendering array");
                    
                    element.className += " list";
                    for(var item = 0, len = obj.length; item < len; item++) {
                        T.present(obj_name+"-item", obj[item], element);
                    }
                } else {
                    console.log("rendering object");

                    Aux.apply_to_fields(obj, function(field) {
                        var field_path = obj_name+'.'+field;
                        T.present(obj_name+'.'+field, obj[field], element);
                    });
                }
            } else {
                console.log("rendering type "+typeof field_obj);
                var obj_representation = T.renderer[obj_type](obj, element, T.state[T.mode]);
                console.log(JSON.stringify(obj_representation));
            }
        }
    };

    /**
     * TODO Options can include:
     *  - depth: stop rendering past a certain depth
     *  - reactive: don't make elements reactive - require explicit calls to present
     */

    T.present = function(obj_name, obj, parent_element, options) {
        //if(T.html.ids_taken > Kindred.config.max_id) {
        //    T.cleanup();
        //}
        //do { // add id to circular buffer
        //    obj.kindred_id = 'kin'+ (++T.html.last_id).toString();
        //    if(T.html.last_id > Kindred.config.max_id) {
        //        T.html.last_id = 0;
        //    }
        //    console.log("typeof "+typeof T.html.elements[obj.kindred_id]);
        //} while((typeof T.html.elements[obj.kindred_id]) !== undefined);
        //T.html.ids_taken++;

        //T.html.elements[obj.kindred_id] = obj;
        present(obj_name, obj, parent_element, options);
    };
};

