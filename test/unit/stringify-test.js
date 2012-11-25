test("stringify object", function() {
    strictEqual(stringifyObject({}), "{}");

    strictEqual(stringifyObject({lang: "JavaScript", version: 5, data: [1,2,3]}),
        "{lang: \"JavaScript\", version: 5, data: [1, 2, 3]}");

    strictEqual(stringifyObject({object: {object: {object: {lang: "JavaScript"}}}}),
        "{object: {object: {object: {lang: \"JavaScript\"}}}}");

    strictEqual(stringifyObject({data: [{}, {}]}), "{data: [{}, {}]}");
});

test("stringify array", function() {
    strictEqual(stringifyArray([]), "[]");

    strictEqual(stringifyArray([1,2,"3"]), '[1, 2, "3"]');

    strictEqual(stringifyArray([{lang: "JavaScript"}]), '[{lang: "JavaScript"}]');
});

test("stringify", function() {
    strictEqual(stringify("JavaScript"), '"JavaScript"');

    strictEqual(stringify(1), 1);

    strictEqual(stringify(undefined), undefined);

    strictEqual(stringify([]), "[]");

    strictEqual(stringify({}), "{}");
});
