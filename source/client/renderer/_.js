// TODO - cleanse() function to automatically rename any keywords present 
// in a renderer during the preprocess step 

Kindred.presentation = function() {
    this.of = {}; 
    this.base = {};
}; 

Kindred.Renderer = function() {
    'use strict';
    var T = this;

    T.renderer = Kindred.basic.presentation;
    
    T.mode = "default"; 
    
    T.modes = {
        default: Kindred.basic.presentation,    
    };

    T.context = {};

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
        // For now, messy cleanup of early elements.
        for(var i = 0; i < 2015; i++) {
            T.html.elements["kin"+i.toString()] = undefined;
            --T.html.ids_taken;
        }
    };

    T.register = function(mode, renderer) {
        T.modes[mode] = Aux.combine(Kindred.basic.presentation, renderer);    
    };

    T.use = function(mode) {
        T.mode = mode;
        T.renderer = T.modes[mode];
        if(typeof T.renderer === "undefined") {
            console.log("No mode '"+mode+"' registered for renderer.");
            T.renderer = T.modes["default"];
        }
    };

    var base_error = "The Renderer could not finish because "; 

    T.elements = [];

    T.free_slots = [];

    T.remove_element = function(i) {
        free_elements.push(i);
    }

    var present = function(obj_name, obj, parent_element, ref_element) { 

        var element = ref_element;

        //console.log("rendering "+obj_name+" in "+T.mode+":"+JSON.stringify(obj));

        var obj_type = typeof obj;

        var field_func = T.renderer.of[obj_name];
        if(typeof field_func === "function") { 
            console.log("KEYWORD: "+obj_name);
            // if this is a keyword, use the renderer-specific function
            return field_func(parent_element, obj, T.context);  
        } /*else if(obj_name === "content") { 
            // default behavior for "content" is to simply continue
            // as if it didn't exist
            present(obj_name, obj, parent_element); 
        } XXX - cute idea, not worth fixing now */ else {
            // create a new html element and recursively present any child elements

            if(Array.isArray(obj)) obj_type = "list";

            //if((typeof obj.base !== "undefined") && 
            //   (typeof T.renderer.base[obj.base]) === "object" ) {
            //    obj = Aux.combine(T.renderer.base[obj.base], obj);
            //}
            // Use the html tag specified in object if it's there, 
            var elem_type = (obj && obj.html) ? obj.html :
                            // or the default tag for that type, 
                            (T.renderer.html_for[obj_type] ? T.renderer.html_for[obj_type] :
                            // or fallback on div
                            "div");

            var create_element = function(next_element) {
                element = document.createElement(elem_type);
                element.className = obj_name;
                if(next_element) {
                    parent_element.insertBefore(element, next_element);
                } else {
                    parent_element.appendChild(element);
                }
            }

            if(typeof ref_element === "undefined") {
                console.log("creating new element");
                create_element();
            } else if(ref_element.tagName.toLowerCase() !== elem_type.toLowerCase()) {
                console.log("reassigning value of object: "+ref_element.tagName+" != "+elem_type);
                var next_element = ref_element.nextSibling;
                parent_element.removeChild(ref_element);
                create_element(next_element);
            } else {
                console.log("using old element");
                element = ref_element;
            }

            T.renderer[obj_type](element, obj, T.context);

            T.add_element(obj, element);

            if(obj_type === "list") {
                console.log("LIST");
                _.each(obj, function(item) {
                    console.log(JSON.stringify(item));
                    item.className = obj_name+"-item";
                    T.add_element(item, parent_element);
                });
            }

            return element;
        } 
    };

    T.elements = [];

    T.add_element = function(obj, parent_element) {
        // This makes the obj reactive, so that whenever it 
        // is changed, it will be re-presented.
        if(typeof obj === "object") {
            _.each(obj, function(record, field) {
                var elem,
                    mode = T.mode;
                Object.defineProperty(obj, field, {
                    get: function() { return record; },
                    set: function(new_val) {
                        record = new_val;
                        T.use(mode);
                        elem = present(field, record, parent_element, elem);     
                    },
                });
                obj[field] = record;
            });
        }     
    };

    /**
     * TODO Options can include:
     *  - skip_preprocess: does not call renderer's preprocess() method
     *  - to_depth: stop rendering past a certain depth
     *  - unreactive: don't make elements reactive - require explicit calls to present
     */
    T.present = function(obj, parent_element, options) {

        T.context = obj;

        if(options && !options.skip_preprocess) {
            obj = T.renderer.preprocess(obj);
        }

        var old_mode = T.mode;
        if(options && options.mode) {
            T.use(options.mode);
        }
        //console.log("T.add_element("+JSON.stringify(obj)+")");
        T.add_element(obj, parent_element);

        T.use(old_mode);
    };
};

var renderer = new Kindred.Renderer();

// TODO - refactor these away
Kindred.present = renderer.present;
Kindred.use = renderer.use;
Kindred.register = renderer.register;
