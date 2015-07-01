Kindred.basic.form = {
    of: {
        validate: function(elem, validation_func) {
            if(typeof func === "function") {
                elem.addEventListener("keydown", function(e) {
                    try { 
                        validation_func(e.target.value);
                    } catch (err) {
                        elem.className += " invalid";
                        var error_msg = document.createElement("div");
                        error_msg.className = "error-message";
                        error_msg.innerHTML = err;
                        elem.parentElement.insertBefore(elem, error_msg);                     
                    }
                });
            }
        },
    },

    html_for: {
        string: "input",
        number: "input",
    },

    string: function(elem, text) {
        console.log("FORM PRESENTATION");
        elem.setAttribute("placeholder", text);
    },

    number: function(elem, n) {
        elem.setAttribute("type", "number");
        elem.value = n;
        this.of.validate(elem, function(str) {
            try {
                parseInt(str);    
            } catch (err) {
                throw "Please enter a number.";
            }
        });
    },

    boolean: function(elem, bool) {
        elem.setAttribute("type", "checkbox");
        elem.setAttribute("checked", bool); 
    },
};
