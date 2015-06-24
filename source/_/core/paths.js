Aux.path = function(str) {
    this.parts = str.split('.');
    var len = this.parts.length;
    this.parent_path = this.parts.slice(0, len-1).join('.');
    this.last = this.parts[len-1];
};
