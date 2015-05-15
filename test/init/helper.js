var colors = require("colors");
var fs = require("fs");

var num_errors = 0;

function expect(a,b) {
    var err = function() {
        console.log("!! '".red+JSON.stringify(a)+"' does not equal '"+JSON.stringify(b)+"'");
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

var test_output = __dirname+"/../test/test.out";

function note_result(msg) {
    console.log("writing '"+msg+"' to "+test_output);
    fs.writeFileSync(test_output, msg, {flag:'a'});
}
