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
            return {styles: lineHandleStyles};
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

asyncTest("var statement evaluation", 1, function() {
    var codeMirror = mockCodeMirror(
        ["var x = 10;"],
        ["var", "keyword", " ", null, "x", "variable", " = ", null, "10", "number", ";", undefined]);

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>x</span> = <span class='cm-number'>10</span>;</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; undefined</span>");
        start();
    }, 1000);
});

asyncTest("var statement evaluation on the go", 1, function() {
    var codeMirror = mockCodeMirror(
        ["var x = 10;"],
        ["var", "keyword", " ", null, "x", "variable", " = ", null, "10", "number", ";", undefined]);

    evaluationOptions.evaluateVar = true;

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre><span class='cm-keyword'>var</span> <span class='cm-variable'>x</span> = <span class='cm-number'>10</span>;</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; 10</span>");
        start();
    }, 1000);
});

asyncTest("evaluate array", 1, function() {
    var codeMirror = mockCodeMirror(
        ["[1,2,3];"],
        ["[", undefined, "1", "number", ",", undefined, "2", "number", ",", undefined, "3", "number", "];", undefined]);

    doEvaluate(codeMirror, outputSpy);

    setTimeout(function() {
        log(outputSpy.html());
        strictEqual(outputSpy.html(), "<pre>[<span class='cm-number'>1</span>,<span class='cm-number'>2</span>,<span class='cm-number'>3</span>];</pre>&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; [1,2,3]</span>");
        start();
    }, 1000);
});



function log(html) {
    $("#output").html(html);
}
