# SQL Formatter Tool

This document provides details about the SQL Formatter tool implementation for DevToolZone.

## Overview

The SQL Formatter tool allows users to beautify and format SQL queries, making them more readable and easier to debug. It supports multiple SQL dialects and provides options for customizing the formatting output.

## Implementation

The tool consists of three main components:

1. **Content File**: `content/devtools/sql-formatter.md` - Contains the front matter and description for the tool.
2. **HTML Template**: `layouts/_default/sql-formatter.html` - Defines the UI structure and styling.
3. **JavaScript Logic**: `static/js/sql-formatter.js` - Handles the formatting functionality.

### Features

- Support for multiple SQL dialects (Standard SQL, MySQL, PostgreSQL, T-SQL, Oracle)
- Customizable indentation size (2, 4, or 8 spaces)
- Option to uppercase SQL keywords
- Live formatting as you type (with debounce)
- Copy formatted SQL to clipboard
- Responsive design for all device sizes

### External Dependencies

The tool uses the [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) library loaded dynamically from a CDN. The library is only loaded when needed, reducing initial page load time. If the library fails to load, a basic fallback formatter is provided.

## File Structure

```
├── content/
│   └── devtools/
│       └── sql-formatter.md         # Content front matter and description
├── layouts/
│   └── _default/
│       └── sql-formatter.html       # HTML template with styling
└── static/
    └── js/
        └── sql-formatter.js         # JavaScript functionality
```

## How It Works

1. The tool loads with a sample SQL query to help users get started.
2. When the user enters or modifies SQL code, the input is processed after a short delay (debounce).
3. The tool attempts to load the sql-formatter library if it's not already available.
4. The SQL is formatted according to the selected dialect and formatting options.
5. The formatted SQL is displayed in the output section.

## Extending the Tool

### Adding New SQL Dialects

To add support for a new SQL dialect:

1. Add a new option to the dialect selector in `sql-formatter.html`:
   ```html
   <option value="new-dialect">New Dialect Name</option>
   ```

2. Update the dialect mapping in `sql-formatter.js`:
   ```javascript
   const dialectMap = {
     // Existing mappings...
     'new-dialect': 'corresponding-library-dialect'
   };
   ```

### Adding Syntax Highlighting

The current implementation has a placeholder for syntax highlighting. To implement it:

1. Include a syntax highlighting library such as highlight.js or Prism.js
2. Implement the `applyHighlighting()` function in `sql-formatter.js` 

### Performance Considerations

- The tool uses debounce to prevent excessive formatting operations during typing
- The SQL formatter library is loaded dynamically to improve initial page load performance

## SEO Information

The tool includes appropriate metadata in the front matter of the content file:

- Title: "SQL Formatter"
- Description: "Format and beautify SQL queries with this easy-to-use online tool"

## Accessibility Features

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Clear visual feedback for all user interactions
- Screen reader friendly element structure

## Browser Compatibility

The tool has been designed to work in all modern browsers including:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest) 