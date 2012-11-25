var _console = console;
var _alert = alert;

function doEvaluate(cm, $output, options) {
    var totalLines = cm.lineCount(),
        lastLineNum = totalLines - 1,
        lineNum,
        line,
        lines = [],
        evaluation = [],
        code,
        evaluationResult,
        linesInProgress = [],
        lineHandle,
        functionDetected = false,
        resetFunctionDetectedVar = false,
        matchingBraces = 0,
        evaluated = false;

    options = options || {evaluateVar:false};

    $output.html("");

    function shouldEvaluateLine() {
        var isLastLine = lineNum === lastLineNum;
        return line.trimLeft() &&
            ((line.endsWith(";") || line.endsWith("}")) || isLastLine);
    }

    setTimeout(function () {
        for (lineNum = 0; lineNum < totalLines; lineNum++) {
            lineHandle = cm.getLineHandle(lineNum);
            line = cm.getLine(lineNum).trimRight();

            if (resetFunctionDetectedVar) {
                functionDetected = false;
                resetFunctionDetectedVar = false;
            }
            functionDetected = functionDetected || line.trimLeft().startsWith("function");
            if (functionDetected) {
                matchingBraces += ( line.count("{") - line.count("}") );
                if (matchingBraces === 0) {
                    resetFunctionDetectedVar = true;
                }
            }

            lines.push(line);

            linesInProgress.push(buildLineWithCodeMirrorStyles(lineHandle));
            if (shouldEvaluateLine()) {
                evaluated = false;
                evaluationResult = undefined;
                code = lines.join("\n");
                try {
                    if (line.trimLeft().indexOf("var") !== 0) {
                        evaluationResult = evaluateCode(code);

                        if (functionDetected && matchingBraces === 0) {
                            evaluationResult = undefined;
                        }

                    } else {
                        if (options.evaluateVar) {
                            // check if code is valid, i.e. can be evaluated
                            evaluateCode(code);
                            // code is valid, try to get the var value
                            code += ("\n" + line.trimLeft().replace(/^var\s+/, ""));
                            evaluationResult = evaluateCode(code);
                        }
                    }

                    evaluated = true;
                } catch (e) {
                    // ignore errors during the evaluation
                }

                if (evaluated) {
                    evaluationResult = stringify(evaluationResult);

                    evaluation.push(colorizeEvaluationResult(linesInProgress, evaluationResult));
                    linesInProgress = [];
                }
            }
        }

        $output.html(evaluation.join("<br/>"));

        alert = _alert;
        console = _console;

        try {
            evaluateCode(lines.join("\n"), true);
        } catch (e) {
            addErrorToOutput(e, $output);
        }
    }, $output.html().length ? 1000 : 0);
}

function evaluateCode(code, console_alert_support) {
    var alert = function () {};
    var console = {
        log:function () {
        }
    };
    return (function (console, alert) {
        return eval(code);
    }).call(undefined, console_alert_support ? _console : console, console_alert_support ? _alert : alert);
}

function colorizeEvaluationResult(linesInProgress, evaluationResult) {
    return linesInProgress.join("<br/>") + "&nbsp;&nbsp;&nbsp;<span class='evaluation'>&gt;&gt;&gt; " + evaluationResult + "</span>";
}

function addErrorToOutput(error, $output) {
    $output.html($output.html() + "<br/><br/>" + colorizeError(error));
}

function colorizeError(error) {
    return "<span class='error'>========== Error ==========</span><br/><span class='error'>" + error + "</span>";
}

function buildLineWithCodeMirrorStyles(lineHandle) {
    var styles = lineHandle.styles,
        text,
        style,
        i,
        styledLines = [];
    for (i = 0; i < styles.length; i += 2) {
        text = styles[i];
        style = styles[i + 1];
        if (style) {
            styledLines.push("<span class='cm-" + style + "'>" + text + "</span>");
        } else {
            styledLines.push(text);
        }
    }
    return "<pre>" + styledLines.join("") + "</pre>";
}

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