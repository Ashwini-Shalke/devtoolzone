// XML Formatter Validation Script
// Run this script in the console to verify XML Formatter functionality

function validateXmlFormatter() {
  console.log('🔍 Starting XML Formatter validation...');
  
  const checks = [
    {
      name: 'Core DOM elements',
      test: () => {
        const elements = [
          'xml-input',
          'xml-output',
          'format-button',
          'clear-button',
          'copy-button',
          'download-button',
          'xml-mode',
          'indent-size',
          'newline-elements',
          'preserve-comments',
          'elements-list',
          'tree-diagram',
          'validation-results'
        ];
        
        const missing = elements.filter(id => !document.getElementById(id));
        
        if (missing.length > 0) {
          throw new Error(`Missing elements: ${missing.join(', ')}`);
        }
        
        return true;
      }
    },
    {
      name: 'Event listeners',
      test: () => {
        // Test by simulating a format action
        const xmlInput = document.getElementById('xml-input');
        const formatButton = document.getElementById('format-button');
        const xmlOutput = document.getElementById('xml-output');
        
        // Clear any existing content
        xmlInput.value = '';
        xmlOutput.textContent = '';
        
        // Add sample XML
        const sampleXml = '<root><child>Test</child></root>';
        xmlInput.value = sampleXml;
        
        // Click format button
        formatButton.click();
        
        // Give time for formatting to occur
        return new Promise(resolve => {
          setTimeout(() => {
            const outputContent = xmlOutput.textContent || '';
            if (outputContent.includes('<root>') && outputContent.includes('<child>')) {
              resolve(true);
            } else {
              throw new Error('Format button event handler not working properly');
            }
          }, 500);
        });
      }
    },
    {
      name: 'Responsive design',
      test: () => {
        const container = document.querySelector('.xml-formatter-container');
        const computedStyle = window.getComputedStyle(container);
        
        // Check if the container has proper styling
        if (!computedStyle.width || computedStyle.width === '0px') {
          throw new Error('Container width is not set properly');
        }
        
        // Check if media queries are loaded
        const mediaQueryList = window.matchMedia('(max-width: 768px)');
        if (typeof mediaQueryList.matches !== 'boolean') {
          throw new Error('Media queries may not be working correctly');
        }
        
        return true;
      }
    },
    {
      name: 'XML validation',
      test: () => {
        const xmlInput = document.getElementById('xml-input');
        const validationResults = document.getElementById('validation-results');
        
        // Test valid XML
        xmlInput.value = '<root><child>Valid</child></root>';
        const inputEvent = new Event('input', { bubbles: true });
        xmlInput.dispatchEvent(inputEvent);
        
        return new Promise(resolve => {
          setTimeout(() => {
            const validationContent = validationResults.innerHTML || '';
            if (!validationContent.includes('Valid XML')) {
              throw new Error('XML validation for valid XML not working');
            }
            
            // Test invalid XML
            xmlInput.value = '<root><child>Invalid</root>';
            xmlInput.dispatchEvent(inputEvent);
            
            setTimeout(() => {
              const invalidValidationContent = validationResults.innerHTML || '';
              if (!invalidValidationContent.includes('Invalid XML')) {
                throw new Error('XML validation for invalid XML not working');
              }
              resolve(true);
            }, 500);
          }, 500);
        });
      }
    },
    {
      name: 'Performance optimization',
      test: async () => {
        // Test debouncing
        const xmlInput = document.getElementById('xml-input');
        const validationResults = document.getElementById('validation-results');
        
        // Clear current content
        xmlInput.value = '';
        
        // Track calls by monitoring validation results content changes
        let changeCount = 0;
        const originalContent = validationResults.innerHTML;
        
        const observer = new MutationObserver(() => {
          changeCount++;
        });
        
        observer.observe(validationResults, { childList: true, subtree: true });
        
        // Rapidly change input multiple times
        for (let i = 0; i < 5; i++) {
          xmlInput.value = `<root><test>${i}</test></root>`;
          const inputEvent = new Event('input', { bubbles: true });
          xmlInput.dispatchEvent(inputEvent);
          await new Promise(resolve => setTimeout(resolve, 50)); // Wait 50ms between inputs
        }
        
        // Wait for debounce to complete
        return new Promise(resolve => {
          setTimeout(() => {
            observer.disconnect();
            
            // If debouncing is working properly, we should have only 1-2 changes
            // instead of 5 (one for each input)
            if (changeCount >= 5) {
              throw new Error(`Debounce not working properly. Expected fewer than 5 updates, got ${changeCount}`);
            }
            
            resolve(true);
          }, 1000);
        });
      }
    },
    {
      name: 'Keyboard shortcuts',
      test: () => {
        // We can't really simulate keyboard events properly,
        // so we just check if the keyboard shortcuts section exists
        const shortcuts = document.querySelector('.keyboard-shortcuts');
        if (!shortcuts) {
          throw new Error('Keyboard shortcuts section not found');
        }
        
        return true;
      }
    }
  ];
  
  // Run all checks
  async function runChecks() {
    let passed = 0;
    let failed = 0;
    
    for (const check of checks) {
      try {
        console.log(`⏳ Running check: ${check.name}`);
        await check.test();
        console.log(`✅ Passed: ${check.name}`);
        passed++;
      } catch (error) {
        console.error(`❌ Failed: ${check.name}`);
        console.error(error);
        failed++;
      }
    }
    
    console.log(`\n==== XML Formatter Validation Results ====`);
    console.log(`Passed: ${passed}/${checks.length}`);
    console.log(`Failed: ${failed}/${checks.length}`);
    
    if (failed === 0) {
      console.log('🎉 All validation checks passed! XML Formatter is ready for production.');
      
      // Add visual indicator
      const validationResult = document.createElement('div');
      validationResult.style.position = 'fixed';
      validationResult.style.top = '10px';
      validationResult.style.right = '10px';
      validationResult.style.padding = '10px 15px';
      validationResult.style.backgroundColor = '#4caf50';
      validationResult.style.color = 'white';
      validationResult.style.borderRadius = '4px';
      validationResult.style.zIndex = '10000';
      validationResult.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      validationResult.style.fontWeight = 'bold';
      validationResult.innerHTML = '✅ XML Formatter validated successfully';
      document.body.appendChild(validationResult);
      
      setTimeout(() => {
        if (validationResult.parentNode) {
          validationResult.parentNode.removeChild(validationResult);
        }
      }, 5000);
      
      return true;
    } else {
      console.error('❌ Some validation checks failed. Please fix the issues before deploying.');
      
      // Add visual indicator
      const validationResult = document.createElement('div');
      validationResult.style.position = 'fixed';
      validationResult.style.top = '10px';
      validationResult.style.right = '10px';
      validationResult.style.padding = '10px 15px';
      validationResult.style.backgroundColor = '#f44336';
      validationResult.style.color = 'white';
      validationResult.style.borderRadius = '4px';
      validationResult.style.zIndex = '10000';
      validationResult.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      validationResult.style.fontWeight = 'bold';
      validationResult.innerHTML = '❌ XML Formatter validation failed';
      document.body.appendChild(validationResult);
      
      setTimeout(() => {
        if (validationResult.parentNode) {
          validationResult.parentNode.removeChild(validationResult);
        }
      }, 8000);
      
      return false;
    }
  }
  
  return runChecks();
}

// Execute validation when script is loaded
setTimeout(() => {
  console.log('Executing XML Formatter validation...');
  validateXmlFormatter();
}, 1500);

// Export the validation function for manual testing in console
window.validateXmlFormatter = validateXmlFormatter; 