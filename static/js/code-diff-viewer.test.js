/**
 * Code Diff Viewer - Test Suite
 * Comprehensive tests covering all functionality of the Code Diff Viewer
 */

describe('Code Diff Viewer', () => {
  // Set longer timeout for tests that may require more processing time
  jest.setTimeout(10000);
  
  // Test DOM elements
  let originalCodeArea;
  let modifiedCodeArea;
  let compareButton;
  let diffOutput;
  let viewModeSelect;
  let languageSelect;
  let ignoreWhitespaceCheckbox;
  let contextLinesInput;
  let swapButton;
  let clearAllButton;
  let copyDiffButton;
  let downloadDiffButton;
  let toggleLineNumbersButton;
  
  // Test data
  const sampleOriginalCode = `function calculateTotal(items) {
  return items
    .filter(item => item.price > 0)
    .map(item => item.price * item.quantity)
    .reduce((total, value) => total + value, 0);
}`;

  const sampleModifiedCode = `function calculateTotal(items) {
  if (!items || items.length === 0) return 0;
  
  return items
    .filter(item => item.price > 0 && item.quantity > 0)
    .map(item => {
      const discount = item.discount || 0;
      return (item.price * (1 - discount)) * item.quantity;
    })
    .reduce((total, value) => total + value, 0);
}`;

  // Diff library mock
  const mockDiffLines = jest.fn((originalText, modifiedText) => {
    return [
      {
        value: 'function calculateTotal(items) {\n',
        count: 1,
      },
      {
        value: '  if (!items || items.length === 0) return 0;\n  \n',
        added: true,
        count: 2,
      },
      {
        value: '  return items\n',
        count: 1,
      },
      {
        value: '    .filter(item => item.price > 0)\n',
        removed: true,
        count: 1,
      },
      {
        value: '    .filter(item => item.price > 0 && item.quantity > 0)\n',
        added: true,
        count: 1,
      },
      {
        value: '    .map(item => item.price * item.quantity)\n',
        removed: true,
        count: 1,
      },
      {
        value: '    .map(item => {\n      const discount = item.discount || 0;\n      return (item.price * (1 - discount)) * item.quantity;\n    })\n',
        added: true,
        count: 4,
      },
      {
        value: '    .reduce((total, value) => total + value, 0);\n}\n',
        count: 2,
      }
    ];
  });
  
  // DOM Element Mock Helper
  function createMockElement(id, type = 'div', attrs = {}) {
    const element = document.createElement(type);
    element.id = id;
    
    // Apply attributes
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'value') {
        element.value = value;
      } else if (key === 'checked') {
        element.checked = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    
    return element;
  }

  // Setup DOM before tests
  function setupDOM() {
    return new Promise((resolve) => {
      // Clear body
      document.body.innerHTML = '';
      
      // Create container
      const container = document.createElement('div');
      container.className = 'code-diff-viewer-container';
      document.body.appendChild(container);
      
      // Create mock elements
      originalCodeArea = createMockElement('original-code', 'textarea');
      modifiedCodeArea = createMockElement('modified-code', 'textarea');
      compareButton = createMockElement('compare-button', 'button');
      diffOutput = createMockElement('diff-output');
      viewModeSelect = createMockElement('view-mode', 'select', { value: 'side-by-side' });
      languageSelect = createMockElement('language-select', 'select', { value: 'javascript' });
      ignoreWhitespaceCheckbox = createMockElement('ignore-whitespace', 'input', { type: 'checkbox', checked: false });
      contextLinesInput = createMockElement('context-lines', 'input', { type: 'number', value: '3' });
      swapButton = createMockElement('swap-button', 'button');
      clearAllButton = createMockElement('clear-all-button', 'button');
      copyDiffButton = createMockElement('copy-diff-button', 'button');
      downloadDiffButton = createMockElement('download-diff-button', 'button');
      toggleLineNumbersButton = createMockElement('toggle-line-numbers', 'button');
      
      // Append all elements to container
      [
        originalCodeArea, modifiedCodeArea, compareButton, diffOutput,
        viewModeSelect, languageSelect, ignoreWhitespaceCheckbox, contextLinesInput,
        swapButton, clearAllButton, copyDiffButton, downloadDiffButton,
        toggleLineNumbersButton
      ].forEach(element => {
        container.appendChild(element);
      });
      
      // Mock global objects needed by the code diff viewer
      global.Diff = {
        diffLines: mockDiffLines
      };
      
      global.hljs = {
        highlight: jest.fn((code, options) => {
          return { value: `<span class="highlighted">${code}</span>` };
        })
      };
      
      // Make mock for clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined)
        }
      });
      
      // Setup ResizeObserver mock
      global.ResizeObserver = class ResizeObserver {
        constructor(callback) {
          this.callback = callback;
        }
        
        observe() {}
        unobserve() {}
        disconnect() {}
      };
      
      // Mock URL and Blob API
      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();
      global.Blob = function(content, options) {
        return { content, options };
      };
      
      // Resolve after a brief timeout to ensure DOM is ready
      setTimeout(resolve, 50);
    });
  }
  
  // Helper function to wait for an element to have specific content
  function waitForElementContent(element, predicate, maxTimeout = 5000, checkInterval = 100) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      function checkContent() {
        // Check if predicate is satisfied
        if (predicate(element)) {
          resolve(true);
          return;
        }
        
        // Check if we've timed out
        if (Date.now() - startTime > maxTimeout) {
          reject(new Error(`Timed out waiting for element content condition: ${predicate.toString()}`));
          return;
        }
        
        // Try again after interval
        setTimeout(checkContent, checkInterval);
      }
      
      checkContent();
    });
  }
  
  // Ensure the script has loaded and initialized
  function waitForInitialization() {
    return new Promise((resolve) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = '/js/code-diff-viewer.js';
      
      scriptElement.onload = () => {
        // Wait a bit more for the script to initialize
        setTimeout(resolve, 100);
      };
      
      document.body.appendChild(scriptElement);
    });
  }
  
  // Add global retry mechanism for test stability
  function withRetry(testFn, maxRetries = 3) {
    return async () => {
      let lastError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await testFn();
          return; // If successful, exit the retry loop
        } catch (error) {
          lastError = error;
          console.warn(`Test attempt ${attempt} failed: ${error.message}`);
          
          // Wait between retries with exponential backoff
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 200 * attempt));
            // Reset DOM for next attempt
            await setupDOM();
            await waitForInitialization();
          }
        }
      }
      
      // If we've exhausted all retries, fail the test
      throw lastError;
    };
  }

  // Run before each test
  beforeEach(async () => {
    await setupDOM();
    await waitForInitialization();
  });
  
  // Basic functionality tests
  
  // Test: Check that the DOM elements are properly accessed and initialized
  test('should initialize all required DOM elements', withRetry(async () => {
    // Allow time for initialization
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check for the 'loaded' class on container, which is added after initialization
    const container = document.querySelector('.code-diff-viewer-container');
    expect(container.classList.contains('loaded')).toBe(true);
    
    // Check for sample code in text areas
    expect(originalCodeArea.value).toContain('function calculateTotal');
    expect(modifiedCodeArea.value).toContain('function calculateTotal');
  }));
  
  // Test: Compare code when the compare button is clicked
  test('should compare code when Compare button is clicked', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Click compare button
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Verify that the diff was generated
    expect(diffOutput.innerHTML).toContain('diff-line');
    expect(mockDiffLines).toHaveBeenCalledWith(
      sampleOriginalCode,
      sampleModifiedCode,
      expect.any(Object)
    );
  }));
  
  // Test: Swap code between original and modified
  test('should swap code when Swap button is clicked', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = 'Original';
    modifiedCodeArea.value = 'Modified';
    
    // Click swap button
    swapButton.click();
    
    // Check if values were swapped
    expect(originalCodeArea.value).toBe('Modified');
    expect(modifiedCodeArea.value).toBe('Original');
  }));
  
  // Test: Clear all code
  test('should clear all code when Clear All button is clicked', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = 'Original';
    modifiedCodeArea.value = 'Modified';
    diffOutput.innerHTML = '<div>Some diff content</div>';
    
    // Click clear all button
    clearAllButton.click();
    
    // Check if values were cleared
    expect(originalCodeArea.value).toBe('');
    expect(modifiedCodeArea.value).toBe('');
    expect(diffOutput.innerHTML).toContain('empty-state');
  }));
  
  // Test: Copy diff to clipboard
  test('should copy diff to clipboard when Copy button is clicked', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Generate diff first
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Mock the clipboard API
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
    
    // Click copy button
    copyDiffButton.click();
    
    // Verify clipboard API was called
    expect(writeTextSpy).toHaveBeenCalled();
    
    // Check that what's copied contains expected markers
    const copiedText = writeTextSpy.mock.calls[0][0];
    expect(copiedText).toContain('--- Original');
    expect(copiedText).toContain('+++ Modified');
  }));
  
  // Test: View mode changes
  test('should change diff format when view mode is changed', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Generate diff in default mode
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Store the initial HTML
    const initialHtml = diffOutput.innerHTML;
    
    // Change view mode to unified
    viewModeSelect.value = 'unified';
    viewModeSelect.dispatchEvent(new Event('change'));
    
    // Wait for the diff to be regenerated
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Verify that the diff changed
    expect(diffOutput.innerHTML).not.toBe(initialHtml);
  }));
  
  // Test: Toggle line numbers
  test('should toggle line numbers when Toggle Line Numbers button is clicked', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Generate diff with line numbers (default)
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line-number')
    );
    
    // Verify line numbers are present
    expect(diffOutput.innerHTML).toContain('diff-line-number');
    
    // Click toggle line numbers button
    toggleLineNumbersButton.click();
    
    // Wait for the diff to be regenerated
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Reset mock to check new calls
    mockDiffLines.mockClear();
    
    // Click compare button again to regenerate diff
    compareButton.click();
    
    // Wait for regeneration
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Check that the diff was regenerated
    expect(mockDiffLines).toHaveBeenCalled();
  }));
  
  // Test: Syntax highlighting
  test('should apply syntax highlighting based on selected language', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Set language
    languageSelect.value = 'javascript';
    
    // Generate diff
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Wait for highlighting to be applied (it happens with a setTimeout)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check that highlight.js was called
    expect(global.hljs.highlight).toHaveBeenCalled();
  }));
  
  // Test: Download diff
  test('should prepare download when Download button is clicked', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Generate diff
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Mock document.createElement to track link creation
    const originalCreateElement = document.createElement.bind(document);
    const createElementMock = jest.fn((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        // Prevent actual navigation
        jest.spyOn(element, 'click').mockImplementation(() => {});
      }
      return element;
    });
    document.createElement = createElementMock;
    
    // Click download button
    downloadDiffButton.click();
    
    // Check that URL.createObjectURL was called
    expect(URL.createObjectURL).toHaveBeenCalled();
    
    // Check that an anchor was created
    const aElements = createElementMock.mock.calls
      .filter(args => args[0] === 'a')
      .map(args => args[0]);
    
    expect(aElements.length).toBeGreaterThan(0);
    
    // Restore original createElement
    document.createElement = originalCreateElement;
  }));
  
  // Test: Error handling
  test('should handle errors during diff generation', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Make diff library throw an error
    mockDiffLines.mockImplementationOnce(() => {
      throw new Error('Mock diff error');
    });
    
    // Generate diff
    compareButton.click();
    
    // Wait for the error state to be shown
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('error-state')
    );
    
    // Verify error message is displayed
    expect(diffOutput.innerHTML).toContain('error-state');
    expect(diffOutput.innerHTML).toContain('Mock diff error');
  }));
  
  // Test: Cache functionality
  test('should use cached results for identical comparisons', withRetry(async () => {
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Generate diff first time
    compareButton.click();
    
    // Wait for the diff output to be populated
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Clear the mock call count
    mockDiffLines.mockClear();
    
    // Generate diff second time (should use cache)
    compareButton.click();
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // The diff library should not be called again
    expect(mockDiffLines).not.toHaveBeenCalled();
  }));
  
  // Test: Empty state handling
  test('should show empty state message when both inputs are empty', withRetry(async () => {
    // Clear both inputs
    originalCodeArea.value = '';
    modifiedCodeArea.value = '';
    
    // Click compare
    compareButton.click();
    
    // Check for empty state message
    expect(diffOutput.innerHTML).toContain('empty-state');
    expect(diffOutput.innerHTML).toContain('Enter code in both panels');
  }));
  
  // Test: Loading state
  test('should show loading state during diff calculation', withRetry(async () => {
    // Setup with a function that will introduce a delay
    const originalDiffLines = mockDiffLines;
    mockDiffLines.mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(originalDiffLines(sampleOriginalCode, sampleModifiedCode));
        }, 200);
      });
    });
    
    // Setup test data
    originalCodeArea.value = sampleOriginalCode;
    modifiedCodeArea.value = sampleModifiedCode;
    
    // Generate diff
    compareButton.click();
    
    // Immediately check for loading state
    expect(diffOutput.innerHTML).toContain('Calculating differences');
    
    // Wait for the diff to complete
    await waitForElementContent(
      diffOutput,
      el => el.innerHTML.includes('diff-line')
    );
    
    // Now it should show the diff
    expect(diffOutput.innerHTML).toContain('diff-line');
  }));
}); 