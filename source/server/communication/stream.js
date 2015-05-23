var stream = require('stream');

var Cipher = {};

Cipher.stream = function(cipher) {
    this.buffer = Uint8Array(65536);
    this.cipher = cipher;
    this.alt = true;
    this.stream = new stream.Transform();
    this.stream._transform = function(){};
    this.persist = function(){}; // save in db, discard backup state
};
