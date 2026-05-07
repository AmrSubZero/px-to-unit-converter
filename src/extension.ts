import * as vscode from 'vscode';

function formatNumber(value: number): string {
    return parseFloat(value.toFixed(4)).toString();
}

function getIndentation(lineText: string): string {
    const match = lineText.match(/^(\s*)/);
    return match ? match[1] : '';
}

function convertValue(
    px: number,
    mode: string,
    baseSize: number
): string {

    switch (mode) {

        case 'em':
            return `${formatNumber(px / baseSize)}em`;

        case '%':
            return `${formatNumber((px / baseSize) * 100)}%`;

        case 'rem':
        default:
            return `${formatNumber(px / baseSize)}rem`;
    }
}

export function activate(context: vscode.ExtensionContext) {

    const convertSelectionCommand = vscode.commands.registerCommand(
        'extension.pxToUnit',
        async () => {

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return;
            }

            const config = vscode.workspace.getConfiguration('pxToUnit');

            const baseSize = config.get<number>('baseSize', 16);
            const targetUnit = config.get<string>('targetUnit', 'rem');
            const createComment = config.get<boolean>('createComment', true);
            const formatDocument = config.get<boolean>('autoFormat', true);

            const document = editor.document;

            const edits: {
                range: vscode.Range;
                replacement: string;
            }[] = [];

            const commentInsertions: {
                position: vscode.Position;
                text: string;
            }[] = [];

            for (const selection of editor.selections) {

                const selectedText = document.getText(selection).trim();

                const match = selectedText.match(/^(\d+(?:\.\d+)?)px$/);

                if (!match) {
                    continue;
                }

                const px = parseFloat(match[1]);

                const converted = convertValue(
                    px,
                    targetUnit,
                    baseSize
                );

                edits.push({
                    range: selection,
                    replacement: converted
                });

                if (createComment) {

                    const line = document.lineAt(selection.start.line);

                    const indentation = getIndentation(line.text);

                    const comment = `${indentation}/* ${px}px = ${converted} */\n`;

                    commentInsertions.push({
                        position: new vscode.Position(
                            selection.start.line,
                            0
                        ),
                        text: comment
                    });
                }
            }

            if (
                edits.length === 0 &&
                commentInsertions.length === 0
            ) {
                vscode.window.showInformationMessage(
                    'No valid px values selected.'
                );
                return;
            }

            await editor.edit(editBuilder => {

                for (const insertion of commentInsertions.reverse()) {
                    editBuilder.insert(
                        insertion.position,
                        insertion.text
                    );
                }

                for (const edit of edits) {
                    editBuilder.replace(
                        edit.range,
                        edit.replacement
                    );
                }
            });

            if (formatDocument) {
                await vscode.commands.executeCommand(
                    'editor.action.formatDocument'
                );
            }
        }
    );

    const convertEntireFileCommand = vscode.commands.registerCommand(
        'extension.convertEntireFile',
        async () => {

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                return;
            }

            const config = vscode.workspace.getConfiguration('pxToUnit');

            const baseSize = config.get<number>('baseSize', 16);
            const targetUnit = config.get<string>('targetUnit', 'rem');
            const createComment = config.get<boolean>('createComment', true);
            const formatDocument = config.get<boolean>('autoFormat', true);

            const document = editor.document;

            const fullText = document.getText();

            const regex = /(\d+(?:\.\d+)?)px/g;

            const linesToComment = new Set<number>();

            const replacements: {
                range: vscode.Range;
                replacement: string;
            }[] = [];

            let match;

            while ((match = regex.exec(fullText)) !== null) {

                const px = parseFloat(match[1]);

                const converted = convertValue(
                    px,
                    targetUnit,
                    baseSize
                );

                const startPos = document.positionAt(match.index);

                const endPos = document.positionAt(
                    match.index + match[0].length
                );

                replacements.push({
                    range: new vscode.Range(startPos, endPos),
                    replacement: converted
                });

                if (createComment) {
                    linesToComment.add(startPos.line);
                }
            }

            await editor.edit(editBuilder => {

                for (const replacement of replacements.reverse()) {
                    editBuilder.replace(
                        replacement.range,
                        replacement.replacement
                    );
                }

                if (createComment) {

                    const sortedLines = Array.from(linesToComment)
                        .sort((a, b) => b - a);

                    for (const lineNumber of sortedLines) {

                        const line = document.lineAt(lineNumber);

                        const indentation = getIndentation(line.text);

                        const lineText = line.text.trim();

                        const regexMatch = lineText.match(
                            /(\d+(?:\.\d+)?)px/
                        );

                        if (!regexMatch) {
                            continue;
                        }

                        const px = parseFloat(regexMatch[1]);

                        const converted = convertValue(
                            px,
                            targetUnit,
                            baseSize
                        );

                        editBuilder.insert(
                            new vscode.Position(lineNumber, 0),
                            `${indentation}/* ${px}px = ${converted} */\n`
                        );
                    }
                }
            });

            if (formatDocument) {
                await vscode.commands.executeCommand(
                    'editor.action.formatDocument'
                );
            }

            vscode.window.showInformationMessage(
                'Entire file converted successfully.'
            );
        }
    );

    context.subscriptions.push(
        convertSelectionCommand,
        convertEntireFileCommand
    );
}

export function deactivate() {}