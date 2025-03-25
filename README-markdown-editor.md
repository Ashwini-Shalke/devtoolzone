# Markdown Editor

A feature-rich Markdown editor with live preview, formatting shortcuts, and export capabilities for Learner Loft.

## Features

- **Live Preview**: See your formatted Markdown in real-time as you type
- **Formatting Shortcuts**: Quick buttons for common Markdown syntax (bold, italic, headings, etc.)
- **Character & Word Count**: Tracks the length of your document
- **Export Options**: Download as .md file or copy to clipboard
- **Light/Dark Mode Support**: Integrates with the site's theme
- **Mobile Responsive**: Works on all device sizes

## Implementation Details

The Markdown Editor consists of:

1. **HTML Template**: `layouts/_default/markdown-editor.html`
2. **JavaScript Logic**: `static/js/markdown-editor.js`
3. **Markdown Parser**: `static/js/marked.min.js` (third-party library)
4. **Content File**: `content/devtools/markdown-editor.md`
5. **Test Suite**: `static/js/markdown-editor.test.js`

## Testing

The Markdown editor includes a comprehensive test suite to ensure all functionality works correctly:

### Running Tests

1. Run the Hugo server in development mode: `HUGO_ENV=development hugo server`
2. Navigate to the Markdown Editor page: `http://localhost:1313/devtools/markdown-editor/`
3. Click the "Run Tests" button that appears in the bottom-right corner (only visible in development mode)
4. View the test results in the browser console (F12 or right-click > Inspect > Console)

### Test Coverage

The test suite covers:

- **Markdown Parsing**: Verifies that Markdown is correctly converted to HTML
- **Character & Word Count**: Ensures counts are accurate
- **Copy & Download**: Tests clipboard and file download functionality
- **Formatting Shortcuts**: Verifies all formatting buttons insert the correct Markdown syntax
- **Clear Function**: Tests that the clear button resets all content

## Styling

The Markdown Editor follows the site's design system, ensuring consistency with other tools:

- Proper placement of ad containers
- Consistent spacing and typography
- Light/dark mode theme support
- Mobile responsiveness

## Development Notes

- The editor uses the `marked.js` library for Markdown parsing
- Text insertion uses the `document.execCommand` API for compatibility
- Live preview uses debouncing for performance 