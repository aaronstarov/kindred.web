var our_obj = { 
    field: {
        child: {
            text: "",
            html: "p",
        },

        onclick: function(e) {
            this.field.child.text += "✓";
        }

        style: { backgroundColor: #333 },
        css: "color: #fafafa;",
        css_of: {
            p: "font-size: 1.1em; padding: 40px;",
            "span.text": "font-weight: bold;",
        },
        
    },
}

Kindred.present(our_obj);
