var obj_a = {
    a: "hi",
    b: "no",
    c: {
        h: { j:0, k:1 },       
        i: { j:0, k:1 },
    },
    d: [0, 1, 2],
    e: [0, 1, 2],
    f: ["a","b","c"],
    g: ["a","b","c"],
    x: 1,
};

Aux.set_field(obj_a, "c.h.j", "k");
Test.expect(obj_a.c.h.j, "k");

Aux.set_field(obj_a, "b", "yes");
Test.expect(obj_a.b, "yes");

var obj_b = {
    a: "hi",
    b: "no",
    c: {
        h: { j:0, k:1 },       
        i: { j:0, k:1 },
    },
    d: [0, 1, 2],
    e: [1, 1, 2],
    f: ["a","b","c"],
    g: ["a","b","d"],
    z: 1,
};

var a_b_template = Aux.make_template(obj_a, obj_b);

var expected_template = {
    base: {
        a: "hi",
        b: null,
        c: {
            h: {j: null, k: 1},
            i: {j: 0, k: 1},
        },
        d: [0, 1, 2],
        e: null,
        f: ["a","b","c"],
        g: null,
        x: undefined,
        z: undefined, 
    },
    vars: [
        {field:"b", type:"string"},
        {field:"c.h.j", type:"void"},
        {field:"e", type:["number"]},
        {field:"g", type:["string"]},
    ],
}

// doing these individually because they are implemented
// separately in the make_template() function
var fields_to_check = ["a","b","d","f","g","c.h.j","c.i.j","c.h.k","c.i.k"];
for(var i in fields_to_check) {
    var expected_v = eval("expected_template.base."+fields_to_check[i]);
    var resulted_v = eval("resulted_template.base."+fields_to_check[i]);
    Test.expect(expected_v, resulted_v);
}

for(var i in expected_template.vars) {
    var expected_v = expected_template.vars[i];
    var resulted_v = a_b_template.vars[i];
    Test.note_result("Template produced var "+resulted_v.field+" with type "+resulted_v.type+".");
    Test.expect(resulted_v.field, expected_v.field);
    Test.expect(resulted_v.field, expected_v.field);
}

var well_formed_obj = Aux.fill_template(expected_template, 
    ["good",{u:0,v:1},[3,45],["so","well","formed"]]);

Test.expect(well_formed_obj.a, "hi");
Test.expect(well_formed_obj.b, "good");
Test.expect(well_formed_obj.c.h.j, {u:0,v:1});
Test.expect(well_formed_obj.e, [3,45]);
Test.expect(well_formed_obj.f, ["a","b","c"]);
Test.expect(well_formed_obj.g, ["so","well","formed"]);

try { 
    var malformed_obj = Aux.fill_template(expected_template,
        [0,{u:0,v:1},[3,45],["so","well","formed"]]);
} catch(err) {
    Test.note_result("Found error while trying to fill template badly.");
}

var object_list_a = {
    a: [{b:1,c:"3",d:5}]
};
var object_list_b = {
    a: [{b:2,c:"4",d:5}]
};

var list_template = {
    base: {
        a: null
    },
    vars: [
        {
            field:a, 
            type:[{ 
                base: {b:1,c:null,d:5},
                vars: [{field:"c", type:"string"} ]
            }]
        },
    ],
};
