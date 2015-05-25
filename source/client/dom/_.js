Kindred.dom = {};

Kindred.dom.root = document.getElementById("kindred-root");

Kindred.dom.addText = function(parent_element, text) {
    parent_element.appendChild(document.createTextNode(text));
};

Kindred.dom.addFunc = function(element, func_type, func) {
    var existing_func = element.getAttribute(func_type);
    switch(typeof func) {
        case "string":
            element.setAttribute(func_type, existing_func+func+';'); 
            break;
        case "function":
            element.setAttribute(func_type, existing_func+"("+func.toString()+")();"); 
            break;    
    }

};

