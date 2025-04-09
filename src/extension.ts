import * as vscode from 'vscode';
import { checkPrintsInStagedFiles } from './printChecker'; // Importa la función desde el archivo printChecker

// Esta función se llama cuando la extensión se activa
export function activate(context: vscode.ExtensionContext) {

    // Muestra un mensaje en la consola cuando la extensión es activada
    console.log('Congratulations, your extension "vextension" is now active!');

    // Registrar el comando 'checkprints'
    const disposable = vscode.commands.registerCommand('vextension.checkprints', () => {
        checkPrintsInStagedFiles();  // Llama a la función que verificará los prints en los archivos modificados
    });

    context.subscriptions.push(disposable);
}

// Esta función se llama cuando la extensión se desactiva
export function deactivate() {}
