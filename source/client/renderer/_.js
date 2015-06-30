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
        console.log("Cleaning up first 2015 elements. This should not happen.");
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
        console.log("using render mode "+mode);
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

        console.log("rendering "+obj_name+" in "+T.mode+":"+JSON.stringify(obj));
        if(parent_element) {
            console.log("ELEMENT:"+JSON.stringify({
                tag: parent_element.nodeName,
                children: parent_element.children,
                class: parent_element.className,
            }));
        } else {
            console.log("UNDEFINED ELEMENT");
        }

        var obj_type = typeof obj;

        var field_func = T.renderer.of[obj_name];
        if(typeof field_func === "function") { 
            console.log("KEYWORD: "+obj_name);
            // if this is a keyword, use the renderer-specific function
            return field_func(parent_element, obj, T.context);  
        } else if(obj_name === "content") { 
            console.log("CONTENT");
            // default behavior for "content" is to simply continue
            // as if it didn't exist
            present(obj_name, obj, parent_element); 
        } else {
            // create a new html element and recursively present any child elements
            if(Array.isArray(obj)) obj_type = "list";

            if(obj_type === "list") {
                console.log("ARRAY");
                
                Aux.iterate(obj, function(item) {
                    if(typeof item.class === "undefined") {
                        item.class = obj_name+"-item";
                    }
                    T.add_element(item, parent_element);
                });
                return parent_element; // why not?
            } else {
                //if((typeof obj.base !== "undefined") && 
                //   (typeof T.renderer.base[obj.base]) === "object" ) {
                //    obj = Aux.combine(T.renderer.base[obj.base], obj);
                //}
                
                var create_element = function() {
                    var elem_type = obj.html ? obj.html : "div";
                    element = document.createElement(elem_type);
                    element.className = obj_name;
                    parent_element.appendChild(element);
                }

                if(typeof ref_element === "undefined") {
                    create_element();
                    console.log("creating element because undefined");
                } else if(ref_element.tagName !== obj.html) {
                    parent_element.removeChild(ref_element);
                    create_element();
                    console.log("replacing element because contradictory ref_element passed");
                } else {
                    element = ref_element;
                    console.log("using ref_element");
                }

                console.log("renderer["+obj_type+"](element, "+JSON.stringify(obj)+")");
                T.renderer[obj_type](element, obj, T.context);

                T.add_element(obj, element);

                return element;
            } 
        }
    };

    T.elements = [];

    T.add_element = function(obj, parent_element) {
        console.log("Adding element "+JSON.stringify(obj));
        // This makes the obj reactive, so that whenever it 
        // is changed, it will be re-presented.
        if(typeof obj === "object") {
            Aux.apply_to_fields(obj, function(field) {
                var record = obj[field],
                    elem,
                    mode = T.mode;
                Object.defineProperty(obj, field, {
                    get: function() { return record; },
                    set: function(new_val) {
                        record = new_val;
                        console.log("presenting "+field+" in add_element:"+JSON.stringify(record));
                        T.use(mode);
                        elem = present(field, record, parent_element, elem);     
                        if(elem) console.log("elem = "+elem.innerHTML);
                    },
                });
                console.log("old val: "+JSON.stringify(record));
                obj[field] = record;
                console.log("- obj is now: "+JSON.stringify(obj));
                //console.log("elem is now "+elem ? elem.innerHTML : "nothing");
            });
            console.log("obj is now: "+JSON.stringify(obj));
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
        console.log("presenting "+JSON.stringify(obj));

        if(options && !options.skip_preprocess) {
            obj = T.renderer.preprocess(obj);
        }

        var old_mode = T.mode;
        if(options && options.mode) {
            T.use(options.mode);
        }
        console.log("T.add_element("+JSON.stringify(obj)+")");
        T.add_element(obj, parent_element);

        T.use(old_mode);
    };
};

