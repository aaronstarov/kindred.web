if(typeof require === "function")  {
    var random_bytes = require("crypto").randomBytes;    
    Aux.get_random_buffer = function(len) {
        return new Uint8Array(random_bytes(len));
    }
} else {
    var set_random_bytes;
    var crypto = window.crypto || window.msCrypto;
    if(crypto) {
        Aux.get_random_buffer = function(len) {
            var buf = new Uint8Array(len);
            crypto.getRandomValues(buf);
            return buf;
        }
    } else {
        Aux.get_random_buffer = function(len) {
            var buf = new Uint8Array(len);
            for(var i = 0; i < len; i++) {
                buf[i] = Math.round(Math.random() *256);
            }
            return buf;
        }
    }
}  

// Make copy with unenumerable properties
Aux.secure_obj = function(obj) {
    secured = {};
    apply_to_fields(obj, function(field) {
        Object.defineProperty(secured, field, {
            enumerable: false,    
        });
    });
    var obfuscated = {};
    var random_str = Aux.get_random_buffer(50 + Math.random()*50).toString();
    Object.defineProperty(obfuscated, random_str, {
        enumerable: false,
        value: obj,    
    });
    return {
        code: random_str,
        obj: obfuscated,
    };
};

/**
 * Returns a byte cipher: 256 bytes in
 * random order with each possible byte 
 * present exactly once.
 *
 * Takes array of ints as seed.
 */
Aux.create_cipher = function(seed, rounds) {
    if(seed.length < 1) return null;
    
    var shuffler = (typeof seed === "undefined") ?
        Aux.get_random_buffer(50 + Math.random(50)) : seed;

    var num_rounds = (typeof rounds === "undefined") ?
         59999 / shuffler.length : rounds;

    var cipher = new Uint8Array(256);
    for(var i = 0; i < 256; i++) {
       cipher[i] = i; 
    }

    var rotation = shuffler.length,
        sum = 0,
        alt = true,
        a, b, tmp;
    for(var i = 0; i < num_rounds; i++) {
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
            rotation += sum;
        }
        sum = 0; 
    }

    return cipher;
};
