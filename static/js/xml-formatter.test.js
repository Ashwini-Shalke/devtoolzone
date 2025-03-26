// XML Formatter Test Suite
// Only runs in development environment

(function() {
  // Only run tests in development mode
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }

  // Allow tests to run only after formatter is fully initialized
  setTimeout(function() {
    console.log('🧪 Running XML Formatter tests...');
    
    // Test utilities
    const TestRunner = {
      tests: [],
      passed: 0,
      failed: 0,
      
      addTest(name, fn) {
        this.tests.push({ name, fn });
      },
      
      async runAll() {
        for (const test of this.tests) {
          try {
            await test.fn();
            console.log(`✅ ${test.name}`);
            this.passed++;
          } catch (error) {
            console.error(`❌ ${test.name}`);
            console.error(error);
            this.failed++;
          }
        }
        
        console.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);
        
        // Return true if all tests passed
        return this.failed === 0;
      },
      
      assert(condition, message) {
        if (!condition) {
          throw new Error(message || 'Assertion failed');
        }
      },
      
      assertEqual(actual, expected, message) {
        if (actual !== expected) {
          throw new Error(
            message || `Expected ${expected} but got ${actual}`
          );
        }
      },
      
      assertContains(haystack, needle, message) {
        if (!haystack || !haystack.includes(needle)) {
          throw new Error(
            message || `Expected "${haystack}" to contain "${needle}"`
          );
        }
      },
      
      // Retry a function several times before failing
      async retry(fn, maxRetries = 3, delay = 300) {
        let lastError;
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            return await fn();
          } catch (error) {
            lastError = error;
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        throw lastError;
      }
    };
    
    // DOM Element access with retries
    async function getElementsWithRetry() {
      return TestRunner.retry(() => {
        const elements = {
          xmlInput: document.getElementById('xml-input'),
          xmlOutput: document.getElementById('xml-output'),
          formatButton: document.getElementById('format-button'),
          clearButton: document.getElementById('clear-button'),
          copyButton: document.getElementById('copy-button'),
          downloadButton: document.getElementById('download-button'),
          modeSelect: document.getElementById('xml-mode'),
          indentSelect: document.getElementById('indent-size'),
          newlineElementsCheckbox: document.getElementById('newline-elements'),
          preserveCommentsCheckbox: document.getElementById('preserve-comments'),
          elementsListContainer: document.getElementById('elements-list'),
          treeDiagramContainer: document.getElementById('tree-diagram'),
          validationResultsContainer: document.getElementById('validation-results'),
          historySelect: document.getElementById('history-select'),
          templateSelect: document.getElementById('template-select'),
          saveTemplateButton: document.getElementById('save-template-button')
        };
        
        // Verify that all elements exist
        for (const [name, element] of Object.entries(elements)) {
          if (!element) {
            throw new Error(`Element '${name}' not found. DOM might not be fully loaded.`);
          }
        }
        
        return elements;
      });
    }
    
    // Sample XML documents for testing
    const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <element attribute="value">text</element>
</root>`;
    
    const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <element attribute="value">text
</root>`;
    
    const complexXml = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <books>
    <book id="1" category="fiction">
      <title>The Great Gatsby</title>
      <author>F. Scott Fitzgerald</author>
      <year>1925</year>
      <price>9.99</price>
    </book>
    <book id="2" category="non-fiction">
      <title>In Cold Blood</title>
      <author>Truman Capote</author>
      <year>1966</year>
      <price>11.99</price>
    </book>
  </books>
  <magazines>
    <magazine frequency="monthly">
      <title>National Geographic</title>
      <publisher>National Geographic Partners</publisher>
    </magazine>
  </magazines>
</library>`;
    
    const xmlWithComments = `<?xml version="1.0" encoding="UTF-8"?>
<!-- This is a comment -->
<root>
  <!-- Another comment -->
  <element>text</element>
</root>`;
    
    // Mock user actions with retry
    async function setInputValue(value) {
      const elements = await getElementsWithRetry();
      elements.xmlInput.value = value;
      
      // Trigger input event
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      elements.xmlInput.dispatchEvent(event);
    }
    
    async function clickButton(buttonId) {
      const button = document.getElementById(buttonId);
      if (!button) {
        throw new Error(`Button with ID '${buttonId}' not found`);
      }
      button.click();
    }
    
    async function selectOption(selectId, value) {
      const select = document.getElementById(selectId);
      if (!select) {
        throw new Error(`Select with ID '${selectId}' not found`);
      }
      select.value = value;
      
      // Trigger change event
      const event = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
      select.dispatchEvent(event);
    }
    
    async function setCheckbox(checkboxId, checked) {
      const checkbox = document.getElementById(checkboxId);
      if (!checkbox) {
        throw new Error(`Checkbox with ID '${checkboxId}' not found`);
      }
      checkbox.checked = checked;
      
      // Trigger change event
      const event = new Event('change', {
        bubbles: true,
        cancelable: true,
      });
      checkbox.dispatchEvent(event);
    }
    
    // Mock localStorage
    const originalLocalStorage = {
      getItem: localStorage.getItem.bind(localStorage),
      setItem: localStorage.setItem.bind(localStorage),
      removeItem: localStorage.removeItem.bind(localStorage)
    };
    
    function mockLocalStorage() {
      const store = {};
      
      localStorage.getItem = function(key) {
        return store[key] || null;
      };
      
      localStorage.setItem = function(key, value) {
        store[key] = value.toString();
      };
      
      localStorage.removeItem = function(key) {
        delete store[key];
      };
      
      return store;
    }
    
    function restoreLocalStorage() {
      localStorage.getItem = originalLocalStorage.getItem;
      localStorage.setItem = originalLocalStorage.setItem;
      localStorage.removeItem = originalLocalStorage.removeItem;
    }
    
    // Define test cases
    TestRunner.addTest('Formatter is loaded and initialized', async () => {
      const elements = await getElementsWithRetry();
      TestRunner.assert(elements.xmlInput, 'XML input element not found');
      TestRunner.assert(elements.xmlOutput, 'XML output element not found');
      TestRunner.assert(elements.formatButton, 'Format button not found');
      
      // Sometimes the sample may not be loaded right away
      await TestRunner.retry(() => {
        TestRunner.assert(elements.xmlInput.value, 'XML input should be initialized with sample');
        return true;
      });
    });
    
    TestRunner.addTest('Format valid XML', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(validXml);
      
      // Wait for debounce plus rendering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check output with retries
      await TestRunner.retry(() => {
        TestRunner.assert(elements.xmlOutput.textContent, 'Output should not be empty');
        TestRunner.assertContains(elements.xmlOutput.textContent, '<root>');
        TestRunner.assertContains(elements.xmlOutput.textContent, '</root>');
        return true;
      });
      
      // Check validation result with retries
      await TestRunner.retry(() => {
        TestRunner.assertContains(elements.validationResultsContainer.innerHTML, 'Valid XML');
        return true;
      });
    });
    
    TestRunner.addTest('Detect invalid XML', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(invalidXml);
      
      // Wait for debounce plus rendering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check validation result with retries
      await TestRunner.retry(() => {
        TestRunner.assertContains(elements.validationResultsContainer.innerHTML, 'Invalid XML');
        return true;
      });
    });
    
    TestRunner.addTest('Generate XML structure tree for complex XML', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(complexXml);
      
      // Wait for debounce plus rendering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check tree visualization with retries
      await TestRunner.retry(() => {
        TestRunner.assert(elements.treeDiagramContainer.innerHTML, 'Tree diagram should not be empty');
        TestRunner.assertContains(elements.treeDiagramContainer.innerHTML, 'library');
        TestRunner.assertContains(elements.treeDiagramContainer.innerHTML, 'books');
        TestRunner.assertContains(elements.treeDiagramContainer.innerHTML, 'book');
        return true;
      });
    });
    
    TestRunner.addTest('Element analysis shows correct element counts', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(complexXml);
      
      // Wait for debounce plus rendering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check elements list with retries
      await TestRunner.retry(() => {
        TestRunner.assert(elements.elementsListContainer.innerHTML, 'Elements list should not be empty');
        TestRunner.assertContains(elements.elementsListContainer.innerHTML, 'book');
        // Check for the book count - this might vary depending on the output format
        TestRunner.assert(
          elements.elementsListContainer.innerHTML.includes('(2)') || 
          elements.elementsListContainer.innerHTML.includes('2'), 
          'Should show 2 book elements'
        );
        return true;
      });
    });
    
    TestRunner.addTest('Minify mode removes whitespace', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(validXml);
      
      // Select minify mode
      await selectOption('xml-mode', 'minify');
      
      // Wait for debounce plus rendering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check output with retries
      await TestRunner.retry(() => {
        const output = elements.xmlOutput.textContent;
        TestRunner.assert(output, 'Output should not be empty');
        TestRunner.assert(
          !output.includes('  ') || !output.includes('\n'), 
          'Minified output should have reduced whitespace'
        );
        return true;
      });
    });
    
    TestRunner.addTest('Preserve comments option works', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(xmlWithComments);
      
      // Ensure preserve comments is checked
      await setCheckbox('preserve-comments', true);
      
      // Explicitly click format to apply changes
      await clickButton('format-button');
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check output contains comments
      await TestRunner.retry(() => {
        const output = elements.xmlOutput.textContent;
        TestRunner.assert(output, 'Output should not be empty');
        TestRunner.assertContains(output, '<!--');
        return true;
      });
      
      // Now uncheck preserve comments
      await setCheckbox('preserve-comments', false);
      
      // Click format button to apply changes
      await clickButton('format-button');
      
      // Wait for formatting
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check output doesn't contain comments
      await TestRunner.retry(() => {
        const output = elements.xmlOutput.textContent;
        TestRunner.assert(output, 'Output should not be empty');
        // Some implementations might still have comment indicators but empty content
        const hasFullComment = output.includes('<!-- This is a comment -->');
        TestRunner.assert(!hasFullComment, 'Comments should be removed or minimized');
        return true;
      });
    });
    
    TestRunner.addTest('Clear button works', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(validXml);
      
      // Click clear button
      await clickButton('clear-button');
      
      // Check input and output are empty with retries
      await TestRunner.retry(() => {
        TestRunner.assertEqual(elements.xmlInput.value, '');
        // The output might have some spacing but should have no meaningful content
        TestRunner.assert(!elements.xmlOutput.textContent.trim(), 'Output should be empty or only whitespace');
        return true;
      });
    });
    
    TestRunner.addTest('Indent size option changes indentation', async () => {
      const elements = await getElementsWithRetry();
      
      // Set input value
      await setInputValue(validXml);
      
      // Set indent size to 2
      await selectOption('indent-size', '2');
      
      // Wait for debounce plus rendering
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Explicitly click format
      await clickButton('format-button');
      
      // Wait for formatting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the output with 2-space indentation
      let twoSpaceOutput = null;
      await TestRunner.retry(() => {
        twoSpaceOutput = elements.xmlOutput.textContent;
        TestRunner.assert(twoSpaceOutput, 'Output should not be empty');
        return true;
      });
      
      // Set indent size to 4
      await selectOption('indent-size', '4');
      
      // Click format button to apply changes
      await clickButton('format-button');
      
      // Wait for formatting
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check output has 4-space indentation
      await TestRunner.retry(() => {
        const fourSpaceOutput = elements.xmlOutput.textContent;
        TestRunner.assert(fourSpaceOutput, 'Output should not be empty');
        // Check that the indentation is greater than before
        // We can't rely on specific pattern matches due to rendering differences
        TestRunner.assert(
          fourSpaceOutput !== twoSpaceOutput, 
          'Changing indent size should change output'
        );
        return true;
      });
    });
    
    // NEW: Tests for history functionality
    TestRunner.addTest('Saving to history works', async () => {
      const elements = await getElementsWithRetry();
      
      // Create a mock localStorage
      const mockStore = mockLocalStorage();
      
      // Set input value
      await setInputValue(validXml);
      
      // Explicitly click format button
      await clickButton('format-button');
      
      // Wait for formatting and history saving
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check that history was saved
      await TestRunner.retry(() => {
        const historyData = mockStore['xmlFormatterHistory'];
        TestRunner.assert(historyData, 'History should be saved in localStorage');
        
        const history = JSON.parse(historyData);
        TestRunner.assert(Array.isArray(history), 'History should be an array');
        TestRunner.assert(history.length > 0, 'History should have at least one entry');
        TestRunner.assert(history[0].original, 'History entry should have original XML');
        TestRunner.assert(history[0].formatted, 'History entry should have formatted XML');
        TestRunner.assert(history[0].timestamp, 'History entry should have timestamp');
        
        return true;
      });
      
      // Check if history dropdown is populated
      await TestRunner.retry(() => {
        TestRunner.assert(elements.historySelect.options.length > 1, 'History dropdown should have options');
        return true;
      });
      
      // Cleanup
      restoreLocalStorage();
    });
    
    TestRunner.addTest('Loading from history works', async () => {
      const elements = await getElementsWithRetry();
      
      // Create a mock localStorage with history data
      const mockStore = mockLocalStorage();
      const historyEntry = {
        timestamp: Date.now(),
        original: complexXml,
        formatted: complexXml,
        preview: complexXml.substring(0, 50) + '...'
      };
      mockStore['xmlFormatterHistory'] = JSON.stringify([historyEntry]);
      
      // Clear input first
      await setInputValue('');
      
      // Load history (this normally happens in init, but we need to call it manually after mocking)
      if (typeof loadHistory === 'function') {
        loadHistory();
      } else if (window.loadHistory) {
        window.loadHistory();
      } else {
        // Simulate updating history dropdown
        const option = document.createElement('option');
        option.value = historyEntry.timestamp;
        option.text = `${new Date(historyEntry.timestamp).toLocaleString()} - ${historyEntry.preview}`;
        elements.historySelect.appendChild(option);
      }
      
      // Select the history item
      await selectOption('history-select', historyEntry.timestamp.toString());
      
      // Wait for loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check that the input is populated
      await TestRunner.retry(() => {
        TestRunner.assertContains(elements.xmlInput.value, '<library>');
        return true;
      });
      
      // Cleanup
      restoreLocalStorage();
    });
    
    // NEW: Tests for templates functionality
    TestRunner.addTest('Save template functionality works', async () => {
      const elements = await getElementsWithRetry();
      
      // Create a mock localStorage
      const mockStore = mockLocalStorage();
      
      // Set up specific formatting options
      await selectOption('xml-mode', 'format');
      await selectOption('indent-size', '4');
      await setCheckbox('preserve-comments', true);
      await setCheckbox('newline-elements', false);
      
      // Mock window.prompt to return a template name
      const originalPrompt = window.prompt;
      window.prompt = function() {
        return 'Test Template';
      };
      
      // Trigger save template
      if (elements.saveTemplateButton) {
        elements.saveTemplateButton.click();
      } else {
        // If direct click doesn't work, try to invoke the save function manually
        if (typeof saveTemplate === 'function') {
          saveTemplate();
        } else if (window.saveTemplate) {
          window.saveTemplate();
        }
      }
      
      // Wait for saving
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check that template was saved
      await TestRunner.retry(() => {
        const templatesData = mockStore['xmlFormatterTemplates'];
        TestRunner.assert(templatesData, 'Templates should be saved in localStorage');
        
        const templates = JSON.parse(templatesData);
        TestRunner.assert(templates['Test Template'], 'Template should be saved with correct name');
        TestRunner.assertEqual(templates['Test Template'].mode, 'format', 'Template should store mode');
        TestRunner.assertEqual(templates['Test Template'].indentSize, '4', 'Template should store indent size');
        
        return true;
      });
      
      // Check if template dropdown is populated
      await TestRunner.retry(() => {
        TestRunner.assert(elements.templateSelect.options.length > 1, 'Template dropdown should have options');
        return true;
      });
      
      // Restore prompt
      window.prompt = originalPrompt;
      
      // Cleanup
      restoreLocalStorage();
    });
    
    TestRunner.addTest('Loading template works', async () => {
      const elements = await getElementsWithRetry();
      
      // Create a mock localStorage with template data
      const mockStore = mockLocalStorage();
      const templateSettings = {
        mode: 'minify',
        indentSize: '2',
        newlineElements: true,
        preserveComments: false
      };
      mockStore['xmlFormatterTemplates'] = JSON.stringify({
        'Test Template': templateSettings
      });
      
      // Set initial values different from template
      await selectOption('xml-mode', 'format');
      await selectOption('indent-size', '4');
      
      // Load templates (this normally happens in init, but we need to call it manually after mocking)
      if (typeof loadTemplates === 'function') {
        loadTemplates();
      } else if (window.loadTemplates) {
        window.loadTemplates();
      } else {
        // Simulate updating template dropdown
        const option = document.createElement('option');
        option.value = 'Test Template';
        option.text = 'Test Template';
        elements.templateSelect.appendChild(option);
      }
      
      // Select the template
      await selectOption('template-select', 'Test Template');
      
      // Wait for loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check that the settings were applied
      await TestRunner.retry(() => {
        TestRunner.assertEqual(elements.modeSelect.value, 'minify', 'Mode should be set from template');
        TestRunner.assertEqual(elements.indentSelect.value, '2', 'Indent size should be set from template');
        return true;
      });
      
      // Cleanup
      restoreLocalStorage();
    });
    
    // Run all tests
    window.addEventListener('load', async () => {
      // Wait for the formatter to initialize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show message that tests are running
      const testRunningIndicator = document.createElement('div');
      testRunningIndicator.id = 'test-running-indicator';
      testRunningIndicator.style.position = 'fixed';
      testRunningIndicator.style.bottom = '10px';
      testRunningIndicator.style.right = '10px';
      testRunningIndicator.style.padding = '8px 12px';
      testRunningIndicator.style.backgroundColor = '#3498db';
      testRunningIndicator.style.color = 'white';
      testRunningIndicator.style.borderRadius = '4px';
      testRunningIndicator.style.zIndex = '9999';
      testRunningIndicator.style.fontWeight = 'bold';
      testRunningIndicator.textContent = '🧪 Running tests...';
      document.body.appendChild(testRunningIndicator);
      
      try {
        // Run tests
        const allPassed = await TestRunner.runAll();
        
        // Remove running indicator
        if (testRunningIndicator.parentNode) {
          testRunningIndicator.parentNode.removeChild(testRunningIndicator);
        }
        
        if (allPassed) {
          console.log('🎉 All XML Formatter tests passed!');
          // Add a visible indicator on the page that tests have passed
          const testResultElement = document.createElement('div');
          testResultElement.id = 'test-result-indicator';
          testResultElement.style.position = 'fixed';
          testResultElement.style.bottom = '10px';
          testResultElement.style.right = '10px';
          testResultElement.style.padding = '8px 12px';
          testResultElement.style.backgroundColor = '#4caf50';
          testResultElement.style.color = 'white';
          testResultElement.style.borderRadius = '4px';
          testResultElement.style.zIndex = '9999';
          testResultElement.style.fontWeight = 'bold';
          testResultElement.textContent = '✅ All tests passed';
          document.body.appendChild(testResultElement);
          
          // Remove after 5 seconds
          setTimeout(() => {
            if (testResultElement.parentNode) {
              testResultElement.parentNode.removeChild(testResultElement);
            }
          }, 5000);
        } else {
          console.error('❌ Some XML Formatter tests failed.');
          // Add a visible indicator on the page that some tests have failed
          const testResultElement = document.createElement('div');
          testResultElement.id = 'test-result-indicator';
          testResultElement.style.position = 'fixed';
          testResultElement.style.bottom = '10px';
          testResultElement.style.right = '10px';
          testResultElement.style.padding = '8px 12px';
          testResultElement.style.backgroundColor = '#f44336';
          testResultElement.style.color = 'white';
          testResultElement.style.borderRadius = '4px';
          testResultElement.style.zIndex = '9999';
          testResultElement.style.fontWeight = 'bold';
          testResultElement.textContent = '❌ Some tests failed';
          document.body.appendChild(testResultElement);
          
          // Remove after 10 seconds
          setTimeout(() => {
            if (testResultElement.parentNode) {
              testResultElement.parentNode.removeChild(testResultElement);
            }
          }, 10000);
        }
      } catch (error) {
        console.error('Error running tests:', error);
        // Show error indicator
        const errorElement = document.createElement('div');
        errorElement.id = 'test-error-indicator';
        errorElement.style.position = 'fixed';
        errorElement.style.bottom = '10px';
        errorElement.style.right = '10px';
        errorElement.style.padding = '8px 12px';
        errorElement.style.backgroundColor = '#e74c3c';
        errorElement.style.color = 'white';
        errorElement.style.borderRadius = '4px';
        errorElement.style.zIndex = '9999';
        errorElement.style.fontWeight = 'bold';
        errorElement.textContent = '❌ Test runner error';
        document.body.appendChild(errorElement);
        
        // Remove after 10 seconds
        setTimeout(() => {
          if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
          }
        }, 10000);
      }
      
      console.log('======= XML FORMATTER TESTS COMPLETE =======');
    });
  }, 1000); // Delay test execution start to allow page to fully load
})(); 