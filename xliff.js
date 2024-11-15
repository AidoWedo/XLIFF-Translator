document.getElementById('selectXliffFile').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectXliffFile();
    if (!filePath) return;

    const response = await fetch(filePath);
    const xliffContent = await response.text();
    const language = document.getElementById('xliffLanguageSelect').value;

    const xliffDoc = new DOMParser().parseFromString(xliffContent, 'application/xml');
    const transUnits = xliffDoc.querySelectorAll('trans-unit');

    for (const unit of transUnits) {
        const sourceText = unit.querySelector('source').textContent;
        const translation = await translateText(sourceText, language);

        if (!unit.querySelector('target')) {
            const targetElement = xliffDoc.createElement('target');
            unit.appendChild(targetElement);
        }
        unit.querySelector('target').textContent = translation;
    }

    const serialized = new XMLSerializer().serializeToString(xliffDoc);
    downloadFile(serialized, `translated-${filePath}`);
});

async function translateText(text, targetLang) {
    const apiKey = localStorage.getItem('apiKey');
    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ prompt: `Translate: ${text} to ${targetLang}`, max_tokens: 1000 }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
