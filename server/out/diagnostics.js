"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_1 = require("vscode-languageserver");
class WingDiagnostics {
    static run(textDocument, version, results) {
        try {
            const text = textDocument.getText();
            let diagnostics = [];
            let pos = -1;
            let linesPositions = text.replace(/\r\n/gm, "\n").split("\n").map(i => {
                let start = pos + 1;
                let end = pos + i.length + 1;
                pos = end;
                return [
                    start,
                    end
                ];
            });
            let problems = 0;
            for (let problem of results.problems) {
                problems++;
                let severity = node_1.DiagnosticSeverity.Hint;
                switch (problem.type) {
                    case "warning":
                        severity = node_1.DiagnosticSeverity.Warning;
                        break;
                    case "error":
                        severity = node_1.DiagnosticSeverity.Error;
                        break;
                    case "deprecation":
                        severity = node_1.DiagnosticSeverity.Information;
                        break;
                }
                const diagnostic = {
                    severity,
                    range: {
                        start: textDocument.positionAt(linesPositions[problem.line - 1][0]),
                        end: textDocument.positionAt(linesPositions[problem.line - 1][1])
                    },
                    message: problem.message,
                    source: 'wing-' + version + " "
                };
                if (problem.type === "deprecation") {
                    diagnostic.tags = [vscode_languageserver_1.DiagnosticTag.Deprecated];
                }
                diagnostic.code = problem.code ?? null;
                diagnostic.relatedInformation = [
                    {
                        location: {
                            uri: problem.source.uri === "_self" ? textDocument.uri : "file://" + problem.source.uri,
                            range: {
                                start: textDocument.positionAt(linesPositions[problem.source.line - 1][0]),
                                end: textDocument.positionAt(linesPositions[problem.source.line - 1][1])
                            }
                        },
                        message: problem.source.name
                    }
                ];
                diagnostics.push(diagnostic);
            }
            const pattern = /\b[A-Z]{2,}\b/g;
            let m;
            return diagnostics;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
}
exports.default = WingDiagnostics;
//# sourceMappingURL=diagnostics.js.map