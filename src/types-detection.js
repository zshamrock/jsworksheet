function isArray(obj) {
    return getObjectType(obj) === "Array";
}

function isObject(obj) {
    return getObjectType(obj) === "Object";
}

function isString(obj) {
    return getObjectType(obj) === "String";
}

function getObjectType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
}