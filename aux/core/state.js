var State = function() {
    var T = this;

    T.data = {};

    T.get = function(field_path) {
        Aux.get_field(T.data, field_path); 
    };

    T.set = function(field_path, value) {
        Aux.set_field(T.data, field_path, value); 
    };
};

