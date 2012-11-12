var _console = console;
var _alert = alert;

var evaluationOptions = {
    evaluateVar:false,
    evaluateOnSemicolon:false
};

function doEvaluate(cm, $output) {
    var totalLines = cm.lineCount(),
        i,
        line,
        lines = [],
        evaluation = [],
        code,
        evaluationResult,
        linesInProgress = [],
        lineHandle,
        functionDetected = false,
        resetFunctionDetected = false,
        matchingBraces = 0;

    $output.html("");

    setTimeout(function () {
        for (i = 0; i < totalLines; i++) {
            lineHandle = cm.getLineHandle(i);
            line = cm.getLine(i).trimRight();

            if (resetFunctionDetected) {
                functionDetected = false;
                resetFunctionDetected = false;
            }
            functionDetected = functionDetected || line.toLowerCase().indexOf("function") !== -1;
            if (functionDetected) {
                matchingBraces += ( (line.split("{").length - 1) - (line.split("}").length - 1) );
                if (matchingBraces === 0) {
                    resetFunctionDetected = true;
                }
            }

            lines.push(line);

            linesInProgress.push(buildLineWithCodeMirrorStyles(lineHandle));
            if (line.trimLeft() && ( (line.length && (line[line.length - 1] === ";" || line[line.length - 1] === "}")) || i === totalLines - 1)) {

                evaluationResult = undefined;
                code = lines.join("\n");
                if (line.trimLeft().indexOf("var") !== 0) {
                    try {
                        evaluationResult = evaluateCode(code);
                        if (evaluationResult && isArray(evaluationResult)) {
                            evaluationResult = "[" + evaluationResult + "]";
                        }
                        if (functionDetected && matchingBraces === 0) {
                            evaluationResult = undefined;
                        }
                        evaluation.push(colorizeEvaluationResult(linesInProgress, evaluationResult));
                        linesInProgress = [];
                    } catch (e) {
                        // ignore errors during the evaluation
                    }
                } else {
                    if (evaluationOptions.evaluateVar) {
                        try {
                            // check if code is valid, i.e. can be evaluated
                            evaluateCode(code);
                            // code is valid, try to get the var value
                            code += ("\n" + line.trimLeft().replace(/^var\s+/, ""));
                            evaluationResult = evaluateCode(code);
                        } catch (e) {
                            // ignore errors during the evaluation
                        }
                    }

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

function isArray(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === "Array";
}

String.prototype.trimRight = String.prototype.trimRight || function () {
    return this.replace(/\s+$/g, "");
};

String.prototype.trimLeft = String.prototype.trimLeft || function () {
    return this.replace(/^\s+/g, "");
};