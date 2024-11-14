XLIFF Translator Tool

A desktop application built with Electron that translates XLIFF files into multiple languages using OpenAI's GPT model. The tool supports customizable languages, retains the original XML structure, and can handle complex, nested tags within <source> elements.
Features

    Translates content within <source> elements to <target> in specified languages.
    Retains the original XML structure, ensuring compatibility with translation workflows.
    Supports multiple languages, including French, Spanish, German, and more.
    Easy toggling of debug logging for troubleshooting.

Prerequisites

    Node.js and npm
    An OpenAI API key (API access required)
        For information on setting up an OpenAI API key, visit OpenAI's API Key Guide
    Electron

Setup
Step 1: Clone the Repository

git clone https://github.com/your-username/xliff-translator-tool.git
cd xliff-translator-tool

Step 2: Install Dependencies

npm install

Step 3: Configure Environment Variables

Create a .env file in the root directory and add your OpenAI API key:

OPENAI_API_KEY=your_openai_api_key_here

    For details on generating an API key, refer to OpenAI's API Key Guide.

Step 4: Run the Application

To start the Electron app:

npm start

Usage

    Select an XLIFF File: Click on the “Choose XLIFF File” button to load your .xliff or .xlf file.
    Choose Target Language: Select a language from the dropdown list.
    Translate: Click the “Translate” button to start the translation process.
    View Translation Status: The tool will notify you upon successful completion and provide the path to the translated file.

The translated file will have the target language code appended to the original filename, e.g., filename-fr.xlf.
Configuration
1. Enable or Disable Debug Logging

To control logging, uncomment this

    /**
     * win.webContents.openDevTools();
     */

2. Add More Languages

To add more languages, update the dropdown in index.html:

<select id="languageSelect">
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
    <option value="pt">Portuguese</option>
    <!-- Add more languages as needed -->
</select>

3. Modify API Request Parameters

Adjust model versions or add retry limits in main.js:

model: "gpt-3.5-turbo"  // Change to "gpt-4" if available

Troubleshooting

    Rate Limit Errors: The tool uses exponential backoff to handle rate limits, but you may need to adjust the delay if requests are frequently throttled.
    Missing Translations: The application attempts to capture nested text within <source> tags. If issues persist, verify the structure of your XLIFF file.
    Console Logging: If debugging is required, enable logging by setting debug = true in main.js.

Contributing

    Fork the repository.
    Create a new branch: git checkout -b feature-branch.
    Make your changes and test thoroughly.
    Push to your branch: git push origin feature-branch.
    Submit a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for more details.