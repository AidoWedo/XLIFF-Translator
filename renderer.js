document.getElementById('selectFile').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectFile();
    document.getElementById('filePath').innerText = filePath || 'No file selected';
});

async function parseXliffFile(filePath) {
    try {
        return await window.electronAPI.readFileContent(filePath);
    } catch (error) {
        console.error("Error reading the XLIFF file:", error);
    }
}

document.getElementById('translateButton').addEventListener('click', async () => {
    const language = document.getElementById('languageSelect').value;
    const filePath = document.getElementById('filePath').innerText;

    if (!filePath || filePath === 'No file selected') {
        console.error("No file selected.");
        return;
    }

    const xmlContent = await parseXliffFile(filePath);
    if (!xmlContent) {
        console.error("Failed to read or parse file content.");
        return;
    }

    try {
        const newFilePath = await window.electronAPI.translate(xmlContent, language, filePath);
        console.log("Translation completed and saved to:", newFilePath);
        document.getElementById('status').innerText = `Translation completed! File saved to: ${newFilePath}`;
    } catch (error) {
        console.error("Translation error:", error);
        document.getElementById('status').innerText = "Translation failed.";
    }
});

