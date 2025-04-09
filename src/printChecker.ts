import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Function that searches for `print` in modified files in the staging area and returns the line where it's found
export async function checkPrintsInStagedFiles() {
    // Get the Git API
    const git = vscode.extensions.getExtension('vscode.git')?.exports.getAPI(1);
    if (!git) {
        vscode.window.showErrorMessage('Git extension not found!');
        return;
    }

    // Get the current repository
    const repo = git.repositories[0];
    if (!repo) {
        vscode.window.showErrorMessage('No Git repository found.');
        return;
    }

    // Get the staged files (modified files that are ready for commit)
    const files = repo.state.indexChanges; // Staged files (not yet committed)
    if (files.length === 0) {
        vscode.window.showInformationMessage('No files in staging to check.');
        return;
    }

    let filesWithPrints: { label: string, filePath: string, lineNumber: number, lineContent: string }[] = [];

    // Loop through the staged modified files
    for (const file of files) {
        const filePath = file.uri.fsPath;
        if (path.extname(filePath) === '.py') { // Only check .py (Python) files
            // Read the file content line by line
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            // Check each line if it contains `print(`
            lines.forEach((line, index) => {
                if (line.includes('print(')) {
                    // If `print` is found, add it to the list with the line and the file
                    filesWithPrints.push({
                        label: `${filePath}: Line ${index + 1} - ${line.trim()}`,
                        filePath: filePath,
                        lineNumber: index + 1,
                        lineContent: line.trim()
                    });
                }
            });
        }
    }

    // If we found files with prints, show a QuickPick with the options
    if (filesWithPrints.length > 0) {
        const selected = await vscode.window.showQuickPick(
            filesWithPrints.map(file => ({ label: file.label, description: file.lineContent })),
            { placeHolder: 'Select a file and line to go to' }
        );

        if (selected) {
            const file = filesWithPrints.find(f => f.label === selected.label);
            if (file) {
                // Open the file in the editor and scroll to the line where the print is located
                const document = await vscode.workspace.openTextDocument(file.filePath);
                const editor = await vscode.window.showTextDocument(document);

                // Highlight all the lines containing 'print(' in the file
                highlightPrintsInFile(editor, file.filePath);
                
                // Scroll to the specific selected line
                const position = new vscode.Position(file.lineNumber - 1, 0);
                editor.revealRange(new vscode.Range(position, position));
                editor.selection = new vscode.Selection(position, position);
            }
        }
    } else {
        vscode.window.showInformationMessage('No print statements found in staged files.');
    }
}

// Function to highlight all lines containing 'print(' in the file
async function highlightPrintsInFile(editor: vscode.TextEditor, filePath: string) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    const printRanges: vscode.Range[] = [];
    
    // Loop through all the lines and find the ones containing `print(`
    lines.forEach((line, index) => {
        if (line.includes('print(')) {
            const position = new vscode.Position(index, 0);
            const range = new vscode.Range(position, position);
            printRanges.push(range);
        }
    });

    // Create a decoration to highlight all lines containing `print(`
    const decorationType = vscode.window.createTextEditorDecorationType({
        // backgroundColor: 'rgba(249, 173, 5, 0.6)', // Background color to highlight
        backgroundColor: 'rgba(153, 39, 219, 0.3)', // Background color to highlight
        // backgroundColor: 'rgba(255, 0, 0, 0.3)', // Background color to highlight
        isWholeLine: true,
    });

    // Apply the decoration to all lines containing `print(`
    editor.setDecorations(decorationType, printRanges);
}
