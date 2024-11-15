document.getElementById('apiKeyFile').addEventListener('click', async () => {
    console.log("Select API Key File button clicked.");
    try {
        const filePath = await window.electronAPI.selectApiKeyFile();
        if (filePath) {
            console.log(`API Key File selected: ${filePath}`);
            const apiKey = await window.electronAPI.readFile(filePath); // Read file content
            document.getElementById('apiKeyInput').value = apiKey.trim(); // Populate input field
            localStorage.setItem('apiKey', apiKey.trim()); // Save to localStorage
            alert("API Key loaded and saved successfully.");
        } else {
            console.warn("No API Key file selected.");
        }
    } catch (error) {
        console.error("Error selecting API Key file:", error);
        alert("An error occurred while selecting the API Key file.");
    }
});

