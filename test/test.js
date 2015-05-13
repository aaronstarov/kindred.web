var num_errors = 0;

function expect(a,b) {
    var err = function() {
        console.log("!! '"+JSON.stringify(a)+"' does not equal '"+JSON.stringify(b)+"'");
        ++num_errors;
    }
    if(Array.isArray(a) && Array.isArray(b)) {
        if(a.length == b.length) {
            for(var i in a) {
                if(a[i] != b[i]) {
                    err();
                    break;    
                }
            }
        }
    } else if(a != b) {
        err();
    }
}

var GH = [
    function d() {
        console.log("GH");
    },
    "string",
    ["a","b","c"],
    213,
];

var f = function(){
    this.a = "hi";
    this.say = function() { return this.a; };
};

var F = new f();
expect("hi",F.say());
F.a = "n";
expect("n",F.say());

var aux = require("./lib/0-aux");

var obj = {
    t: {
        d: undefined,
        a: undefined,
        b: {
            c: undefined,
        },
        str: "string",
        num: 42,
    },
    v: undefined,
};

var undefined_fields = aux.find_undefined_fields(obj);
// order is important here
expect(["v","t.a","t.d","t.b.c"], undefined_fields);

aux.set_field(obj, "t.b.c", 5);
expect(obj.t.b.c, 5);

aux.set_field(obj, "v", "str");
expect(obj.v, "str");

expect(["t.a","t.d"], aux.find_undefined_fields(obj));


console.log("\nFinished testing with "+num_errors.toString()+" errors.");
