document.addEventListener('DOMContentLoaded', function() {
  const jsonInput = document.getElementById('json-input');
  const jsonOutput = document.getElementById('json-output');
  const formatButton = document.getElementById('format-button');
  const minifyButton = document.getElementById('minify-button');
  const clearButton = document.getElementById('clear-button');
  const copyButton = document.getElementById('copy-button');
  const validationStatus = document.getElementById('validation-status');
  const inputContainer = document.getElementById('json-input-container');
  const outputContainer = document.getElementById('json-output-container');
  
  // Sample JSON to help users get started
  const sampleJson = {
    "name": "JSON Formatter",
    "description": "A tool to format and validate JSON",
    "features": [
      "Pretty printing",
      "JSON validation",
      "Minification"
    ],
    "isAwesome": true,
    "version": 1.0
  };
  
  // Initialize with sample
  jsonInput.value = JSON.stringify(sampleJson, null, 2);
  formatJson();
  
  // Format JSON button click
  formatButton.addEventListener('click', function() {
    // Ensure output container is visible when formatting
    if (outputContainer.style.display === 'none') {
      const toggleBtn = document.querySelector('[data-target="json-output-container"]');
      toggleBtn.click();
    }
    formatJson();
  });
  
  // Minify JSON button click
  minifyButton.addEventListener('click', function() {
    // Ensure output container is visible when minifying
    if (outputContainer.style.display === 'none') {
      const toggleBtn = document.querySelector('[data-target="json-output-container"]');
      toggleBtn.click();
    }
    minifyJson();
  });
  
  // Clear button click
  clearButton.addEventListener('click', function() {
    jsonInput.value = '';
    jsonOutput.textContent = '';
    validationStatus.textContent = '';
    validationStatus.classList.remove('valid', 'invalid');
  });
  
  // Copy button click
  copyButton.addEventListener('click', function() {
    if (jsonOutput.textContent) {
      navigator.clipboard.writeText(jsonOutput.textContent)
        .then(() => {
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  });
  
  // Auto-format on input with debounce
  let debounceTimeout;
  jsonInput.addEventListener('input', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(function() {
      if (jsonInput.value.trim()) {
        formatJson();
      } else {
        jsonOutput.textContent = '';
        validationStatus.textContent = '';
        validationStatus.classList.remove('valid', 'invalid');
      }
    }, 500);
  });
  
  // Function to format JSON
  function formatJson() {
    try {
      const input = jsonInput.value.trim();
      if (!input) {
        jsonOutput.textContent = '';
        validationStatus.textContent = '';
        validationStatus.classList.remove('valid', 'invalid');
        return;
      }
      
      // Parse and re-stringify with indentation
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      
      // Apply syntax highlighting
      jsonOutput.textContent = formatted;
      applyHighlighting();
      
      // Show valid status
      validationStatus.textContent = '✓ Valid JSON';
      validationStatus.classList.add('valid');
      validationStatus.classList.remove('invalid');
    } catch (error) {
      // Show error
      jsonOutput.textContent = error.message;
      validationStatus.textContent = '✗ Invalid JSON';
      validationStatus.classList.add('invalid');
      validationStatus.classList.remove('valid');
    }
  }
  
  // Function to minify JSON
  function minifyJson() {
    try {
      const input = jsonInput.value.trim();
      if (!input) return;
      
      // Parse and re-stringify without indentation
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      
      // Display minified JSON
      jsonOutput.textContent = minified;
      
      // Show valid status
      validationStatus.textContent = '✓ Valid JSON (Minified)';
      validationStatus.classList.add('valid');
      validationStatus.classList.remove('invalid');
    } catch (error) {
      // Show error
      jsonOutput.textContent = error.message;
      validationStatus.textContent = '✗ Invalid JSON';
      validationStatus.classList.add('invalid');
      validationStatus.classList.remove('valid');
    }
  }
  
  // Simple syntax highlighting
  function applyHighlighting() {
    // This is a simple version
    // For production, consider using a library like highlight.js
    // This is beyond the scope of our simple implementation
  }
}); 