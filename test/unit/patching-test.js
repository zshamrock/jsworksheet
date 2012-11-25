test("String.endsWith", function() {
    strictEqual("".endsWith(";"), false);

    strictEqual("".endsWith(""), false);

    strictEqual("var x = 5;".endsWith(";"), true);

    strictEqual("var x = 5;    ".endsWith(";"), false);

    strictEqual("function() {}".endsWith("}"), true);

    strictEqual("function() {}".endsWith("{"), false);

    strictEqual("String.endsWith".endsWith("EndsWith"), false);
});

test("String.startsWith", function() {
    strictEqual("".startsWith(";"), false);

    strictEqual("".startsWith(""), true);

    strictEqual("var x = 5;".startsWith("var"), true);

    strictEqual("    var x = 5;".startsWith("var"), false);

    strictEqual("function sqr() {}".startsWith("sqr"), false);

    strictEqual("function() {}".startsWith(""), true);

    strictEqual("Function() {}".startsWith("function"), false);
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

test("String.count", function() {
    strictEqual("function() {}".count("{"), 1);

    strictEqual("{{{}{".count("{"), 4);

    strictEqual("}}}}}".count("{"), 0);

    strictEqual("".count("{"), 0);
});

test("String.trim", function() {
    strictEqual("          ".trim(), "");

    strictEqual("   JavaScript   ".trim(), "JavaScript");

    strictEqual("JavaScript".trim(), "JavaScript");
});

test("String.isEmpty", function() {
    strictEqual("".isEmpty(), true);

    strictEqual("         ".isEmpty(), true);

    strictEqual("  JavaScript   ".isEmpty(), false);
});

test("String.isNotEmpty", function() {
    strictEqual("".isNotEmpty(), false);

    strictEqual("         ".isNotEmpty(), false);

    strictEqual("  JavaScript   ".isNotEmpty(), true);
});
