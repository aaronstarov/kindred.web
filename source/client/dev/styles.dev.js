var colors = {
    dark: {
        red: "#420008",
        purple: "#42001b",
    },

    white: "#fafafa",
};

Kindred.css = "margin: 40px auto; width: 800px; font-family: Lustria;";
Kindred.css_of = {
    "h1, h2, h3": "font-family: Cinzel;",
    h1: "text-align: center; line-height: 400px; font-size: 3em;",
    h2: "border-top: 8px solid black; line-height: 80px; margin-top: 100px; font-size: 1.7em;",
    h3: "margin-top: 40px; font-size: 1.5em;",
    h4: "font-size: 1.2em;",
    h5: "font-size: 1em;",
    a: "text-decoration: none; color: #900; font-weight: bold;",
    ".sidenote-wrapper": "position: relative; width: 0; height: 0",
    ".sidenote": "position: absolute; width: 200px; left: -220px; top: -80px; font-size: .8em; border-right: 4px solid black; padding-right: 4px;",
    pre: "margin-left: 50px;",
    code: "font-weight: bold; color: #333;",
};

Kindred.examples = {};

Kindred.examples.css = "background-color: #333; padding: 20px;";
Kindred.examples.css_of = {
    span: "min-width: 40px; border: 1px solid white; padding: 4px;",
    button: "background-color: linear-gradient("+colors.dark.red+","+colors.dark.purple+");",
};
