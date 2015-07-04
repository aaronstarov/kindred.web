for(var i = 0; i < 25; i++) {
    var rand_buffer = Aux.get_random_buffer(20, 200);
    Test.expect(rand_buffer.length, function(len){ return len > 0; });
    Test.note_result("random buffer length", rand_buffer.length);
}
var rand_buffer = Aux.get_random_buffer(20, 200);
Test.note_result("Created random buffer", rand_buffer);

var cipher = Aux.create_cipher(rand_buffer);
Test.note_result("create_cipher() w/ random seed", cipher);

var simple_buffer = new Uint8Array([1,7,4,8,12,3,3,8]);
var simple_cipher = Aux.create_cipher(simple_buffer);
Test.note_result("create_cipher() w/ seed [1,2,4,8,12]", simple_cipher);

var trivial_buffer = new Uint8Array([1,2,1,2,1,2]);
var trivial_cipher = Aux.create_cipher(trivial_buffer);
Test.note_result("create_cipher() w/ seed [1,1,1,1,1,1]", trivial_cipher);

// check that ciphers contain every single byte once
var ciphers = [cipher, simple_cipher, trivial_cipher];
for(var c in ciphers) {
    var the_cipher = ciphers[c];
    var byte_found = [];
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
        current_section.results.push({
            error:"There are "+num_bytes_missing+" bytes missing from cipher "+c+1+".",
        });
        num_errors++;
    }
}

