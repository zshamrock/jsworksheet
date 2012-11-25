test("get object type", function() {
    strictEqual(getObjectType(""), "String");

    strictEqual(getObjectType([]), "Array");

    strictEqual(getObjectType({}), "Object");

    strictEqual(getObjectType(function() {}), "Function");

    strictEqual(getObjectType(undefined), "Undefined");

    strictEqual(getObjectType(null), "Null");

    strictEqual(getObjectType(0), "Number");
});

test("isArray", function() {
    strictEqual(isArray([]), true);

    strictEqual(isArray(undefined), false);

    strictEqual(isArray(""), false);
});

test("isObject", function() {
    strictEqual(isObject({}), true);

    strictEqual(isObject(undefined), false);

    strictEqual(isObject(function() {}), false);

    strictEqual(isObject(new function() {}), true);
});

test("isString", function() {
    strictEqual(isString({}), false);

    strictEqual(isString(undefined), false);

    strictEqual(isString(function() {}), false);

    strictEqual(isString(""), true);

    strictEqual(isString(new String("")), true);
});