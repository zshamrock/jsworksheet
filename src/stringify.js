function stringify(obj) {
    if (isString(obj)) {
        return '"' + obj + '"';
    }
    if (isObject(obj)) {
        return stringifyObject(obj);
    }
    if (isArray(obj)) {
        return stringifyArray(obj);
    }
    return obj;
}

function stringifyObject(object) {
    var property,
        result = [],
        value;

    for (property in object) {
        if (object.hasOwnProperty(property)) {
            value = stringify(object[property]);

            result.push(property + ": " + value);
        }
    }

    return "{" + result.join(", ") + "}";
}

function stringifyArray(array) {
    var i,
        element,
        result = [];
    for (i = 0; i < array.length; i++) {
        element = stringify(array[i]);
        result.push(element);
    }

    return "[" + result.join(", ") + "]";
}