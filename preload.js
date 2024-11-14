const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: () => ipcRenderer.invoke('select-file'),
    readFileContent: (filePath) => ipcRenderer.invoke('read-file', filePath),
    translate: (xmlContent, language, filePath) => ipcRenderer.invoke('translate', xmlContent, language, filePath)
});




