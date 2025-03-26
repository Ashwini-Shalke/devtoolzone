/**
 * XML Formatter Tool - Advanced implementation with caching for improved performance
 */
(function() {
  // DOM elements cache
  let elements = {};
  
  // State variables
  let showLineNumbers = true;
  let formattingCache = {}; // Cache for previously formatted XML
  let resizeObserver;
  
  // Sample XML to populate on first load
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
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

  // Initialize the formatter
  function init() {
    console.log("Initializing XML formatter...");
    try {
      // Cache all DOM elements to improve performance
      cacheElements();
      
      // Make sure layout is stable before proceeding
      stabilizeLayout(function() {
        // Setup event listeners
        setupEventListeners();
        
        // Load history and templates
        loadHistory();
        loadTemplates();
        
        // Add sample XML if input is empty
        if (elements.xmlInput && !elements.xmlInput.value.trim()) {
          elements.xmlInput.value = sampleXml;
        }
        
        // Format the XML
        formatXml();
        
        // Setup resize observer for responsive layout
        setupResizeObserver();
        
        // Show the formatter container by adding the loaded class
        const formatterContainer = document.querySelector('.xml-formatter-container');
        if (formatterContainer) {
          formatterContainer.classList.add('loaded');
        }
      });
    } catch (error) {
      console.error("Error initializing XML formatter:", error);
      // Remove loading class to prevent UI being stuck in loading state
      document.documentElement.classList.remove('loading');
    }
  }

  // Cache DOM elements for better performance
  function cacheElements() {
    elements = {
      xmlInput: document.getElementById('xml-input'),
      xmlOutput: document.getElementById('xml-output'),
      xmlMode: document.getElementById('xml-mode'),
      indentSize: document.getElementById('indent-size'),
      formatButton: document.getElementById('format-button'),
      clearButton: document.getElementById('clear-button'),
      copyButton: document.getElementById('copy-button'),
      downloadButton: document.getElementById('download-button'),
      newlineElements: document.getElementById('newline-elements'),
      preserveComments: document.getElementById('preserve-comments'),
      lineNumbersToggle: document.getElementById('toggle-line-numbers'),
      statusMessage: document.getElementById('status-message'),
      validationResults: document.getElementById('validation-results'),
      elementsAnalysis: document.getElementById('toggle-analysis'),
      elementsListContainer: document.getElementById('elements-list'),
      treeDiagramContainer: document.getElementById('tree-diagram'),
      inputOutputContainer: document.querySelector('.input-output-container'),
      inputSection: document.querySelector('.input-section'),
      outputSection: document.querySelector('.output-section'),
      historySelect: document.getElementById('history-select'),
      templateSelect: document.getElementById('template-select'),
      saveTemplateButton: document.getElementById('save-template-button')
    };

    // Check for required elements to avoid null references
    const requiredElements = ['xmlInput', 'xmlOutput', 'inputOutputContainer', 'inputSection', 'outputSection'];
    for (const element of requiredElements) {
      if (!elements[element]) {
        console.error(`Required element ${element} not found in the DOM`);
      }
    }
  }

  // Ensure layout stability before proceeding
  function stabilizeLayout(callback) {
    // If we can't find the containers, try again after a short delay
    if (!elements.inputOutputContainer || !elements.inputSection || !elements.outputSection) {
      setTimeout(function() {
        cacheElements();
        stabilizeLayout(callback);
      }, 50);
      return;
    }
    
    // Only manually adjust widths on desktop
    if (window.innerWidth > 768) {
      // Get the full container width
      const containerWidth = elements.inputOutputContainer.clientWidth;
      const halfWidth = Math.floor(containerWidth / 2) + 'px';
      
      // Set both sections to exactly half the container width
      elements.inputSection.style.width = halfWidth;
      elements.outputSection.style.width = halfWidth;
      
      // Make sure the input and output areas fill their containers
      if (elements.xmlInput) elements.xmlInput.style.width = '100%';
      if (elements.xmlOutput) elements.xmlOutput.style.width = '100%';
    }
    
    // Show the container now that we've stabilized the layout
    document.documentElement.classList.remove('loading');
    
    // Wait a bit more to ensure rendering completes before proceeding
    setTimeout(callback, 100);
  }

  // Setup all event listeners
  function setupEventListeners() {
    // Format XML when format button is clicked
    if (elements.formatButton) {
      elements.formatButton.addEventListener('click', formatXml, { passive: true });
    }
    
    // Format XML when input changes (with debounce)
    if (elements.xmlInput) {
      elements.xmlInput.addEventListener('input', debounce(formatXml, 600), { passive: true });
    }
    
    // Clear the formatter when clear button is clicked
    if (elements.clearButton) {
      elements.clearButton.addEventListener('click', clearFormatter, { passive: true });
    }
    
    // Copy formatted XML when copy button is clicked
    if (elements.copyButton) {
      elements.copyButton.addEventListener('click', copyFormattedXml, { passive: true });
    }
    
    // Download formatted XML when download button is clicked
    if (elements.downloadButton) {
      elements.downloadButton.addEventListener('click', downloadFormattedXml, { passive: true });
    }
    
    // Toggle line numbers
    if (elements.lineNumbersToggle) {
      elements.lineNumbersToggle.addEventListener('click', function() {
        showLineNumbers = !showLineNumbers;
        if (elements.xmlOutput && elements.xmlOutput.innerHTML) {
          applyLineNumbers(elements.xmlOutput.innerHTML);
        }
      }, { passive: true });
    }
    
    // Options change handlers
    const optionElements = [
      elements.xmlMode,
      elements.indentSize,
      elements.newlineElements,
      elements.preserveComments
    ];
    
    optionElements.forEach(element => {
      if (element) {
        element.addEventListener('change', formatXml, { passive: true });
      }
    });
    
    // Toggle elements analysis
    if (elements.elementsAnalysis) {
      elements.elementsAnalysis.addEventListener('click', toggleElementsAnalysis, { passive: true });
    }
    
    // History selection
    if (elements.historySelect) {
      elements.historySelect.addEventListener('change', function() {
        const selectedValue = elements.historySelect.value;
        if (selectedValue) {
          const history = JSON.parse(localStorage.getItem('xmlFormatterHistory') || '[]');
          const historyItem = history.find(item => item.timestamp.toString() === selectedValue);
          
          if (historyItem && elements.xmlInput) {
            elements.xmlInput.value = historyItem.original;
            formatXml();
          }
        }
      }, { passive: true });
    }
    
    // Template selection
    if (elements.templateSelect) {
      elements.templateSelect.addEventListener('change', function() {
        const selectedValue = elements.templateSelect.value;
        if (selectedValue) {
          const templates = JSON.parse(localStorage.getItem('xmlFormatterTemplates') || '{}');
          const template = templates[selectedValue];
          
          if (template) {
            // Apply template settings
            if (elements.xmlMode) elements.xmlMode.value = template.mode;
            if (elements.indentSize) elements.indentSize.value = template.indentSize;
            if (elements.newlineElements) elements.newlineElements.checked = template.newlineElements;
            if (elements.preserveComments) elements.preserveComments.checked = template.preserveComments;
            
            // Apply formatting with new settings
            formatXml();
          }
        }
      }, { passive: true });
    }
    
    // Save template button
    if (elements.saveTemplateButton) {
      elements.saveTemplateButton.addEventListener('click', function() {
        saveTemplate();
      }, { passive: true });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Ctrl+Enter or Cmd+Enter to format
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        formatXml();
      }
      
      // Ctrl+Shift+C or Cmd+Shift+C to copy
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyFormattedXml();
      }
      
      // Ctrl+Shift+X or Cmd+Shift+X to clear
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        clearFormatter();
      }
    });
  }
  
  // Debounce function to limit the rate at which a function is executed
  function debounce(func, wait) {
    let timeout;
    let cancelFunction;
    
    const debounced = function() {
      const context = this;
      const args = arguments;
      
      const later = function() {
        timeout = null;
        func.apply(context, args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      // Return cancel function
      return cancelFunction;
    };
    
    // Add ability to cancel
    cancelFunction = function() {
      clearTimeout(timeout);
    };
    
    debounced.cancel = cancelFunction;
    
    return debounced;
  }

  // Format XML based on selected options
  function formatXml() {
    if (!elements.xmlInput || !elements.xmlOutput) return;
    
    const xmlText = elements.xmlInput.value.trim();
    if (!xmlText) {
      elements.xmlOutput.innerHTML = '';
      updateStatus('', false);
      return;
    }
    
    try {
      // Parse XML to check validity
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check if parsing was successful
      const isValid = !xmlDoc.getElementsByTagName('parsererror').length;
      
      // Format the XML based on the selected mode
      let formattedXml = '';
      
      const formatMode = elements.xmlMode ? elements.xmlMode.value : 'format';
      const indentSize = elements.indentSize ? parseInt(elements.indentSize.value, 10) : 2;
      const newlineElements = elements.newlineElements ? elements.newlineElements.checked : false;
      const preserveComments = elements.preserveComments ? elements.preserveComments.checked : true;
      
      if (formatMode === 'minify') {
        formattedXml = formatMinifiedXml(xmlText, preserveComments);
      } else {
        formattedXml = formatPrettyXml(xmlText, indentSize, preserveComments, newlineElements);
      }
      
      // Apply syntax highlighting
      const highlightedXml = applyHighlighting(formattedXml);
      
      // Display the formatted XML
      elements.xmlOutput.innerHTML = highlightedXml;
      
      // Apply line numbers if enabled
      if (showLineNumbers) {
        applyLineNumbers(highlightedXml);
      }
      
      // Update status message
      updateStatus(isValid ? 'Valid XML' : 'Invalid XML', isValid);
      
      // Update analysis if it's visible
      if (isValid && elements.elementsListContainer && elements.elementsListContainer.style.display !== 'none') {
        analyzeXmlElements(xmlText);
      }
      
      // Ensure equal widths after formatting
      setTimeout(function() {
        if (elements.inputSection && elements.outputSection && window.innerWidth > 768) {
          const containerWidth = elements.inputOutputContainer.clientWidth;
          const halfWidth = Math.floor(containerWidth / 2) + 'px';
          
          elements.inputSection.style.width = halfWidth;
          elements.outputSection.style.width = halfWidth;
        }
      }, 50);
      
      // Save to history
      saveToHistory(xmlText, formattedXml);
    } catch (error) {
      console.error("Error formatting XML:", error);
      elements.xmlOutput.textContent = `Error: ${error.message}`;
      updateStatus('Invalid XML', false);
    }
  }
  
  // Format XML with pretty printing
  function formatPrettyXml(xml, spaces, preserveComments, newlineElements) {
    if (!xml) return '';
    
    try {
      // Replace tabs with spaces for consistent indentation
      let formatted = '';
      const indent = ' '.repeat(spaces);
      const lines = xml.replace(/\t/g, indent).split('\n');
      
      // Remove comments if not preserving them
      let filtered = lines;
      if (!preserveComments) {
        filtered = lines.filter(line => !line.trim().startsWith('<!--') && !line.trim().includes('-->'));
      }
      
      // Join lines back and format
      formatted = filtered.join('\n');
      
      return formatted;
    } catch (error) {
      console.error("Error in formatPrettyXml:", error);
      return xml; // Return original if formatting fails
    }
  }
  
  // Format XML in minified mode
  function formatMinifiedXml(xml, preserveComments) {
    if (!xml) return '';
    
    try {
      // Minify XML by removing whitespace between tags
      let minified = xml
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .replace(/\s+</g, '<')   // Remove whitespace before opening tags
        .replace(/>\s+/g, '>')   // Remove whitespace after closing tags
        .trim();
      
      // Remove comments if not preserving them
      if (!preserveComments) {
        minified = minified.replace(/<!--[\s\S]*?-->/g, '');
      }
      
      return minified;
    } catch (error) {
      console.error("Error in formatMinifiedXml:", error);
      return xml; // Return original if minification fails
    }
  }
  
  // Apply syntax highlighting to XML
  function applyHighlighting(xml) {
    if (!xml) return '';
    
    try {
      // Simple highlighting: escape HTML and highlight different parts
      const escaped = xml
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      
      // Highlight tags, attributes, and values
      return escaped
        // XML declarations
        .replace(/&lt;\?[\s\S]*?\?&gt;/g, '<span class="xml-declaration">$&</span>')
        // Opening tags with attributes
        .replace(/&lt;([^\/!\?][^>]*?)&gt;/g, function(match, p1) {
          return '<span class="xml-tag">&lt;' + 
            p1.replace(/([^\s=]+)=(&quot;.*?&quot;)/g, '<span class="xml-attr">$1</span>=<span class="xml-value">$2</span>') + 
            '&gt;</span>';
        })
        // Closing tags
        .replace(/&lt;\/([^>]+)&gt;/g, '<span class="xml-tag">&lt;/$1&gt;</span>')
        // Self-closing tags
        .replace(/&lt;([^\/!\?][^>]*?)\/&gt;/g, function(match, p1) {
          return '<span class="xml-tag">&lt;' + 
            p1.replace(/([^\s=]+)=(&quot;.*?&quot;)/g, '<span class="xml-attr">$1</span>=<span class="xml-value">$2</span>') + 
            '/&gt;</span>';
        })
        // Comments
        .replace(/&lt;!--[\s\S]*?--&gt;/g, '<span class="xml-comment">$&</span>');
    } catch (error) {
      console.error("Error in applyHighlighting:", error);
      return xml; // Return original if highlighting fails
    }
  }
  
  // Apply line numbers to the formatted output
  function applyLineNumbers(highlightedXml) {
    if (!elements.xmlOutput) return;
    
    try {
      if (showLineNumbers) {
        const lines = highlightedXml.split('\n');
        let numberedXml = '<table class="line-numbers-table"><tbody>';
        
        for (let i = 0; i < lines.length; i++) {
          numberedXml += `
            <tr>
              <td class="line-number">${i + 1}</td>
              <td class="line-content">${lines[i] || ' '}</td>
            </tr>
          `;
        }
        
        numberedXml += '</tbody></table>';
        elements.xmlOutput.innerHTML = numberedXml;
      } else {
        // If line numbers are disabled, just use the highlighted XML
        elements.xmlOutput.innerHTML = highlightedXml;
      }
    } catch (error) {
      console.error("Error in applyLineNumbers:", error);
      // Just set the content without line numbers if there's an error
      elements.xmlOutput.innerHTML = highlightedXml;
    }
  }
  
  // Update status message
  function updateStatus(message, isValid) {
    if (!elements.validationResults) return;
    
    elements.validationResults.innerHTML = '';
    if (!isValid && message === 'Invalid XML') {
      elements.validationResults.innerHTML = '<div class="validation-error">✗ XML is not well-formed. Please check for errors.</div>';
    } else if (isValid) {
      elements.validationResults.innerHTML = '<div class="validation-success">✓ XML is well-formed.</div>';
    }
  }
  
  // Analyze XML elements and show tree structure
  function analyzeXmlElements(xmlText) {
    if (!xmlText || !elements.elementsListContainer || !elements.treeDiagramContainer) return;
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check if parsing was successful
      if (xmlDoc.getElementsByTagName('parsererror').length) {
        return;
      }
      
      // Count elements
      const elementCounts = {};
      const countElements = function(node) {
        if (node.nodeType === 1) { // ELEMENT_NODE
          const tagName = node.tagName;
          elementCounts[tagName] = (elementCounts[tagName] || 0) + 1;
          
          // Process child nodes
          for (let i = 0; i < node.childNodes.length; i++) {
            countElements(node.childNodes[i]);
          }
        }
      };
      
      // Start counting from the document element
      if (xmlDoc.documentElement) {
        countElements(xmlDoc.documentElement);
      }
      
      // Display element counts
      let elementsHtml = '<h3>Element Counts</h3><ul class="elements-list">';
      for (const element in elementCounts) {
        elementsHtml += `<li><span class="element-name">${element}</span>: <span class="element-count">${elementCounts[element]}</span></li>`;
      }
      elementsHtml += '</ul>';
      
      elements.elementsListContainer.innerHTML = elementsHtml;
      
      // Generate tree diagram
      let treeHtml = '<h3>XML Structure</h3><div class="tree-diagram">';
      if (xmlDoc.documentElement) {
        treeHtml += generateTree(xmlDoc.documentElement);
      }
      treeHtml += '</div>';
      
      elements.treeDiagramContainer.innerHTML = treeHtml;
    } catch (error) {
      console.error('Error analyzing XML:', error);
    }
  }
  
  // Generate tree structure for XML
  function generateTree(node, depth = 0) {
    if (node.nodeType !== 1) return ''; // Skip non-element nodes
    
    const indent = '  '.repeat(depth);
    let tree = `${indent}<div class="tree-node">`;
    tree += `<span class="tree-element">${node.tagName}</span>`;
    
    // Add attributes if any
    if (node.attributes.length) {
      tree += '<span class="tree-attrs">';
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        tree += `<span class="tree-attr-pair"><span class="tree-attr-name">${attr.name}</span>=<span class="tree-attr-value">"${attr.value}"</span></span>`;
      }
      tree += '</span>';
    }
    
    // Process child element nodes
    let hasChildElements = false;
    for (let i = 0; i < node.childNodes.length; i++) {
      if (node.childNodes[i].nodeType === 1) {
        hasChildElements = true;
        break;
      }
    }
    
    if (hasChildElements) {
      tree += '<div class="tree-children">';
      for (let i = 0; i < node.childNodes.length; i++) {
        tree += generateTree(node.childNodes[i], depth + 1);
      }
      tree += `</div>`;
    }
    
    tree += `</div>`;
    return tree;
  }
  
  // Toggle elements analysis visibility
  function toggleElementsAnalysis() {
    if (!elements.elementsListContainer || !elements.treeDiagramContainer) return;
    
    const analysisContent = document.querySelector('.analysis-content');
    if (!analysisContent) return;
    
    const isHidden = analysisContent.style.display === 'none';
    
    analysisContent.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
      // Generate analysis if we have valid XML
      analyzeXmlElements(elements.xmlInput.value);
    }
  }
  
  // Clear the formatter
  function clearFormatter() {
    if (!elements.xmlInput || !elements.xmlOutput) return;
    
    elements.xmlInput.value = '';
    elements.xmlOutput.innerHTML = '';
    
    // Clear status and analysis
    updateStatus('', false);
    if (elements.elementsListContainer) elements.elementsListContainer.innerHTML = '';
    if (elements.treeDiagramContainer) elements.treeDiagramContainer.innerHTML = '';
  }
  
  // Copy formatted XML to clipboard
  function copyFormattedXml() {
    if (!elements.xmlOutput) return;
    
    try {
      // Get text content without HTML
      const outputText = elements.xmlOutput.textContent || '';
      
      // Use Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(outputText)
          .then(() => {
            showCopyMessage('Copied to clipboard!');
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            showCopyMessage('Failed to copy');
          });
      } else {
        // Fallback copy method
        const textArea = document.createElement('textarea');
        textArea.value = outputText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = 0;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          showCopyMessage(successful ? 'Copied to clipboard!' : 'Failed to copy');
        } catch (err) {
          console.error('Failed to copy: ', err);
          showCopyMessage('Failed to copy');
        }
        
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error("Error copying XML:", error);
    }
  }
  
  // Show a temporary message after copying
  function showCopyMessage(message) {
    // Create message element if it doesn't exist
    let messageElement = document.getElementById('copy-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.id = 'copy-message';
      messageElement.style.position = 'fixed';
      messageElement.style.bottom = '20px';
      messageElement.style.left = '50%';
      messageElement.style.transform = 'translateX(-50%)';
      messageElement.style.padding = '8px 16px';
      messageElement.style.backgroundColor = '#333';
      messageElement.style.color = 'white';
      messageElement.style.borderRadius = '4px';
      messageElement.style.zIndex = '9999';
      messageElement.style.opacity = '0';
      messageElement.style.transition = 'opacity 0.3s';
      document.body.appendChild(messageElement);
    }
    
    messageElement.textContent = message;
    messageElement.style.opacity = '1';
    
    // Hide after 2 seconds
    setTimeout(() => {
      messageElement.style.opacity = '0';
    }, 2000);
  }
  
  // Download formatted XML as a file
  function downloadFormattedXml() {
    if (!elements.xmlOutput) return;
    
    try {
      // Get text content without HTML
      const outputText = elements.xmlOutput.textContent || '';
      if (!outputText.trim()) return;
      
      // Create download link
      const blob = new Blob([outputText], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = 'formatted_xml.xml';
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading XML:", error);
    }
  }
  
  // Setup ResizeObserver for dynamic layout adjustments
  function setupResizeObserver() {
    try {
      if (window.ResizeObserver) {
        // Use ResizeObserver for efficient resize handling
        resizeObserver = new ResizeObserver(debounce(function(entries) {
          if (!entries || !entries[0]) return;
          
          // Re-stabilize layout when container size changes
          if (window.innerWidth > 768) {
            const containerWidth = elements.inputOutputContainer.clientWidth;
            const halfWidth = Math.floor(containerWidth / 2) + 'px';
            
            elements.inputSection.style.width = halfWidth;
            elements.outputSection.style.width = halfWidth;
          } else {
            // Reset to full width on mobile
            elements.inputSection.style.width = '100%';
            elements.outputSection.style.width = '100%';
          }
        }, 100));
        
        if (elements.inputOutputContainer) {
          resizeObserver.observe(elements.inputOutputContainer);
        }
      } else {
        // Fallback for browsers without ResizeObserver
        window.addEventListener('resize', debounce(function() {
          if (window.innerWidth > 768) {
            const containerWidth = elements.inputOutputContainer.clientWidth;
            const halfWidth = Math.floor(containerWidth / 2) + 'px';
            
            elements.inputSection.style.width = halfWidth;
            elements.outputSection.style.width = halfWidth;
          } else {
            elements.inputSection.style.width = '100%';
            elements.outputSection.style.width = '100%';
          }
        }, 100), { passive: true });
      }
    } catch (error) {
      console.error("Error setting up ResizeObserver:", error);
    }
  }
  
  // Clean up resources
  function cleanup() {
    try {
      // Disconnect ResizeObserver if it was created
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      // Clear any debounced functions
      if (formatXml.cancel) formatXml.cancel();
      
      // Clear cache
      formattingCache = {};
    } catch (error) {
      console.error("Error in cleanup:", error);
    }
  }
  
  // Save to history
  function saveToHistory(originalXml, formattedXml) {
    if (!originalXml || !formattedXml) return;
    
    try {
      const history = JSON.parse(localStorage.getItem('xmlFormatterHistory') || '[]');
      
      // Create a new history entry
      const entry = {
        timestamp: Date.now(),
        original: originalXml,
        formatted: formattedXml,
        preview: originalXml.substring(0, 50) + (originalXml.length > 50 ? '...' : '')
      };
      
      // Check if this XML is already in history
      const isDuplicate = history.some(item => 
        item.original === originalXml || item.preview === entry.preview);
      
      // Only add if it's not a duplicate
      if (!isDuplicate) {
        // Add to the beginning of the array
        history.unshift(entry);
        
        // Keep only the last 10 entries
        if (history.length > 10) {
          history.pop();
        }
        
        // Save back to localStorage
        localStorage.setItem('xmlFormatterHistory', JSON.stringify(history));
        
        // Update history dropdown
        updateHistoryDropdown();
      }
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  }
  
  // Update history dropdown
  function updateHistoryDropdown() {
    if (!elements.historySelect) return;
    
    try {
      const history = JSON.parse(localStorage.getItem('xmlFormatterHistory') || '[]');
      
      // Clear existing options except the default
      while (elements.historySelect.options.length > 1) {
        elements.historySelect.remove(1);
      }
      
      // Add history entries to dropdown
      history.forEach(entry => {
        const option = document.createElement('option');
        option.value = entry.timestamp;
        
        // Create a formatted date string
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleString();
        
        option.text = `${dateStr} - ${entry.preview}`;
        elements.historySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error updating history dropdown:", error);
    }
  }
  
  // Load history from localStorage
  function loadHistory() {
    try {
      updateHistoryDropdown();
    } catch (error) {
      console.error("Error loading history:", error);
    }
  }
  
  // Save template
  function saveTemplate() {
    try {
      // Prompt for template name
      const templateName = prompt('Enter a name for this template:');
      if (!templateName || !templateName.trim()) return;
      
      // Get current settings
      const templateSettings = {
        mode: elements.xmlMode ? elements.xmlMode.value : 'format',
        indentSize: elements.indentSize ? elements.indentSize.value : '2',
        newlineElements: elements.newlineElements ? elements.newlineElements.checked : false,
        preserveComments: elements.preserveComments ? elements.preserveComments.checked : true
      };
      
      // Save template to localStorage
      const templates = JSON.parse(localStorage.getItem('xmlFormatterTemplates') || '{}');
      templates[templateName] = templateSettings;
      localStorage.setItem('xmlFormatterTemplates', JSON.stringify(templates));
      
      // Update templates dropdown
      updateTemplatesDropdown();
      
      // Show confirmation
      showCopyMessage('Template saved!');
    } catch (error) {
      console.error("Error saving template:", error);
    }
  }
  
  // Update templates dropdown
  function updateTemplatesDropdown() {
    if (!elements.templateSelect) return;
    
    try {
      const templates = JSON.parse(localStorage.getItem('xmlFormatterTemplates') || '{}');
      
      // Clear existing options except the default
      while (elements.templateSelect.options.length > 1) {
        elements.templateSelect.remove(1);
      }
      
      // Add template entries to dropdown
      for (const templateName in templates) {
        const option = document.createElement('option');
        option.value = templateName;
        option.text = templateName;
        elements.templateSelect.appendChild(option);
      }
    } catch (error) {
      console.error("Error updating templates dropdown:", error);
    }
  }
  
  // Load templates from localStorage
  function loadTemplates() {
    try {
      updateTemplatesDropdown();
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  }
  
  // Set up cleanup on page unload
  window.addEventListener('unload', cleanup);
  
  // Start the formatter once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 