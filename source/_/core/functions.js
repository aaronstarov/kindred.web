
Aux.parse_function = function(func) {
    var arg = "", args = [], body = "", 
        parsing = "args",
        count = {
            paren: 0,
            bracket: 0,      
        },
        found = {
            open_paren: false, 
            close_paren: false,
            open_bracket: false,
            close_bracket: false,
        };
    
    Aux.iterate(func.toString(), function(character) {
        switch(parsing) {
            case "args":
                if(!found.open_paren && character === '(') {
                    found.open_paren = true;
                } else if(found.open_paren) {
                    if(character === ',') {
                        args.push(arg);
                        arg = "";
                    } else if(character === ')') {
                        args.push(arg);
                        found.close_paren = true;    
                        parsing = "body";
                    } else {
                        arg += character;
                    }
                }

                break;
            case "body":
                if(!found.open_bracket && character === '{') {
                    found.open_bracket = true;
                } else if(found.open_bracket && !found.close_bracket) {
                    switch(character) {
                        case '{':
                            ++count.bracket 
                            body += character;    
                            break;
                        case '}':
                            if(--count.bracket < 0) {
                                found.close_bracket = true;    
                            } else {
                                body += character;
                            }
                            break;
                        default:
                            body += character;
                    }
                }                
                break;    
        }
    });

    return {
        args: args,
        body: body,    
    };
};

