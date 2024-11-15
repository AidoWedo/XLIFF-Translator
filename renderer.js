document.addEventListener('DOMContentLoaded', () => {
    console.log("Renderer.js loaded. Setting up handlers...");

    // Menu switching functionality
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log("Menu item clicked:", item.dataset.section);

            // Remove active class from all menu items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Add active class to clicked item and its corresponding section
            item.classList.add('active');
            const targetSection = document.getElementById(item.dataset.section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Get references to DOM elements
    const xliffFilePathElement = document.querySelector('#xliff .file-path');
    const captionFilePathElement = document.querySelector('#captions .file-path');
    const statusElements = document.querySelectorAll('.status');

    // Helper function to derive file name with language code
    function getFileNameWithLanguage(originalFilePath, language) {
        const fileExtension = originalFilePath.split('.').pop();
        const baseName = originalFilePath.substring(0, originalFilePath.lastIndexOf('.'));
        return `${baseName}-${language}.${fileExtension}`;
    }

    // Helper function to update status
    function updateStatus(section, message) {
        const statusElement = section.querySelector('.status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    // XLIFF File Selection
    document.getElementById('selectXliffFile').addEventListener('click', async () => {
        console.log("Select XLIFF File button clicked.");
        try {
            const filePath = await window.electronAPI.selectXliffFile();
            if (filePath) {
                console.log(`XLIFF File selected: ${filePath}`);
                xliffFilePathElement.textContent = filePath;
            } else {
                console.warn("No file selected for XLIFF.");
                xliffFilePathElement.textContent = "No file selected";
            }
        } catch (error) {
            console.error("Error selecting XLIFF file:", error);
            xliffFilePathElement.textContent = "Error selecting file";
        }
    });

    // Caption File Selection
    document.getElementById('selectCaptionFile').addEventListener('click', async () => {
        console.log("Select Caption File button clicked.");
        try {
            const filePath = await window.electronAPI.selectCaptionFile();
            if (filePath) {
                console.log(`Caption File selected: ${filePath}`);
                captionFilePathElement.textContent = filePath;
            } else {
                console.warn("No file selected for Captions.");
                captionFilePathElement.textContent = "No file selected";
            }
        } catch (error) {
            console.error("Error selecting Caption file:", error);
            captionFilePathElement.textContent = "Error selecting file";
        }
    });

    // Save API Key
    document.getElementById('saveApiKey').addEventListener('click', () => {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert("Please enter a valid API key.");
            return;
        }
        localStorage.setItem('apiKey', apiKey);
        alert("API Key saved successfully.");
        console.log("API Key saved.");
    });

    // Select API Key File
    document.getElementById('apiKeyFile').addEventListener('click', async () => {
        console.log("Select API Key File button clicked.");
        try {
            const filePath = await window.electronAPI.selectApiKeyFile();
            if (filePath) {
                console.log(`API Key File selected: ${filePath}`);
                const apiKey = await window.electronAPI.readFile(filePath);
                document.getElementById('apiKeyInput').value = apiKey.trim();
                localStorage.setItem('apiKey', apiKey.trim());
                alert("API Key loaded and saved successfully.");
            } else {
                console.warn("No API Key file selected.");
            }
        } catch (error) {
            console.error("Error selecting API Key file:", error);
            alert("An error occurred while selecting the API Key file.");
        }
    });

    // XLIFF Translation
    document.getElementById('translateXliff').addEventListener('click', async () => {
        console.log("Translate XLIFF button clicked.");
        const filePath = xliffFilePathElement.textContent;
        const language = document.getElementById('xliffLanguageSelect').value;

        if (!filePath || filePath === "No file selected") {
            alert("Please select an XLIFF file before translating.");
            return;
        }

        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
            alert("Please configure your API key in the Settings tab.");
            return;
        }

        try {
            updateStatus(document.getElementById('xliff'), "Translating...");
            const fileContent = await window.electronAPI.readFile(filePath);
            const translatedContent = await translateText(fileContent, language, apiKey);
            const outputFileName = getFileNameWithLanguage(filePath, language);
            saveToFile(translatedContent, outputFileName);
            updateStatus(document.getElementById('xliff'), `Translation complete. Saved as ${outputFileName}`);
        } catch (error) {
            console.error("Error translating XLIFF:", error);
            updateStatus(document.getElementById('xliff'), "Error during translation");
            alert("An error occurred during translation. Check the console for details.");
        }
    });

    // Caption Translation
    document.getElementById('translateCaptions').addEventListener('click', async () => {
        console.log("Translate Captions button clicked.");
        const filePath = captionFilePathElement.textContent;
        const language = document.getElementById('captionLanguageSelect').value;

        if (!filePath || filePath === "No file selected") {
            alert("Please select a Caption file before translating.");
            return;
        }

        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) {
            alert("Please configure your API key in the Settings tab.");
            return;
        }

        try {
            updateStatus(document.getElementById('captions'), "Translating...");
            const fileContent = await window.electronAPI.readFile(filePath);
            const translatedContent = await translateText(fileContent, language, apiKey);
            const outputFileName = getFileNameWithLanguage(filePath, language);
            saveToFile(translatedContent, outputFileName);
            updateStatus(document.getElementById('captions'), `Translation complete. Saved as ${outputFileName}`);
        } catch (error) {
            console.error("Error translating Caption file:", error);
            updateStatus(document.getElementById('captions'), "Error during translation");
            alert("An error occurred during translation. Check the console for details.");
        }
    });

    // Helper: Save content to file
    function saveToFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Helper: Translate via OpenAI API
    async function translateText(content, language, apiKey) {
        console.log("Sending content to OpenAI for translation...");
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: "system",
                        content: `You are a professional translator. Translate all text into ${language}.`,
                    },
                    {
                        role: "user",
                        content: content,
                    },
                ],
                max_tokens: 3000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI API Error:", error);
            throw new Error(`OpenAI API error: ${error.error.message}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error("Translation failed. No valid response from OpenAI API.");
        }
        return data.choices[0].message.content.trim();
    }
});
