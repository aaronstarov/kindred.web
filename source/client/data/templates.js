Template = {};

Template.make_reference = function(obj) {
    var fields_to_fill = Template.make_from(obj);
    // save to database, return unique id
    return reference_id;
};

Template.use_reference = function(id, values) {
    var template = DB.get_template(id);
    Aux.iterate(template.vars, function(open_field) {
        Aux.set_field(template.base, open_field, values[i]);
    });
    return template.base;
};


