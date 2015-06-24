table_renderer = new Kindred.presentation();

table_renderer.of.colspan = Kindred.dom.setAttributeFunc("colspan");
table_renderer.of.rowspan = Kindred.dom.setAttributeFunc("rowspan");

table_renderer.of.table_value = Kindred.dom.addText; 

table_renderer.of.class = function(element, the_class, state) {
    base.of.class(element, the_class, state); 
    if(the_class === "value") element.style = {
        backgroundColor: "#666",
        color: "white",
    };
};

table_renderer.base.entry = { 
    html: "td",
    style: { 
        backgroundColor: "#333",
        padding: "4px",
    },      
};

var Table = function(obj_name, obj) {
    console.log("new Table("+obj_name+","+JSON.stringify(obj)+")");
    this.rows = [];
    this.index = [];
    this.parse(obj_name, obj, 0);
    this.add_padding();
};

Table.prototype.parse = function(field, obj, depth) {
    var T = this;     
    console.log("parsing "+JSON.stringify({
        depth: depth,
        rows: T.rows,
        rows_len: T.rows.length,
        obj: obj,
        type: typeof obj,
        field: field,
    }));

    while(depth > T.rows.length-2) {
        this.rows.push({ html:"tr", content:[]});
    }

    var col_obj = { base:"entry" };    
    var colspan = 0;
    
    col_obj.table_value = field;
    if(typeof obj === "object") {
        Aux.apply_to_fields(obj, function(obj_field) {
            console.log("parse("+JSON.stringify({
                field: obj_field,
                obj: obj[obj_field],
                depth: depth+1,
            })+");");
            colspan += T.parse(obj_field, obj[obj_field], depth+1);
        });
        col_obj.colspan = colspan;
    } else {
        
        // add the actual value to the row below
        var str, obj_type = typeof obj, value_depth = depth+1;
        switch(obj_type) {
            case "undefined": str = "UNDEFINED"; break
            case "null": str = "NULL"; break
            default: str = obj.toString(); break
        }
        T.index.push({depth: value_depth, column: T.rows[value_depth].content.length});
        T.rows[value_depth].content.push({ 
            html: "td", 
            table_value: str,
            style: { backgroundColor: "#666", },
        }); 
        colspan = 1;
    }
    T.rows[depth].content.push(col_obj);
    return colspan;
};

Table.prototype.add_padding = function() {
    var T = this;
    var max_depth = T.rows.length;
    Aux.iterate(T.index, function(i) {
        var padding_depth = i.depth+1;
        if(padding_depth < max_depth) {
            var padding = { 
                html: "td", 
                rowspan: max_depth - padding_depth,
                //style: { backgroundColor: "#900", },
            };
            T.rows[padding_depth].content.splice(i.column, 0, padding);        
        }
    });
};

table_renderer.preprocess = function(obj, state) {
    state.cache = {};
    var title = obj.title ? obj.title : "Table";
    var table = new Table(title, obj);
    console.log(JSON.stringify(table.rows));
    return {
        html: "table",    
        content: table.rows,
    };
};
