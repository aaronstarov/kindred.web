Kindred.events = function() {
    var T = this;
    
    T.functions = {};
    T.active = {};

    T.register = function(event_type, elem, func) {
        var active_f = new Function("e", "func.call(elem, e);");
        var inactive = new Function("e", "return;");
        var i = functions[event_type].length;
        T.functions[event_type].push(f);
        // set functions to inactive when they do not have focus
        document.addEventListener("click", function() {
            T.functions[event_type][i] = inactive;
        });
        elem.addEventListener("click", function() {
            setTimeout(function() {
            T.functions[event_type][i] = active_f;        
            }, 100); // XXX hacky, but we're waiting for event to propogate 
                    // up to document level - better way would be to 
                   // use focusin/focus events, but chosing against that
                  // due to lack of cross-browser support
        });
        
        // XXX using these won't propogate focus up to 
        // parents like the above, but the idea is that if we're
        // gaining focus through non-clicking means (e.g. tabbing),
        // parental focus will already be properly set. This
        // will not always be the case so beware XXX
        elem.addEventListener("focus", function() {
            T.functions[event_type][i] = active_f;        
        });
        elem.addEventListener("focusin", function() {
            T.functions[event_type][i] = active_f;        
        });
                
    };

    var event_template = function(event_type) {
        var str = "T.functions['"+event_type+"'] = [];";
        str += "T.active['"+event_type+"'] = [];";
        str += "document.addEventListener('"+event_type+"', function(e) {";
        str += "    _.each(T.functions['"+event_type+"'], function(f) {";
        str += "        f(e);";
        str += "    });";
        str += "};";
    };

    var event_types = ["keyup","keydown","keypress"];
    _.each(event_types, function(t) {
        eval(event_template(t));
    });

};
