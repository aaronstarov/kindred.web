Aux = {};

Aux.apply_to_fields = function(obj, f) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            f(property);
        }
    }
};

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

Aux.template = {};

/**
 * Returns a template for an object based on the similarities
 * and differences between two objects. The point of templates
 * is to significantly reduce the amount of data that has to
 * be sent between computers.
 *
 * Templates are constructed by comparing two objects. Where
 * the field values are the same, we preserve that value in
 * our template. Where the field values differ, we register
 * a variable field. 
 *
 * Instead of sending over entire objects, we can send a template
 * id and an array of values. The values can then be inserted
 * into the template in order to reconstruct a complete object. 
 *
 * We return an object that has a *base* and *vars*. The *base*
 * is an object with **null** in place of any variable fields;
 * *vars* is a list of variable fields along with their types.
 */  
Aux.make_template = function(a, b) {

    var template_helper = function(a, b, field_prefix) {
        var template = {
            base: a, // should contain null for any variable fields
            vars: [],
        };
        Aux.apply_to_fields(a, function(a_field) {
            // If these objects don't share the same field, 
            // exclude that field from the template.
            if(typeof b[a_field] === "undefined") { 
                template.base[a_field] = undefined;
            }
        });
        Aux.apply_to_fields(b, function(b_field) {
            if(typeof a[b_field] === "undefined") { 
                template.base[b_field] = undefined;
            } else {
                var field_path = field_prefix ? field_prefix+'.'+b_field : b_field;
                var b_child = b[b_field];
                var a_child = a[b_field];

                if(typeof a_child === "object" && typeof b_child === "object") {
                    if(Array.isArray(a_child) && Array.isArray(b_child)) {
                        // Here, we're simply assuming that the first element of the array
                        // is representative of the structure of the rest.
                        // The interface itself should attempt to make this true. Ultimately,
                        // much more of the templating should be done by observing what people
                        // copy/change between objects.
                        var a_type = typeof a_child[0];
                        var b_type = typeof b_child[0];

                        if(a_type !== b_type) {
                            template.vars.push({field:b_field, type:["void"]});
                        } else if(a_type !== "object") {
                            template.vars.push({field:b_field, type:[a_type]});
                        } else {
                            // We need to find the commonality between the objects in the arrays.
                            var subtemplate = Aux.make_template(a_child, b_child);
                            // At this point, we'll assume that the lists are not composed of 
                            // exactly the same objects. We'd have to check every item in the list
                            // to confirm or deny this. This is a pretty strong
                            // argument for actively tracking changes made by users instead of 
                            // reactively trying to determine the differences between objects.
                            template.base[b_field] = null; 
                            template.vars = template.vars.concat({field:b_field,type:[subtemplate]});
                        }

                        if(a_child.length != b_child.length) {
                            template.base[b_field] = null; 
                        } else {
                            for(var _i in a_child) {
                                if(a_child[_i] != b_child[_i]) {
                                    template.base[b_field] = null;
                                }
                            }
                        }

                        // If we weren't to assume that the first element is representative of the
                        // rest, the code would look something like this:
                        //
                        // var consistent_types = true;
                        // for(var a_i = 1; a_i < a_child.length; a_i++) {
                        //     if(a_type != typeof a_child[a_i]) {
                        //         consistent_types = false;
                        //         break
                        //     }
                        //     // check for consistency of elements in array
                        //     if(a_type === "object") {
                        //         a_template = Aux.make_template(a_template.base, a_child[a_i]);
                        //     }
                        // }
                        // if(consistent_types) {
                        //     for(var b_i = 1; b_i < b_child.length; b_i++) {
                        //         if(b_type != typeof b_child[b_i]) {
                        //             consistent_types = false;
                        //             break
                        //         }
                        //         if(a_type === "object") {
                        //             b_template = Aux.make_template(b_template.base, b_child[b_i]);
                        //         }
                        //     }
                        // }
                        // 
                        // var a_template = a_child[0];
                        // 
                        // if(consistent_types) {
                        //     var subtemplate = Aux.make_template(a_template.base, b_template.base);
                        //     template.base[b_field] = [subtemplate.base];
                        //     template.vars = template.vars.concat([subtemplate.vars]);
                        // } else {
                        //     
                        // }
                    } else { // dealing with plain objects, not arrays
                        var subtemplate = Aux.template_helper(a_child, b_child, field_path);
                        template.base[b_field] = subtemplate.base;
                        template.vars = template.vars.concat(subtemplate.vars);
                    }
                } else {
                    if(a_child !== b_child) {
                       template.base[b_field] = null;
                       if(typeof a_child === typeof b_child) {
                           template.vars.push({field:field_path, type:typeof a_child});
                       } else {
                           template.vars.push({field:field_path, type:"void"});
                       }
                    }
                }

            }
        });
        return template;
    }

    return template_helper(a, b, '');

}

/**
 *  (Possibly TODO) Finds the overlapping structures between two objects.
 *  More likely, we'll be able to rely solely on copy-paste behavior.
 *  Aux.overlap = function(a, b) {
 *      
 *  };
 */
