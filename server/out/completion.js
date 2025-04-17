"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
class WingCompletion {
    static run(_textDocumentPosition, textDocument, results) {
        let position = _textDocumentPosition.position;
        let currentLine = textDocument.getText().replace(/\r\n/g, "\n").split("\n")[position.line].trim();
        console.log(currentLine);
        let keywords = ["function", "if", "do", "end"];
        let builtin = ["include", "require", "strict", "?!", "??", "?"];
        let replacements = [
            {
                labels: ["dep", "deprecation", "deprecated", "old"],
                code: "?!Deprecated"
            },
            {
                labels: ["err", "error", "fatal", "critical"],
                code: "??Error"
            },
            {
                labels: ["warn", "warning", "alert", "notice"],
                code: "?Warning"
            },
            {
                labels: [".func", ".fun", ".fn", ".function"],
                code: "function name\n    -- Your code here\nend"
            },
            {
                labels: [".if", "cond", "condition"],
                code: "if condition do\n    -- Your code here\nend"
            },
            {
                labels: [".ifelse", "condelse", "conditionelse"],
                code: "if condition do\n    -- Your code here\nelse\n    -- Your code here\nend"
            }
        ];
        let replacementsList = [];
        for (let replacement of replacements) {
            for (let label of replacement.labels) {
                replacementsList.push({
                    label,
                    kind: node_1.CompletionItemKind.Snippet,
                    data: "replacement",
                    insertText: replacement.code
                });
            }
        }
        return [
            ...keywords.filter(() => currentLine.trim() === "" || currentLine.startsWith("if ") || currentLine.startsWith("else ") || !currentLine.match(/^(.+) /gm)).map((i) => {
                return {
                    label: i,
                    kind: node_1.CompletionItemKind.Keyword,
                    data: "keyword",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                };
            }),
            ...results['functions'].filter(() => !currentLine.match(/^([a-zA-Z0-9-_]+) /gm) && !currentLine.startsWith("function ")).map((i) => {
                return {
                    label: i,
                    kind: node_1.CompletionItemKind.Function,
                    data: "function",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                };
            }),
            ...results['variables'].filter(() => !currentLine.startsWith("function ")).map((i) => {
                return {
                    label: "$" + i,
                    kind: node_1.CompletionItemKind.Variable,
                    data: "variable",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                };
            }),
            ...results['constants'].filter(() => !currentLine.startsWith("function ")).map((i) => {
                return {
                    label: "$" + i,
                    kind: node_1.CompletionItemKind.Constant,
                    data: "constant",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                };
            }),
            ...results['operations'].filter(() => !!currentLine.match(/^\$([a-zA-Z0-9-_]+)( +|)</gm)).map((i) => {
                return {
                    label: i,
                    kind: node_1.CompletionItemKind.Operator,
                    data: "operator",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                };
            }),
            ...results['conditions'].filter(() => currentLine.startsWith("if ") || currentLine.startsWith("else if ")).map((i) => {
                return {
                    label: i,
                    kind: node_1.CompletionItemKind.Event,
                    data: "condition",
                    commitCharacters: [" ", "$"]
                };
            }),
            ...builtin.filter(() => currentLine.trim() === "" || !currentLine.match(/^(.+) /gm)).map((i) => {
                return {
                    label: i,
                    kind: node_1.CompletionItemKind.Method,
                    data: "built-in",
                    insertText: (i === "include" || i === "require" ? "#" : "") + i,
                    commitCharacters: [" ", "$"]
                };
            }),
            ...replacementsList.filter(i => currentLine.trim() === "")
        ];
    }
    static detail(item) {
        item.detail = item.documentation = item.data;
        return item;
    }
}
exports.default = WingCompletion;
//# sourceMappingURL=completion.js.map