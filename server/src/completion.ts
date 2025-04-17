import {
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocuments
} from "vscode-languageserver/node";
import {execFileSync} from "node:child_process";
import {TextDocument} from "vscode-languageserver-textdocument";

export default class WingCompletion {
    public static run(_textDocumentPosition: TextDocumentPositionParams, textDocument: TextDocument, results: any): CompletionItem[] {
        let position = _textDocumentPosition.position;

        let currentLine = textDocument.getText().replace(/\r\n/g, "\n").split("\n")[position.line].trim();

        console.log(currentLine);

        let keywords = ["function", "if", "do", "end"];
        let builtin = ["include", "require", "strict", "?!", "??", "?"];
        let replacements = [
            {
                labels: [ "dep", "deprecation", "deprecated", "old" ],
                code:  "?!Deprecated"
            },
            {
                labels: [ "err", "error", "fatal", "critical" ],
                code:  "??Error"
            },
            {
                labels: [ "warn", "warning", "alert", "notice" ],
                code:  "?Warning"
            },
            {
                labels: [ ".func", ".fun", ".fn", ".function" ],
                code:  "function name\n    -- Your code here\nend"
            },
            {
                labels: [ ".if", "cond", "condition" ],
                code:  "if condition do\n    -- Your code here\nend"
            },
            {
                labels: [ ".ifelse", "condelse", "conditionelse" ],
                code:  "if condition do\n    -- Your code here\nelse\n    -- Your code here\nend"
            }
        ];

        let replacementsList = [];

        for (let replacement of replacements) {
            for (let label of replacement.labels) {
                replacementsList.push({
                    label,
                    kind: CompletionItemKind.Snippet,
                    data: "replacement",
                    insertText: replacement.code
                })
            }
        }

        return [
            ...keywords.filter(() => currentLine.trim() === "" || currentLine.startsWith("if ") || currentLine.startsWith("else ") || !currentLine.match(/^(.+) /gm)).map((i: string) => {
                return {
                    label: i,
                    kind: CompletionItemKind.Keyword,
                    data: "keyword",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                }
            }),
            ...results['functions'].filter(() => !currentLine.match(/^([a-zA-Z0-9-_]+) /gm) && !currentLine.startsWith("function ")).map((i: string) => {
                return {
                    label: i,
                    kind: CompletionItemKind.Function,
                    data: "function",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                }
            }),
            ...results['variables'].filter(() => !currentLine.startsWith("function ")).map((i: string) => {
                return {
                    label: "$" + i,
                    kind: CompletionItemKind.Variable,
                    data: "variable",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                }
            }),
            ...results['constants'].filter(() => !currentLine.startsWith("function ")).map((i: string) => {
                return {
                    label: "$" + i,
                    kind: CompletionItemKind.Constant,
                    data: "constant",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                }
            }),
            ...results['operations'].filter(() => !!currentLine.match(/^\$([a-zA-Z0-9-_]+)( +|)</gm)).map((i: string) => {
                return {
                    label: i,
                    kind: CompletionItemKind.Operator,
                    data: "operator",
                    insertText: i,
                    commitCharacters: [" ", "$"]
                }
            }),
            ...results['conditions'].filter(() => currentLine.startsWith("if ") || currentLine.startsWith("else if ")).map((i: string) => {
                return {
                    label: i,
                    kind: CompletionItemKind.Event,
                    data: "condition",
                    commitCharacters: [" ", "$"]
                }
            }),
            ...builtin.filter(() => currentLine.trim() === "" || !currentLine.match(/^(.+) /gm)).map((i: string) => {
                return {
                    label: i,
                    kind: CompletionItemKind.Method,
                    data: "built-in",
                    insertText: (i === "include" || i === "require" ? "#" : "") + i,
                    commitCharacters: [" ", "$"]
                }
            }),
            ...replacementsList.filter(i => currentLine.trim() === "")
        ];
    }

    public static detail(item: CompletionItem) {
        item.detail = item.documentation = item.data;
        return item;
    }
}