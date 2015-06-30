Aux.apply_to_fields = function(obj, f) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            f(property);
        }
    }
};

// b takes precedence over a, so if both have
// same field, b's value will be in result
Aux.combine = function(a, b) {
    var c = {};
    Aux.apply_to_fields(a, function(field) {
        c[field] = a[field];
    });
    Aux.apply_to_fields(b, function(field) {
        if(typeof b[field] === "object" && typeof a[field] === "object") {
            c[field] = Aux.combine(a[field], b[field]); 
        } else {
            c[field] = b[field];
        }
    });
    return c;
};

Aux.iterate = function(array, f) {
    var arr = [], 
        len = array.length;
    arr.length = len;
    for(var i = 0; i < len; i++) {
        arr[i] = f(array[i]);
    }
    return arr;
};

Aux.parse_function = function(func) {
    var arg = "", args = [], body = "", 
        parsing = "args",
        count = {
            paren: 0,
            bracket: 0,      
        },
        found = {
            open_paren: false, 
            close_paren: false,
            open_bracket: false,
            close_bracket: false,
        };
    
    Aux.iterate(func.toString(), function(character) {
        switch(parsing) {
            case "args":
                if(!found.open_paren && character === '(') {
                    found.open_paren = true;
                } else if(found.open_paren) {
                    if(character === ',') {
                        args.push(arg);
                        arg = "";
                    } else if(character === ')') {
                        args.push(arg);
                        found.close_paren = true;    
                        parsing = "body";
                    } else {
                        arg += character;
                    }
                }

                break;
            case "body":
                if(!found.open_bracket && character === '{') {
                    found.open_bracket = true;
                } else if(found.open_bracket && !found.close_bracket) {
                    switch(character) {
                        case '{':
                            ++count.bracket 
                            body += character;    
                            break;
                        case '}':
                            if(--count.bracket < 0) {
                                found.close_bracket = true;    
                            } else {
                                body += character;
                            }
                            break;
                        default:
                            body += character;
                    }
                }                
                break;    
        }
    });

    return {
        args: args,
        body: body,    
    };
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
