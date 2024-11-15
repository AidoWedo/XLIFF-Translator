document.getElementById('selectCaptionFile').addEventListener('click', async () => {
    const filePath = await window.electronAPI.selectCaptionFile();
    if (!filePath) return;

    const response = await fetch(filePath);
    const content = await response.text();
    const language = document.getElementById('captionLanguageSelect').value;

    let segments;
    if (filePath.endsWith('.vtt')) {
        segments = parseVTT(content);
    } else if (filePath.endsWith('.srt')) {
        segments = parseSRT(content);
    } else {
        alert('Unsupported file format. Please upload a .vtt or .srt file.');
        return;
    }

    const translatedSegments = await Promise.all(
        segments.map(segment => translateText(segment, language))
    );

    const translatedContent = filePath.endsWith('.vtt')
        ? generateVTT(translatedSegments)
        : generateSRT(translatedSegments);

    downloadFile(translatedContent, `translated-${filePath}`);
});

function parseVTT(content) {
    return content
        .split('\n\n')
        .filter(block => block.includes('-->'))
        .map(block => block.split('\n')[1]);
}

function parseSRT(content) {
    return content
        .split('\n\n')
        .filter(block => block.includes('-->'))
        .map(block => block.split('\n')[2]);
}

function generateVTT(translatedSegments) {
    return translatedSegments
        .map((segment, index) => `\n\n${index + 1}\n00:00:${index}:00 --> 00:00:${index + 1}:00\n${segment}`)
        .join('');
}

function generateSRT(translatedSegments) {
    return translatedSegments
        .map((segment, index) => `${index + 1}\n00:00:${index}:00 --> 00:00:${index + 1}:00\n${segment}`)
        .join('\n\n');
}

async function translateText(text, targetLang) {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
        alert('API Key not configured!');
        return text;
    }

    const response = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            prompt: `Translate the following to ${targetLang}: ${text}`,
            max_tokens: 1000,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
