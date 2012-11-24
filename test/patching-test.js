test("String.endsWith", function() {
    strictEqual("".endsWith(";"), false);

    strictEqual("".endsWith(""), false);

    strictEqual("var x = 5;".endsWith(";"), true);

    strictEqual("function() {}".endsWith("}"), true);

    strictEqual("function() {}".endsWith("{"), false);
});

test("String.trimLeft", function() {
    strictEqual("    var x = 10;".trimLeft(), "var x = 10;");

    strictEqual("function() {} ".trimLeft(), "function() {} ");

    strictEqual("       ".trimLeft(), "");
});

test("String.trimRight", function() {
    strictEqual("var x = 10;   ".trimRight(), "var x = 10;");

    strictEqual(" function() {}".trimRight(), " function() {}");

    strictEqual("       ".trimRight(), "");
});
