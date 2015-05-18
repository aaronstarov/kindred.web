Kindred.dom = {};

Kindred.dom.root = document.getElementById("kindred-root");

Kindred.dom.addHTML = function(parent_element, html_obj) {
    var elements = [];
    Aux.apply_to_fields(html_obj, function(tag) {
        var tag_obj = html_obj[tag];
        var element = document.createElement(tag);
        Aux.apply_to_fields(tag_obj, function(field) {
            switch(field) {
                case "style":
                    var style_obj = tag_obj["style"];
                    Aux.apply_to_fields(style_obj, function(style_field) {
                        console.log("style "+style_field+": "+style_obj[style_field]);
                        element.style[style_field] = style_obj[style_field]; 
                    });
                    break;
                case "content":
                    Kindred.dom.addText(element, tag_obj["content"]);
                    break;
                default:
                    element.setAttribute(field, tag_obj[field]);    
            }
        });
        console.log(JSON.stringify(html_obj)); 

        parent_element.appendChild(element);
        elements.push(element);
    });
    return elements;
};

Kindred.dom.addText = function(parent_element, text) {
    parent_element.appendChild(document.createTextNode(text));
};

