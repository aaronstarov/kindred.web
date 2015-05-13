var obj = {
    hi: "there",
    we: "are",
    doing: "well",
};

var root = document.getElementById("root");

aux.apply_to_fields(obj, function(field) {
    root.innerHTML += "<div class='field'>"+field+"</div>";
    root.innerHTML += "<div class='value'>"+JSON.stringify(obj[field])+"</div>";
});
