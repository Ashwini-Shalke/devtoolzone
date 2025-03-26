// XML Formatter Test Suite
// Only runs in development environment

(function() {
  // Only run tests in development mode
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }

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
      if (!haystack.includes(needle)) {
        throw new Error(
          message || `Expected "${haystack}" to contain "${needle}"`
        );
      }
    }
  };
  
  // DOM Element access
  function getElements() {
    return {
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
      validationResultsContainer: document.getElementById('validation-results')
    };
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
  
  // Mock user actions
  function setInputValue(value) {
    const elements = getElements();
    elements.xmlInput.value = value;
    
    // Trigger input event
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    elements.xmlInput.dispatchEvent(event);
  }
  
  function clickButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.click();
  }
  
  function selectOption(selectId, value) {
    const select = document.getElementById(selectId);
    select.value = value;
    
    // Trigger change event
    const event = new Event('change', {
      bubbles: true,
      cancelable: true,
    });
    select.dispatchEvent(event);
  }
  
  function setCheckbox(checkboxId, checked) {
    const checkbox = document.getElementById(checkboxId);
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
    
    localStorage.getItem = jest.fn(key => store[key] || null);
    localStorage.setItem = jest.fn((key, value) => {
      store[key] = value.toString();
    });
    localStorage.removeItem = jest.fn(key => {
      delete store[key];
    });
    
    return store;
  }
  
  function restoreLocalStorage() {
    localStorage.getItem = originalLocalStorage.getItem;
    localStorage.setItem = originalLocalStorage.setItem;
    localStorage.removeItem = originalLocalStorage.removeItem;
  }
  
  // Define test cases
  TestRunner.addTest('Formatter is loaded and initialized', () => {
    const elements = getElements();
    TestRunner.assert(elements.xmlInput, 'XML input element not found');
    TestRunner.assert(elements.xmlOutput, 'XML output element not found');
    TestRunner.assert(elements.formatButton, 'Format button not found');
    TestRunner.assert(elements.xmlInput.value, 'XML input should be initialized with sample');
  });
  
  TestRunner.addTest('Format valid XML', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(validXml);
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check output
    TestRunner.assert(elements.xmlOutput.textContent, 'Output should not be empty');
    TestRunner.assertContains(elements.xmlOutput.textContent, '<root>');
    TestRunner.assertContains(elements.xmlOutput.textContent, '</root>');
    
    // Check validation result
    TestRunner.assertContains(elements.validationResultsContainer.innerHTML, 'Valid XML');
  });
  
  TestRunner.addTest('Detect invalid XML', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(invalidXml);
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check validation result
    TestRunner.assertContains(elements.validationResultsContainer.innerHTML, 'Invalid XML');
  });
  
  TestRunner.addTest('Generate XML structure tree for complex XML', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(complexXml);
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check tree visualization
    TestRunner.assert(elements.treeDiagramContainer.innerHTML, 'Tree diagram should not be empty');
    TestRunner.assertContains(elements.treeDiagramContainer.innerHTML, 'library');
    TestRunner.assertContains(elements.treeDiagramContainer.innerHTML, 'books');
    TestRunner.assertContains(elements.treeDiagramContainer.innerHTML, 'book');
  });
  
  TestRunner.addTest('Element analysis shows correct element counts', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(complexXml);
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check elements list
    TestRunner.assert(elements.elementsListContainer.innerHTML, 'Elements list should not be empty');
    TestRunner.assertContains(elements.elementsListContainer.innerHTML, 'book');
    TestRunner.assertContains(elements.elementsListContainer.innerHTML, '(2)'); // 2 book elements
  });
  
  TestRunner.addTest('Minify mode removes whitespace', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(validXml);
    
    // Select minify mode
    selectOption('xml-mode', 'minify');
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check output has no extra whitespace
    const output = elements.xmlOutput.textContent;
    TestRunner.assert(!output.includes('  '), 'Minified output should not contain indentation');
    TestRunner.assert(!output.includes('\n'), 'Minified output should not contain newlines');
  });
  
  TestRunner.addTest('Preserve comments option works', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(xmlWithComments);
    
    // Ensure preserve comments is checked
    setCheckbox('preserve-comments', true);
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check output contains comments
    TestRunner.assertContains(elements.xmlOutput.textContent, '<!-- This is a comment -->');
    
    // Now uncheck preserve comments
    setCheckbox('preserve-comments', false);
    
    // Click format button to apply changes
    clickButton('format-button');
    
    // Wait for formatting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check output doesn't contain comments
    const output = elements.xmlOutput.textContent;
    TestRunner.assert(!output.includes('<!-- This is a comment -->'), 'Comments should be removed');
  });
  
  TestRunner.addTest('Clear button works', () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(validXml);
    
    // Click clear button
    clickButton('clear-button');
    
    // Check input and output are empty
    TestRunner.assertEqual(elements.xmlInput.value, '');
    TestRunner.assertEqual(elements.xmlOutput.textContent, '');
  });
  
  TestRunner.addTest('Indent size option changes indentation', async () => {
    const elements = getElements();
    
    // Set input value
    setInputValue(validXml);
    
    // Set indent size to 2
    selectOption('indent-size', '2');
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check output has 2-space indentation
    const twoSpaceOutput = elements.xmlOutput.textContent;
    TestRunner.assertContains(twoSpaceOutput, '\n  <element');
    
    // Set indent size to 4
    selectOption('indent-size', '4');
    
    // Click format button to apply changes
    clickButton('format-button');
    
    // Wait for formatting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check output has 4-space indentation
    const fourSpaceOutput = elements.xmlOutput.textContent;
    TestRunner.assertContains(fourSpaceOutput, '\n    <element');
  });
  
  // Run all tests
  window.addEventListener('load', async () => {
    // Wait for the formatter to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Run tests
    const allPassed = await TestRunner.runAll();
    
    if (allPassed) {
      console.log('🎉 All XML Formatter tests passed!');
    } else {
      console.error('❌ Some XML Formatter tests failed.');
    }
  });
})(); 