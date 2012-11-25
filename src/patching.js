String.prototype.trimRight = String.prototype.trimRight || function () {
    return this.replace(/\s+$/g, "");
};

String.prototype.trimLeft = String.prototype.trimLeft || function () {
    return this.replace(/^\s+/g, "");
};

String.prototype.endsWith = String.prototype.endsWith || function(suffix) {
    return this.length ? this.lastIndexOf(suffix) === this.length - 1 : false;
};

String.prototype.startsWith = String.prototype.startsWith || function(prefix) {
    return this.indexOf(prefix) === 0;
};

String.prototype.count = String.prototype.count || function(what) {
    return this.split(what).length - 1;
};

String.prototype.trim = String.prototype.trim || function() {
    return this.trimLeft().trimRight();
};

String.prototype.isEmpty = String.prototype.isEmpty || function() {
    return this.trim().length === 0;
};

String.prototype.isNotEmpty = String.prototype.isNotEmpty || function() {
    return !this.isEmpty();
};
