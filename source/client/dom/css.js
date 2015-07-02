var stylesheet = document.styleSheets[0];

var css_selector_base = "var selectors = elem.className.split(' ');" +
    "if(selectors[0] === '') return '';"+
    "return '.'+selectors";

Kindred.dom.css_selectors = new Function("elem", css_selector_base+".join(', .');");
Kindred.dom.css_selector  = new Function("elem", css_selector_base+"[0];");

Kindred.dom.cssFunc = (typeof stylesheet.insertRule === "function") ?
    ( 
    function(selector, css) {
        console.log("s: "+selector+" c: "+css);
        stylesheet.insertRule(selector+" { "+css+" }", stylesheet.cssRules.length);
    }
    )
    :
    (
    function(selector, css) {
        stylesheet.addRule(selector, css, -1);
    }
    )
    ;

    // TODO: take into account context -- once templates are added, we can add
    // an additional selector to apply the style to only elements with matching
    // template class
    //
    // Alternatively (and probably better), unique class generation for each element..
    // eh, eh?
