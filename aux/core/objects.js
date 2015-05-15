Aux = {};

Aux.apply_to_fields = function(obj, f) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            f(property);
        }
    }
};

// field path is dot.separated.notation (spaces okay)
Aux.set_field = function(obj, field_path, value) {
    var assignment = "obj";
    var fields = field_path.split('.');
    for(var i in fields) {
        assignment += "['"+fields[i]+"']";
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
            // The reciprocol to the check above is implicitly done
            // in initializing template.base to a.

            var b_child = b[b_field];
            var a_child = a[b_field];

            if(typeof a_child === "object" && typeof b_child === "object") {
                var subtemplate = Aux.template_helper(a_child, b_child, field_path);
                template.base[b_field] = subtemplate.base;
                template.vars = template.vars.concat(subtemplate.vars);
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
