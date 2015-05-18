Kindred.Renderer = function() {
    var T = this;

    T.renderer = {};
    
    T.mode = ""; 
    
    T.modes = {};

    T.state = {};

    T.register = function(mode, renderer) {
        T.modes[mode] = renderer;    
        T.state[mode] = new State();
    };

    T.use = function(mode) {
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
   
    var error = "The Renderer could not finish because "; 

    T.present = function(obj_path, obj) { 
        console.log("rendering "+JSON.stringify(obj));

        Aux.apply_to_fields(obj, function(field) {
            switch(field) {
                case "view":
                    var view_obj = obj["view"];
                    if(!view_obj.hasOwnProperty("mode") 
                    || !view_obj.hasOwnProperty("content")) {
                        throw error+"view must have 'mode' and 'content' fields.";
                    }
                    var mode = view_obj["mode"];
                    console.log("using render mode "+mode);
                    T.use(mode);
                    T.present(obj_path, view_obj["content"]);
                    break;
                default:
                    var field_obj = obj[field];
                    if(Array.isArray(field_obj)) {
                        for(var item in field_obj) {
                            T.present(obj_path, field_obj[item]);
                        }
                    } else {
                        var field_obj_path = obj_path+'.'+field;
                        var obj_representation = T.renderer[typeof field_obj](field_obj_path, field_obj, T.state);
                        T.set("_representation."+field_obj_path, {as:obj_representation});
                        T.present(field_obj_path, field_obj);
                    }
            }
        });
    };
};

