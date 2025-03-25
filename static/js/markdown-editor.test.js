/**
 * Markdown Editor Tests
 * 
 * This file contains tests for the markdown editor functionality.
 * Run these tests in the browser console to verify that the editor works correctly.
 */

// Test suite for the Markdown Editor
const MarkdownEditorTests = {
  
  // List of test results
  results: [],
  
  // Run all tests and report results
  runTests: function() {
    console.log('%c Markdown Editor Tests ', 'background: #3b82f6; color: white; padding: 2px 5px; border-radius: 3px;');
    
    // Reset results
    this.results = [];
    
    // Run individual tests
    this.testMarkdownParsing();
    this.testCharacterCount();
    this.testWordCount();
    this.testCopyToClipboard();
    this.testDownloadMarkdown();
    this.testClearFunctionality();
    this.testBoldShortcut();
    this.testItalicShortcut();
    this.testHeadingShortcut();
    this.testLinkShortcut();
    this.testImageShortcut();
    this.testListShortcut();
    this.testCodeShortcut();
    this.testQuoteShortcut();
    
    // Report results
    this.reportResults();
    
    return this.results.every(result => result.passed);
  },
  
  // Test markdown parsing
  testMarkdownParsing: function() {
    try {
      // Mock input
      const input = '# Heading\n\nThis is a **bold** text with *italic* formatting.';
      
      // Get expected output by using marked directly
      const expectedOutput = marked.parse(input);
      
      // Simulate preview by setting input and clicking button
      document.getElementById('markdown-input').value = input;
      document.getElementById('preview-button').click();
      
      // Get actual output
      const actualOutput = document.getElementById('markdown-output').innerHTML;
      
      // Check if markdown was parsed correctly
      const passed = actualOutput.includes('<h1');
      
      this.results.push({
        name: 'Markdown Parsing',
        passed: passed,
        message: passed ? 'Markdown parsed correctly' : 'Failed to parse markdown'
      });
    } catch (error) {
      this.results.push({
        name: 'Markdown Parsing',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test character count
  testCharacterCount: function() {
    try {
      // Set input
      const input = 'This is a test string with 36 characters.';
      document.getElementById('markdown-input').value = input;
      
      // Trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      document.getElementById('markdown-input').dispatchEvent(inputEvent);
      
      // Check character count
      const characterCount = document.getElementById('character-count').textContent;
      const passed = characterCount === '36';
      
      this.results.push({
        name: 'Character Count',
        passed: passed,
        message: passed ? 'Character count works correctly' : `Character count should be 36, got ${characterCount}`
      });
    } catch (error) {
      this.results.push({
        name: 'Character Count',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test word count
  testWordCount: function() {
    try {
      // Set input
      const input = 'This is a test string with seven words.';
      document.getElementById('markdown-input').value = input;
      
      // Trigger input event
      const inputEvent = new Event('input', { bubbles: true });
      document.getElementById('markdown-input').dispatchEvent(inputEvent);
      
      // Check word count
      const wordCount = document.getElementById('word-count').textContent;
      const passed = wordCount === '7';
      
      this.results.push({
        name: 'Word Count',
        passed: passed,
        message: passed ? 'Word count works correctly' : `Word count should be 7, got ${wordCount}`
      });
    } catch (error) {
      this.results.push({
        name: 'Word Count',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test copy to clipboard functionality
  testCopyToClipboard: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let copyWasCalled = false;
      
      document.execCommand = function(command) {
        if (command === 'copy') {
          copyWasCalled = true;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Set input
      document.getElementById('markdown-input').value = 'Test copy text';
      
      // Click copy button
      document.getElementById('copy-button').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if copy was called
      const passed = copyWasCalled;
      
      this.results.push({
        name: 'Copy to Clipboard',
        passed: passed,
        message: passed ? 'Copy to clipboard works correctly' : 'Copy to clipboard failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Copy to Clipboard',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test download markdown functionality
  testDownloadMarkdown: function() {
    try {
      // Mock functions for testing
      const originalCreateElement = document.createElement;
      const originalAppendChild = document.body.appendChild;
      const originalRemoveChild = document.body.removeChild;
      
      let downloadLinkCreated = false;
      let downloadLinkClicked = false;
      let downloadLinkRemoved = false;
      
      // Mock createElement
      document.createElement = function(tagName) {
        if (tagName === 'a') {
          downloadLinkCreated = true;
          return {
            href: '',
            download: '',
            click: function() {
              downloadLinkClicked = true;
            }
          };
        }
        return originalCreateElement.apply(this, arguments);
      };
      
      // Mock appendChild
      document.body.appendChild = function() {
        return originalAppendChild.apply(this, arguments);
      };
      
      // Mock removeChild
      document.body.removeChild = function() {
        downloadLinkRemoved = true;
        return originalRemoveChild.apply(this, arguments);
      };
      
      // Set input
      document.getElementById('markdown-input').value = 'Test download text';
      
      // Click download button
      document.getElementById('download-button').click();
      
      // Restore original functions
      document.createElement = originalCreateElement;
      document.body.appendChild = originalAppendChild;
      document.body.removeChild = originalRemoveChild;
      
      // Check if download was initiated
      const passed = downloadLinkCreated;
      
      this.results.push({
        name: 'Download Markdown',
        passed: passed,
        message: passed ? 'Download markdown works correctly' : 'Download markdown failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Download Markdown',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test clear functionality
  testClearFunctionality: function() {
    try {
      // Set input
      document.getElementById('markdown-input').value = 'This should be cleared';
      document.getElementById('markdown-output').innerHTML = '<p>This should be cleared</p>';
      
      // Click clear button
      document.getElementById('clear-button').click();
      
      // Check if text was cleared
      const inputCleared = document.getElementById('markdown-input').value === '';
      const outputCleared = document.getElementById('markdown-output').innerHTML === '';
      const passed = inputCleared && outputCleared;
      
      this.results.push({
        name: 'Clear Functionality',
        passed: passed,
        message: passed ? 'Clear functionality works correctly' : 'Clear functionality failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Clear Functionality',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test bold shortcut
  testBoldShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click bold shortcut button
      document.querySelector('[data-markdown-shortcut="bold"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if bold text was inserted
      const passed = insertTextCalled && insertedText.includes('**bold text**');
      
      this.results.push({
        name: 'Bold Shortcut',
        passed: passed,
        message: passed ? 'Bold shortcut works correctly' : 'Bold shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Bold Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test italic shortcut
  testItalicShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click italic shortcut button
      document.querySelector('[data-markdown-shortcut="italic"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if italic text was inserted
      const passed = insertTextCalled && insertedText.includes('*italic text*');
      
      this.results.push({
        name: 'Italic Shortcut',
        passed: passed,
        message: passed ? 'Italic shortcut works correctly' : 'Italic shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Italic Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test heading shortcut
  testHeadingShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click heading shortcut button
      document.querySelector('[data-markdown-shortcut="heading"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if heading was inserted
      const passed = insertTextCalled && insertedText.includes('## Heading');
      
      this.results.push({
        name: 'Heading Shortcut',
        passed: passed,
        message: passed ? 'Heading shortcut works correctly' : 'Heading shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Heading Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test link shortcut
  testLinkShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click link shortcut button
      document.querySelector('[data-markdown-shortcut="link"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if link was inserted
      const passed = insertTextCalled && insertedText.includes('[link text](https://example.com)');
      
      this.results.push({
        name: 'Link Shortcut',
        passed: passed,
        message: passed ? 'Link shortcut works correctly' : 'Link shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Link Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test image shortcut
  testImageShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click image shortcut button
      document.querySelector('[data-markdown-shortcut="image"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if image was inserted
      const passed = insertTextCalled && insertedText.includes('![alt text](https://example.com/image.jpg)');
      
      this.results.push({
        name: 'Image Shortcut',
        passed: passed,
        message: passed ? 'Image shortcut works correctly' : 'Image shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Image Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test list shortcut
  testListShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click list shortcut button
      document.querySelector('[data-markdown-shortcut="list"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if list was inserted
      const passed = insertTextCalled && insertedText.includes('- List item');
      
      this.results.push({
        name: 'List Shortcut',
        passed: passed,
        message: passed ? 'List shortcut works correctly' : 'List shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'List Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test code shortcut
  testCodeShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click code shortcut button
      document.querySelector('[data-markdown-shortcut="code"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if code was inserted
      const passed = insertTextCalled && insertedText.includes('`inline code`');
      
      this.results.push({
        name: 'Code Shortcut',
        passed: passed,
        message: passed ? 'Code shortcut works correctly' : 'Code shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Code Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Test quote shortcut
  testQuoteShortcut: function() {
    try {
      // Mock document.execCommand for testing
      const originalExecCommand = document.execCommand;
      let insertTextCalled = false;
      let insertedText = '';
      
      document.execCommand = function(command, showUI, value) {
        if (command === 'insertText') {
          insertTextCalled = true;
          insertedText = value;
          return true;
        }
        return originalExecCommand.apply(this, arguments);
      };
      
      // Click quote shortcut button
      document.querySelector('[data-markdown-shortcut="quote"]').click();
      
      // Restore original function
      document.execCommand = originalExecCommand;
      
      // Check if quote was inserted
      const passed = insertTextCalled && insertedText.includes('> Blockquote');
      
      this.results.push({
        name: 'Quote Shortcut',
        passed: passed,
        message: passed ? 'Quote shortcut works correctly' : 'Quote shortcut failed'
      });
    } catch (error) {
      this.results.push({
        name: 'Quote Shortcut',
        passed: false,
        message: 'Error: ' + error.message
      });
    }
  },
  
  // Report test results
  reportResults: function() {
    console.log(`%c Test Results: ${this.results.filter(r => r.passed).length}/${this.results.length} passed`, 'font-weight: bold;');
    
    // Log passed tests
    this.results.filter(r => r.passed).forEach(result => {
      console.log(`%c ✓ ${result.name}`, 'color: green', result.message);
    });
    
    // Log failed tests
    this.results.filter(r => !r.passed).forEach(result => {
      console.error(`%c ✗ ${result.name}`, 'color: red', result.message);
    });
  }
};

// Add a button to run tests on the page
document.addEventListener('DOMContentLoaded', function() {
  // Only add test button in development environment
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const testButton = document.createElement('button');
    testButton.textContent = 'Run Tests';
    testButton.id = 'run-tests-button';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '5px 10px';
    testButton.style.backgroundColor = '#3b82f6';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', function() {
      MarkdownEditorTests.runTests();
    });
    
    document.body.appendChild(testButton);
  }
}); 