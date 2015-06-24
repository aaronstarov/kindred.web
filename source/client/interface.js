Kindred.composer = {
    composition: {
        elements: [],
        add: {
            content: "Add...",
            style: {
                borderTop: "1px solid black",    
                borderBottom: "1px solid black",
                color: "#666",    
            },
            onkeyup: function(e) {
                if(e.keyCode === 13) { // Enter
                    var entered_template = e.target.value,
                        template = Kindred.templates[entered_template];
                    if(typeof template !== "undefined") {
                        elements.push(template); // TODO -> extend template or something
                    } else {
                        var new_elem = {};
                        new_elem[e.target.value] = {}; 
                        elements.push({});
                    }
                }
            },
        },
    },
};

Kindred.element = {
    style_editor: {
        expand_or_contract: {
            onclick: function() {
                
            },
        },
        style: {
            display: "hidden",   
        },
        rules: [],
    },
    copy_content: {

    }
};
