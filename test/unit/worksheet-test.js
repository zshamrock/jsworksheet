var ASYNC_TEST_TIMEOUT = 1000;

var outputSpy = (function() {
    var buffer = "";
    return {
        html: function(content) {
            if (content) {
                buffer = content;
            } else {
                return buffer;
            }
        }
    }
})();

function mockCodeMirror(data, lineHandleStyles) {
    return {
        lineCount: function() {
            return data.length;
        },
        getLineHandle: function(index) {
            return {styles: lineHandleStyles[index]};
        },
        getLine: function(index) {
            return data[index];
        }
    }
}

test("error style", function() {
    var error = "My Error";
    strictEqual(colorizeError(error),
        "<span class='error'>========== Error ==========</span><br/><span class='error'>" + error + "</span>");
});

test("build line with CodeMirror styles", function() {
    var lineWithCodeMirrorStyles =
        buildLineWithCodeMirrorStyles({styles: ["var", "keyword", " ", null, "x", "variable", " = ", null, "10", "number", ";", undefined]});

    strictEqual(lineWithCodeMirrorStyles, "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>x</span> = <span class='cm-number'>10</span>;</pre>");
});

test("colorize evaluation result", function() {
    var colorizedEvaluationResult = colorizeEvaluationResult(["var x = 10;", "x + 7;"], 7);

    strictEqual(colorizedEvaluationResult, "var x = 10;<br/>x + 7;&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; 7</span>");
});

asyncTest("var statement evaluation", 1, function() {
    var codeMirror = mockCodeMirror(
        ["var x = 10;"],
        [["var", "keyword", " ", null, "x", "variable", " = ", null, "10", "number", ";", undefined]]
    );

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>x</span> = <span class='cm-number'>10</span>;</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; undefined</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

asyncTest("var statement evaluation on the go", 1, function() {
    var codeMirror = mockCodeMirror(
        ["var x = 10;"],
        [["var", "keyword", " ", null, "x", "variable", " = ", null, "10", "number", ";", undefined]]
    );

    doEvaluate(codeMirror, outputSpy, {evaluateVar: true});

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>x</span> = <span class='cm-number'>10</span>;</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; 10</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

asyncTest("evaluate array", 1, function() {
    var codeMirror = mockCodeMirror(
        ["[1,2,3];"],
        [["[", undefined, "1", "number", ",", undefined, "2", "number", ",", undefined, "3", "number", "];", undefined]]
    );

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre>[<span class='cm-number'>1</span>,<span class='cm-number'>2</span>,<span class='cm-number'>3</span>];</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; [1, 2, 3]</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

asyncTest("evaluate array with object elements", 1, function() {
    var codeMirror = mockCodeMirror(
        ["[{}, {}];"],
        [["[{}, {}];", undefined]]
    );

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre>[{}, {}];</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; [{}, {}]</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

asyncTest("evaluate array with strings", 1, function() {
    var codeMirror = mockCodeMirror(
        ['["1", "2"]'],
        [["[", undefined, '"1"', "string", ", ", undefined, '"2"', "string", "]", undefined]]
    );

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre>[<span class='cm-string'>\"1\"</span>, <span class='cm-string'>\"2\"</span>]</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; [\"1\", \"2\"]</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

asyncTest("var statement evaluation on the go for array", 1, function() {
    var codeMirror = mockCodeMirror(
        ["var a = [1,2,3];"],
        [["var", "keyword", " ", null, "a", "variable", " = ", null, "[", undefined, "1", "number", ",", undefined, "2", "number", ",", undefined, "3", "number", "];", undefined]]
    );

    doEvaluate(codeMirror, outputSpy, {evaluateVar: true});

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>a</span> = [<span class='cm-number'>1</span>,<span class='cm-number'>2</span>,<span class='cm-number'>3</span>];</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; [1, 2, 3]</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

asyncTest("evaluation with error", 1, function() {
    var codeMirror = mockCodeMirror(
        ["var x = 10;", "z;"],
        [["var", "keyword", " ", null, "x", "variable", " = ", null, "10", "number", ";", undefined],
        ["z", "variable", ";", undefined]]
    );

    doEvaluate(codeMirror, outputSpy, {evaluateVar: true});

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>x</span> = <span class='cm-number'>10</span>;</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; 10</span><br/><br/>" +
            "<span class='error'>========== Error ==========</span><br/><span class='error'>ReferenceError: z is not defined</span>");
        start();
    }, ASYNC_TEST_TIMEOUT);
});

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
