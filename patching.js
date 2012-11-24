String.prototype.trimRight = String.prototype.trimRight || function () {
    return this.replace(/\s+$/g, "");
};

String.prototype.trimLeft = String.prototype.trimLeft || function () {
    return this.replace(/^\s+/g, "");
};

String.prototype.endsWith = String.prototype.endsWith || function(suffix) {
    return this.length ? this.lastIndexOf(suffix) === this.length - 1 : false;
};