// Make copy with unenumerable properties
Aux.secure_obj = function(obj) {
    secured = {};
    apply_to_fields(obj, function(field) {
        Object.defineProperty(secured, field, {
            enumerable: false,    
        });
        secure_obj(secured[field]);
    });
};

Aux.get_random_byte = function() {
  return Math.round(Math.random() * 256);
};

Aux.get_random_buffer = function(min, max) {
    var rand_buffer = [];
    for(var i = 0; i < min; i++) {
      rand_buffer.push(Aux.get_random_byte());        
    }
    var len = min,
        end_byte = Aux.get_random_byte(),
        rand_byte = Aux.get_random_byte();
    while(len < max && rand_byte != end_byte) {
        rand_buffer.push(rand_byte);
        rand_byte = Aux.get_random_byte();    
        ++len;
    }
    return new Uint8Array(rand_buffer);  
};

/**
 * Returns a byte cipher: 256 bytes in
 * random order with each possible byte 
 * present exactly once.
 *
 * Takes array of ints as seed.
 */
Aux.create_cipher = function(seed) {
    
    var num_rounds = 1248 / seed.length;

    console.log("Num rounds:"+num_rounds.toString());

    cipher = new Uint8Array(256);
    for(var i = 0; i < 256; i++) {
       cipher[i] = i; 
    }

    var shuffler = seed,
        rotation = seed.length,
        sum = 0,
        alt = true,
        a, b, tmp;
    for(var i = 0; i < num_rounds; i++) {
        console.log("Cipher round: "+i.toString());
        for(var x = 0; x < seed.length; x++) {
            var shuff = shuffler[x];
            if(alt) {
                a = shuff;
            } else {
                b = shuff;
                tmp = cipher[b];
                cipher[b] = cipher[a];
                cipher[a] = tmp;    
            }
            alt = !alt;
            shuffler[x] = (shuff + rotation) % 256;
            sum += shuff;
        }
        rotation += sum;
        sum = 0; 
    }

    return cipher;
};
