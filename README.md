Translation Tools Application

This is a desktop application built using Electron.js that provides translation tools for XLIFF files and Caption files (SRT, WebVTT). It integrates with the OpenAI API for translation and supports multiple languages. The application also includes a settings section to manage API keys for seamless translation.
Features

    XLIFF Translator:
        Translate .xlf or .xliff files into a variety of supported languages.
        Automatically saves translated files with a language code appended to the file name.

    Caption Translator:
        Supports .srt and .vtt caption files for translation.
        Saves translated captions with the same naming convention as XLIFF files.

    API Key Management:
        Allows users to input their OpenAI API key manually or select a .env or .txt file containing the key.
        Stores the API key securely for use during translations.

    User-Friendly Interface:
        Side menu for easy navigation between XLIFF Translator, Caption Translator, and Settings.
        Responsive design and intuitive workflows.

    Language Support:
        Supports multiple languages, including:
            Arabic
            Chinese (Simplified and Traditional)
            Dutch
            English
            French
            German
            Hindi
            Italian
            Japanese
            Korean
            Portuguese
            Russian
            Spanish
            Thai
            Vietnamese

Installation

    Clone the Repository:

git clone https://github.com/your-repo/translation-tools.git
cd translation-tools

Install Dependencies: Make sure you have Node.js installed, then run:

npm install

Start the Application:

    npm start

Usage
1. XLIFF Translator:

    Navigate to the "XLIFF Translator" tab.
    Click "Choose XLIFF File" to select a .xlf or .xliff file.
    Select the target language from the dropdown.
    Click "Translate" to generate the translated file.

2. Caption Translator:

    Navigate to the "Caption Translator" tab.
    Click "Choose Caption File" to select a .srt or .vtt file.
    Select the target language from the dropdown.
    Click "Translate Captions" to generate the translated captions file.

3. API Key Configuration:

    Navigate to the "Settings" tab.
    Input your OpenAI API key manually in the text field, or select a .txt or .env file containing the key.
    Click "Save API Key" to store the key securely.

File Naming Convention

Translated files are saved with the original file name followed by the language code. For example:

    Original file: example.xlf
    Translated file: example-fr.xlf (for French)

This convention is applied to both XLIFF and Caption files.
Technologies Used

    Electron.js: For creating the desktop application.
    HTML/CSS/JavaScript: For building the user interface.
    OpenAI API: For translation services.

Supported File Formats

    XLIFF: .xlf, .xliff
    Captions: .srt, .vtt

Known Issues

    Ensure the OpenAI API key is valid; invalid or expired keys will result in translation errors.
    The application assumes the API key file contains only the key without additional text or formatting.

Future Enhancements

    Add support for batch processing of multiple files at once.
    Improve error handling for invalid file formats and API responses.
    Add functionality for customizing file naming conventions.
    Expand language support based on OpenAI's capabilities.

Troubleshooting

    File Not Selected:
        Ensure the file dialog opens properly and select a supported file format.

    API Key Issues:
        Verify the API key in the Settings tab.
        Ensure you have adequate permissions for the OpenAI API.

    Translation Fails:
        Check your OpenAI usage limits.
        Ensure your internet connection is stable.

    Logs:
        Use Developer Tools (Ctrl+Shift+I or Cmd+Option+I) to check for errors or logs.


This project is licensed under the MIT License. See the LICENSE file for details.
