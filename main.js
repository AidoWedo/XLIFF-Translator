const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs').promises;

let mainWindow;

app.on('ready', () => {
    console.log("App is ready.");
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: __dirname + '/preload.js',
            contextIsolation: true,
        },
    });

    mainWindow.loadFile('index.html');
    console.log("Main window loaded.");
});

ipcMain.handle('select-xliff-file', async () => {
    console.log("select-xliff-file IPC triggered.");
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'XLIFF Files', extensions: ['xlf', 'xliff'] }],
    });
    console.log("File selection result for XLIFF:", result);
    return result.canceled ? null : result.filePaths[0]; // Return the selected file path or null if canceled
});

ipcMain.handle('select-caption-file', async () => {
    console.log("select-caption-file IPC triggered.");
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Caption Files', extensions: ['vtt', 'srt'] }],
    });
    console.log("File selection result for Captions:", result);
    return result.canceled ? null : result.filePaths[0]; // Return the selected file path or null if canceled
});

ipcMain.handle('read-file', async (event, filePath) => {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
});

ipcMain.handle('select-api-key-file', async () => {
    console.log("select-api-key-file IPC triggered.");
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'API Key Files', extensions: ['env', 'txt'] }],
    });
    return result.canceled ? null : result.filePaths[0];
});
