Aux = {};

Aux.apply_to_fields = function(obj, f) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            f(property);
        }
    }
};

Aux.iterate = function(array, f) {
    for(var i = 0, len = array.length; i < len; i++) {
        f(array[i]);
    }
}

// XXX possible optimization for 2 functions below: replace .split()
// field path is dot.separated.notation (spaces okay)
Aux.get_field = function(obj, field_path) {
    var retrieval = "obj";
    var fields = field_path.split('.');
    for(var i in fields) {
        retrieval += '["'+fields[i]+'"]';
    }
    return eval(retrieval);
};

// field path is dot.separated.notation (spaces okay)
Aux.set_field = function(obj, field_path, value) {
    var assignment = "obj";
    var fields = field_path.split('.');
    for(var i in fields) {
        assignment += '["'+fields[i]+'"]';
    }
    assignment += "=value;";
    eval(assignment);
};

//Aux.find_undefined_fields = function(obj, prefix) {
//    var undefined_fields = [],
//        other_fields = [];
//    this.apply_to_fields(obj, function(field) {
//        var field_obj = obj[field],
//            field_path = prefix ? prefix+"."+field : field;
//        switch(typeof field_obj) {
//            case "undefined":
//                undefined_fields.push(field_path);
//                break;
//            case "object":
//                other_fields.push({
//                    obj:field_obj,
//                    path:field_path,
//                });
//                break;
//        } 
//    });
//
//    // javascript objects guarentee no specific order, so
//    // we'll explicitly arrange alphabetically to get deterministic ordering
//    undefined_fields.sort();
//    other_fields.sort(function(a,b) {
//        return (a.path < b.path) ? -1 : (a.path > b.path) ? 1 : 0;
//    });
//
//    for(var i in other_fields) {
//        var other_field = other_fields[i];
//        undefined_fields = undefined_fields.concat(this.find_undefined_fields(other_field.obj, other_field.path));
//    }
//    return undefined_fields;
//};
