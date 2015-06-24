Test = {};

Test.report = {
    title: "Kindred Tests",
    num_errors: 0,
    sections: [],
};

Test.current_section = null;

Test.begin = function(name) {
    Test.current_section = {test:name, num_errors:0, results:[]};
    Test.report.sections.push(Test.current_section);
};

Test.note_result = function(note, result) {
    obj = {};
    obj[note] = result;
    Test.current_section.results.push(obj);
};

Test.error = function(msg) {
    Test.current_section.results.push({
        error: msg,
    });
    Test.report.num_errors++;
    Test.current_section.num_errors++;
};

Test.expect = function(a,b) {
    var err_msg = "We expected "+JSON.stringify(a)+" to equal "+JSON.stringify(b)+".";
    if(typeof b === "function") {
        if(!b(a)) {
            var msg = "We expected f("+JSON.stringify(a)+") to evaluate to true with f="+b.toString()+".";
            Test.error(msg);
        }
    } else if(Array.isArray(a) && Array.isArray(b)) {
        if(a.length === b.length) {
            for(var i in a) {
                if(a[i] != b[i]) {
                    Test.error(err_msg);
                    break;    
                }
            }
        }
    } else if(a != b) {
        Test.error(err_msg);
    }
}

