// Hello Worldish Example
// 
// Comments represent the state of Kindred on June 30th, 2015

var hey = { 
    elem: { // <div class="elem"> will be created
        css: "background-color: #333;", // css rule .elem { background-color: #333; } will be added to stylesheet
        c:"hey", // <div class="c">hey</div> will be created inside div.elem
        onclick: function(e){ 
            if(e) { alert("hi");} // div.elem will alert("hi"); when clicked 
        } 
    }
};
//Kindred.present(hey, Kindred.root, {mode: "form"}); 
Kindred.present(hey, Kindred.root); 
hey.elem.c = "something else"; // The content of div.c will now be "something else"
hey.elem.c.style = { backgroundColor: "#900000" }; // The style of div.c will NOT be changed (though it probably should)


