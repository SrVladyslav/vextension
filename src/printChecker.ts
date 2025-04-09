import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Función que busca `print` en los archivos modificados
export async function checkPrintsInStagedFiles() {
    // Obtiene la API de Git
    const git = vscode.extensions.getExtension('vscode.git')?.exports.getAPI(1);
    if (!git) {
        vscode.window.showErrorMessage('Git extension not found!');
        return;
    }

    // Obtiene el repositorio actual
    const repo = git.repositories[0];
    if (!repo) {
        vscode.window.showErrorMessage('No Git repository found.');
        return;
    }

    // Obtiene los archivos modificados en el área de staging
    const files = repo.state.indexChanges;
    if (files.length === 0) {
        vscode.window.showInformationMessage('No modified files to check.');
        return;
    }

    let filesWithPrints: string[] = [];

    // Recorre los archivos modificados
    for (const file of files) {
        const filePath = file.uri.fsPath;
        if (path.extname(filePath) === '.py') { // Solo busca en archivos .py (Python)
            // Lee el contenido del archivo
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Verifica si el archivo contiene la palabra 'print('
            if (content.includes('print(')) {
                filesWithPrints.push(filePath);
            }
        }
    }

    // Muestra un mensaje con los archivos que contienen `print`
    if (filesWithPrints.length > 0) {
        vscode.window.showInformationMessage(`Found print statements in the following files:\n${filesWithPrints.join('\n')}`);
    } else {
        vscode.window.showInformationMessage('No print statements found in staged files.');
    }
}
