Kindred.dom = {};

Kindred.dom.root = document.getElementById("kindred-root");

//Kindred.dom.addText = function(parent_element, text) {
//    
//    console.log("adding text "+text); if(parent_element) console.log(" to ELEMENT:"+JSON.stringify({
//                tag: parent_element.nodeName,
//                children: parent_element.children,
//                class: parent_element.className,
//            })); else console.log("err");
//    var textNode = document.createTextNode(text);
//    parent_element.appendChild(textNode);
//
//    return textNode;
//};

Kindred.dom.setAttributeFunc = function(attr) {
    return new Function("element", "attr", "state", "element.setAttribute('"+attr+"', attr)");
};

Kindred.dom.func = function(func, language) {
    console.log("adding function "+func.toString());
    language = language ? language : "javascript";
    switch(language) {
        case "javascript":
            var parsed_func = Aux.parse_function(func);
            console.log("parsed function with args:"+JSON.stringify(parsed_func.args)+" & body "+parsed_func.body);
            break;
        default:
            console.log("unknown language dammit!");
            break;    
    }

};



