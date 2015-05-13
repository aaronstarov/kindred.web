var Arche = {};

Arche.structure = {};

Arche.structure.has_label = 0x80;

Arche.structure.type = {
    void:       0x00,
    bit:        0x10,
    byte:       0x20,
    varint:     0x30,
    container:  0x40,
    list:       0x50,
    tree:       0x60,
    reference:  0x70,
};

Arche.structure.tone = {
    stating:    0x01,
    content:    0x02,
    original:   0x04,  
    defining:   0x08,
};

Arche.fromJS = function(js_object) {
    aux.apply_to_fields(js_object, function(field) {

    });
};

