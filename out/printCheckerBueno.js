"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPrintsInStagedFiles = checkPrintsInStagedFiles;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Función que busca `print` en los archivos modificados en el área de staging y devuelve la línea donde se encuentra
async function checkPrintsInStagedFiles() {
    // Obtener la API de Git
    const git = vscode.extensions.getExtension('vscode.git')?.exports.getAPI(1);
    if (!git) {
        vscode.window.showErrorMessage('Git extension not found!');
        return;
    }
    // Obtener el repositorio actual
    const repo = git.repositories[0];
    if (!repo) {
        vscode.window.showErrorMessage('No Git repository found.');
        return;
    }
    // Obtener los archivos en staging (archivos modificados que están listos para commit)
    const files = repo.state.indexChanges; // Archivos en staging (aún no committeados)
    if (files.length === 0) {
        vscode.window.showInformationMessage('No files in staging to check.');
        return;
    }
    let filesWithPrints = [];
    // Recorremos los archivos modificados en staging
    for (const file of files) {
        const filePath = file.uri.fsPath;
        if (path.extname(filePath) === '.py') { // Solo revisamos archivos .py (Python)
            // Leemos el contenido del archivo línea por línea
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            // Verificamos línea por línea si contiene un `print(`
            lines.forEach((line, index) => {
                if (line.includes('print(')) {
                    // Si encuentra `print`, lo agrega a la lista junto con la línea y el archivo
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
    // Si encontramos archivos con prints, mostramos un QuickPick con las opciones
    if (filesWithPrints.length > 0) {
        const selected = await vscode.window.showQuickPick(filesWithPrints.map(file => ({ label: file.label, description: file.lineContent })), { placeHolder: 'Select a file and line to go to' });
        if (selected) {
            const file = filesWithPrints.find(f => f.label === selected.label);
            if (file) {
                // Abrir el archivo en el editor y desplazarse a la línea donde se encuentra el print
                const document = await vscode.workspace.openTextDocument(file.filePath);
                const editor = await vscode.window.showTextDocument(document);
                const position = new vscode.Position(file.lineNumber - 1, 0);
                editor.revealRange(new vscode.Range(position, position));
                editor.selection = new vscode.Selection(position, position);
            }
        }
    }
    else {
        vscode.window.showInformationMessage('No print statements found in staged files.');
    }
}
//# sourceMappingURL=printCheckerBueno.js.map