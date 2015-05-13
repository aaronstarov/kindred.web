aux = {
    apply_to_fields: function(obj, f) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                f(property);
            }
        }
    },

    // Make so that no one can list values of object
    secure_obj: function(obj) {
        secured = {};
        apply_to_fields(obj, function(field) {
            Object.defineProperty(secured, field, {
                enumerable: false,    
            });
            secure_obj(secured[field]);
        });
    },
    
    get_random_char: function() {
      return String.fromCharCode(Math.random() * 255 + 1);
    },

    get_random_str: function(min, max) {
        rand_str = "";
        for(var i = 0; i < min; i++) {
          rand_str += this.get_random_char();        
        }
        len = min;
        end_char = this.get_random_char();
        var rand_char = this.get_random_char();
        while(len < max && rand_char != end_char) {
            rand_str += rand_char;
            rand_char = this.get_random_char();    
            ++len;
        }
        return rand_str;  
    },

    // field path is dot.separated.notation (spaces okay)
    set_field: function(obj, field_path, value) {
        var assignment = "obj";
        var fields = field_path.split('.');
        for(var i in fields) {
            assignment += "['"+fields[i]+"']";
        }
        assignment += "=value;";
        eval(assignment);
    },

    find_undefined_fields: function(obj, prefix) {
        var undefined_fields = [],
            other_fields = [];
        this.apply_to_fields(obj, function(field) {
            var field_obj = obj[field],
                field_path = prefix ? prefix+"."+field : field;
            switch(typeof field_obj) {
                case "undefined":
                    undefined_fields.push(field_path);
                    break;
                case "object":
                    other_fields.push({
                        obj:field_obj,
                        path:field_path,
                    });
                    break;
            } 
        });

        // javascript objects guarentee no specific order, so
        // we'll explicitly arrange alphabetically to get deterministic ordering
        undefined_fields.sort();
        other_fields.sort(function(a,b) {
            return (a.path < b.path) ? -1 : (a.path > b.path) ? 1 : 0;
        });

        for(var i in other_fields) {
            var other_field = other_fields[i];
            undefined_fields = undefined_fields.concat(this.find_undefined_fields(other_field.obj, other_field.path));
        }
        return undefined_fields;
    },

};

if(typeof module === "object") { module.exports = aux; }
