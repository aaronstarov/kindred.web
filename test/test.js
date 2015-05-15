
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

note_result(JSON.stringify(obj));

Aux.set_field(obj, "t.b.c", 5);
expect(obj.t.b.c, 5);

Aux.set_field(obj, "v", "str");
expect(obj.v, "str");

note_result("Set field test passed.");

var arr = [4,5,6];
var arr8 = new Uint8Array(arr);
expect(arr8.length, arr.length);

note_result("Arrays have expected lengths...");

var rand_buffer = Aux.get_random_buffer();
note_result("Created random buffer: "+rand_buffer);
var cipher = Aux.create_cipher(rand_buffer);
note_result("create_cipher() w/ random seed: "+JSON.stringify(cipher));
var simple_buffer = new Uint8Array([1,2,4,8,12]);
var simple_cipher = Aux.create_cipher(simple_buffer);
note_result("create_cipher() w/ seed [1,2,4,8,12]: "+JSON.stringify(simple_cipher));
var trivial_buffer = new Uint8Array([1,1,1,1,1,1]);
var trivial_cipher = Aux.create_cipher(trivial_buffer);
note_result("create_cipher() w/ seed [1,1,1,1,1,1]: "+JSON.stringify(trivial_cipher));
var byte_found = [];
// check that ciphers contain every single byte once
var ciphers = [cipher, simple_cipher, trivial_cipher];
for(var c in ciphers) {
    var the_chipher = chiphers[c];
    for(var i = 0; i < 256; i++) {
        byte_found.push(false);
    }
    for(var i = 0; i < 256; i++) {
        byte_found[the_cipher[i]] = true;
    }
    var num_bytes_missing = 0;
    for(var i = 0; i < 256; i++) {
        if(!byte_found[i]) {
            num_bytes_missing++;
        }
    }
    if(num_bytes_missing > 0) {
        console.log("!! ".red + "There are "+num_bytes_missing+" from cipher "+c+".");
        num_errors++;
    }
}

