const { contextBridge, ipcRenderer } = require('electron');

// Debug: Ensure preload script is loaded
console.log("Preload.js loaded.");

contextBridge.exposeInMainWorld('electronAPI', {
    selectApiKeyFile: () => ipcRenderer.invoke('select-api-key-file'),
    selectXliffFile: () => ipcRenderer.invoke('select-xliff-file'), // Correctly exposed
    selectCaptionFile: () => ipcRenderer.invoke('select-caption-file'), // Correctly exposed
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
});









