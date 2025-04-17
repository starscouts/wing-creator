import {Diagnostic, DiagnosticSeverity} from "vscode-languageserver/node";
import {TextDocument} from "vscode-languageserver-textdocument";
import {execFileSync} from "node:child_process";
import {CodeDescription, DiagnosticRelatedInformation, DiagnosticTag} from "vscode-languageserver";

export default class WingDiagnostics {
    public static run(textDocument: TextDocument, version: string, results: any) {
        try {
            const text = textDocument.getText();
            let diagnostics: Diagnostic[] = [];

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

                let severity: any = DiagnosticSeverity.Hint;

                switch (problem.type) {
                    case "warning":
                        severity = DiagnosticSeverity.Warning;
                        break;

                    case "error":
                        severity = DiagnosticSeverity.Error;
                        break;

                    case "deprecation":
                        severity = DiagnosticSeverity.Information;
                        break;
                }

                const diagnostic: Diagnostic = {
                    severity,
                    range: {
                        start: textDocument.positionAt(linesPositions[problem.line - 1][0]),
                        end: textDocument.positionAt(linesPositions[problem.line - 1][1])
                    },
                    message: problem.message,
                    source: 'wing-' + version + " "
                }

                if (problem.type === "deprecation") {
                    diagnostic.tags = [ DiagnosticTag.Deprecated ];
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
            let m: RegExpExecArray | null;

            return diagnostics;
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}