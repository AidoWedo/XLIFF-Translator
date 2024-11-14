const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const axios = require('axios');
const { parseStringPromise, Builder } = require('xml2js');

// Load environment variables from .env
dotenv.config();

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        }
    });

    win.loadFile('index.html');
    /**
     * win.webContents.openDevTools();
     */
}

app.on('ready', createWindow);

// Handle file selection
ipcMain.handle('select-file', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'XLIFF Files', extensions: ['xliff', 'xlf'] }]
    });
    return result.filePaths[0];
});

// Handle reading the file content
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
});

// Helper function to add delay (throttle requests)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Refined function to extract only text content, ignoring attributes and metadata
function extractTextContent(element) {
    if (typeof element === 'string') {
        return element;
    }
    if (Array.isArray(element)) {
        return element.map(extractTextContent).join(' ');
    }
    // Recursively extract text from nested elements, ignoring attributes
    let text = '';
    for (const [key, value] of Object.entries(element)) {
        if (key === '_') {
            text += value; // Capture direct text nodes
        } else if (key === '$') {
            continue; // Skip attributes (usually stored in $ in xml2js)
        } else {
            text += extractTextContent(value); // Recursively process nested elements
        }
    }
    return text;
}

// Retry logic in case of API errors (rate limits, timeouts)
async function translateTextWithRetry(text, language, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",  // Use "gpt-4" if you have access
                    messages: [
                        { role: "system", content: "You are a translation assistant." },
                        { role: "user", content: `Translate the following text to ${language}:\n\n${text}` }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error(`Translation error on attempt ${attempt + 1}:`, error.message);
            if (attempt === retries - 1) throw new Error("Failed after maximum retries");
            await delay(2000 * (attempt + 1));  // Exponential backoff
        }
    }
}

ipcMain.handle('translate', async (event, xmlContent, language, filePath) => {
    try {
        const xmlData = await parseStringPromise(xmlContent);
        const translatePromises = [];

        // Iterate over each <file> and <trans-unit> element
        for (const file of xmlData.xliff.file) {
            for (const unit of file.body[0]['trans-unit']) {
                // Extract only the text content from <source>
                const originalText = extractTextContent(unit.source?.[0]);

                if (originalText && originalText.trim()) {
                    const translationPromise = delay(1000).then(() =>
                        translateTextWithRetry(originalText, language).then(translatedText => {
                            unit.target = [translatedText];
                        }).catch(error => {
                            console.error("Translation failed after retries:", error.message);
                            unit.target = ["[Translation failed]"];
                        })
                    );

                    translatePromises.push(translationPromise);
                } else {
                    unit.target = ["[No content to translate]"];
                }
            }
        }

        await Promise.all(translatePromises);

        const builder = new Builder();
        const translatedXml = builder.buildObject(xmlData);

        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);
        const dir = path.dirname(filePath);
        const newFilePath = path.join(dir, `${baseName}-${language}${ext}`);

        await fs.writeFile(newFilePath, translatedXml, 'utf-8');

        console.log(`Translation saved to file: ${newFilePath}`);
        return newFilePath;
    } catch (error) {
        console.error("Final translation error:", error.message);
        throw new Error(`OpenAI API returned an error: ${error.message}`);
    }
});



