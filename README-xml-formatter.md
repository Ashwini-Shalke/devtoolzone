# XML Formatter Tool

XML Formatter is a browser-based tool for formatting, validating, and visualizing XML documents. It provides a user-friendly interface with syntax highlighting and structure analysis.

## Features

- **Formatting Options**: Format with customizable indentation and other preferences
- **Minification**: Compress XML by removing unnecessary whitespace
- **XML Validation**: Automatically validate XML structure and display errors
- **Syntax Highlighting**: Color-coded syntax highlighting for better readability
- **Structure Visualization**: Tree view of XML structure
- **Element Analysis**: Count and list all XML elements and attributes
- **Save Formatting Templates**: Save your preferred formatting settings for reuse
- **Format History**: Access recently formatted XML documents
- **Import/Export**: Download formatted XML as a file
- **Line Numbers**: Toggle line numbers for easier reference
- **Responsive Design**: Works on desktop, tablet, and mobile

## Implementation Details

The XML Formatter tool is built using vanilla JavaScript and relies on the browser's built-in DOM parser for XML validation and manipulation. The implementation includes the following components:

### Front-end Components

- **HTML Template**: Located at `/layouts/_default/xml-formatter.html`
- **JavaScript Logic**: Located at `/static/js/xml-formatter.js`
- **Test Suite**: Located at `/static/js/xml-formatter.test.js` (only runs in development mode)

### Core Technologies

- **DOMParser API**: Used for XML parsing and validation
- **highlight.js**: For syntax highlighting
- **LocalStorage**: For saving formatting history and templates

### Testing

The tool includes a comprehensive test suite that runs automatically in development mode. It tests:

- XML formatting and validation
- Element structure analysis
- Minification functionality
- Template and history features
- UI interactions and responsiveness

## Development

To develop or modify this tool:

1. Make changes to the relevant files
2. Run Hugo in development mode: `HUGO_ENV=development hugo server`
3. Visit the XML Formatter page to automatically run tests
4. Check browser console for test results

## License

This tool is licensed under the same license as the main DevToolZone project. 