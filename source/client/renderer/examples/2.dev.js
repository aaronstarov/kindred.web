var numbers = {
    keycode: null,
    keycode_input: {
        html: "input",
        attr: {
            placeholder: "Enter text",
        },
        onkeydown: function(e) {
            this.keycode = e.keyCode;
        },
    },
    num: 0,
    increment: {
        html: "button",
        innerHTML: "Increment",
        onclick: function() {
            this.num++;
        },
    },

    css: Kindred.examples.css,
    css_of: Kindred.examples.css_of,
};

