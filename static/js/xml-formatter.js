document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const xmlInput = document.getElementById('xml-input');
  const xmlOutput = document.getElementById('xml-output');
  const formatButton = document.getElementById('format-button');
  const clearButton = document.getElementById('clear-button');
  const copyButton = document.getElementById('copy-button');
  const downloadButton = document.getElementById('download-button');
  const modeSelect = document.getElementById('xml-mode');
  const indentSelect = document.getElementById('indent-size');
  const newlineElementsCheckbox = document.getElementById('newline-elements');
  const preserveCommentsCheckbox = document.getElementById('preserve-comments');
  const historySelect = document.getElementById('history-select');
  const templateSelect = document.getElementById('template-select');
  const saveTemplateButton = document.getElementById('save-template-button');
  const toggleLineNumbersButton = document.getElementById('toggle-line-numbers');
  const toggleAnalysisButton = document.getElementById('toggle-analysis');
  const templateModal = document.getElementById('template-modal');
  const templateNameInput = document.getElementById('template-name');
  const saveTemplateConfirmButton = document.getElementById('save-template-confirm');
  const cancelTemplateButton = document.getElementById('cancel-template');
  const closeModalButton = document.querySelector('.close-modal');
  const xmlAnalysisSection = document.getElementById('xml-analysis');
  const elementsListContainer = document.getElementById('elements-list');
  const treeDiagramContainer = document.getElementById('tree-diagram');
  const validationResultsContainer = document.getElementById('validation-results');
  
  // State variables
  let showLineNumbers = false;
  let xmlElementDocs = {};
  const MAX_HISTORY_ITEMS = 10;
  
  // Default XML element documentation
  const xmlElementDefinitions = {
    'xml': 'The XML declaration that defines the XML version and character encoding used in the document.',
    'DOCTYPE': 'Document Type Declaration, which specifies the rules for the XML document structure.',
    'CDATA': 'Character Data section that contains text which should not be parsed by the XML parser.',
    'ENTITY': 'Represents a storage unit of text that can be referenced and reused throughout the document.',
    'ELEMENT': 'Defines an element type declaration in the Document Type Definition (DTD).',
    'ATTLIST': 'Defines the attributes of an element in the Document Type Definition (DTD).',
  };
  
  // Sample XML to help users get started
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="COOKING">
    <title lang="en">Everyday Italian</title>
    <author>Giada De Laurentiis</author>
    <year>2005</year>
    <price>30.00</price>
  </book>
  <book category="CHILDREN">
    <title lang="en">Harry Potter</title>
    <author>J K. Rowling</author>
    <year>2005</year>
    <price>29.99</price>
  </book>
  <book category="WEB">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price>39.95</price>
  </book>
</bookstore>`;
  
  // Initialize
  function init() {
    // Initialize with sample
    xmlInput.value = sampleXml;
    
    // Format the sample XML
    formatXml();
    
    // Load history
    loadHistory();
    
    // Load templates
    loadTemplates();
    
    // Setup event listeners
    setupEventListeners();
    
    // Hide analysis section by default
    toggleAnalysisPanel(false);
  }
  
  // Setup all event listeners
  function setupEventListeners() {
    // Format XML button click
    formatButton.addEventListener('click', function() {
      formatXml();
    });
    
    // Clear button click
    clearButton.addEventListener('click', function() {
      xmlInput.value = '';
      xmlOutput.textContent = '';
      clearAnalysis();
    });
    
    // Copy button click
    copyButton.addEventListener('click', function() {
      copyToClipboard();
    });
    
    // Download button click
    downloadButton.addEventListener('click', function() {
      downloadXml();
    });
    
    // Toggle line numbers
    toggleLineNumbersButton.addEventListener('click', function() {
      showLineNumbers = !showLineNumbers;
      if (xmlOutput.textContent) {
        applyLineNumbers();
      }
    });
    
    // Toggle analysis panel
    toggleAnalysisButton.addEventListener('click', function() {
      const isVisible = xmlAnalysisSection.querySelector('.analysis-content').style.display !== 'none';
      toggleAnalysisPanel(!isVisible);
    });
    
    // History selection
    historySelect.addEventListener('change', function() {
      const selectedValue = historySelect.value;
      if (selectedValue) {
        const history = JSON.parse(localStorage.getItem('xmlFormatterHistory') || '[]');
        const entry = history.find(item => item.timestamp.toString() === selectedValue);
        if (entry) {
          xmlInput.value = entry.original;
          modeSelect.value = entry.mode;
          formatXml();
        }
      }
    });
    
    // Template selection
    templateSelect.addEventListener('change', function() {
      const selectedValue = templateSelect.value;
      if (selectedValue) {
        const templates = JSON.parse(localStorage.getItem('xmlFormatterTemplates') || '{}');
        const template = templates[selectedValue];
        if (template) {
          modeSelect.value = template.mode;
          indentSelect.value = template.indent;
          newlineElementsCheckbox.checked = template.newlineElements;
          preserveCommentsCheckbox.checked = template.preserveComments;
          
          // Apply formatting with new settings
          if (xmlInput.value.trim()) {
            formatXml();
          }
        }
      }
    });
    
    // Save template button
    saveTemplateButton.addEventListener('click', function() {
      openTemplateModal();
    });
    
    // Save template confirmation
    saveTemplateConfirmButton.addEventListener('click', function() {
      saveTemplate();
    });
    
    // Cancel template
    cancelTemplateButton.addEventListener('click', function() {
      closeTemplateModal();
    });
    
    // Close modal with X
    closeModalButton.addEventListener('click', function() {
      closeTemplateModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === templateModal) {
        closeTemplateModal();
      }
    });
    
    // Auto-format on input with debounce
    let debounceTimeout;
    xmlInput.addEventListener('input', function() {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(function() {
        if (xmlInput.value.trim()) {
          formatXml();
        } else {
          xmlOutput.textContent = '';
          clearAnalysis();
        }
      }, 500);
    });
  }
  
  // Format XML function
  function formatXml() {
    try {
      const xmlText = xmlInput.value.trim();
      if (!xmlText) {
        xmlOutput.textContent = '';
        clearAnalysis();
        return;
      }
      
      // Get user formatting preferences
      const mode = modeSelect.value;
      const indent = " ".repeat(parseInt(indentSelect.value, 10));
      const newlineElements = newlineElementsCheckbox.checked;
      const preserveComments = preserveCommentsCheckbox.checked;
      
      let formattedXml = '';
      
      try {
        // Parse XML to check validity
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Check if parsing was successful (no parsing errors)
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
          // If there's a parsing error, show it in the output
          xmlOutput.textContent = 'XML Parsing Error: ' + parseError[0].textContent;
          validationResultsContainer.innerHTML = '<div class="validation-error">✗ Invalid XML: ' + 
            parseError[0].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
          return;
        }
        
        // If in minify mode, remove all whitespace
        if (mode === 'minify') {
          formattedXml = xmlText
            .replace(/>\s+</g, '><') // Remove whitespace between elements
            .replace(/\s+</g, '<')   // Remove whitespace before opening tags
            .replace(/>\s+/g, '>')   // Remove whitespace after closing tags
            .replace(/\s+$/g, '');   // Remove trailing whitespace
          
          // Show validation success
          validationResultsContainer.innerHTML = '<div class="validation-success">✓ Valid XML</div>';
        } else {
          // Otherwise, use the pretty formatter
          formattedXml = formatXmlPretty(xmlText, {
            indent: indent,
            newlineElements: newlineElements,
            preserveComments: preserveComments
          });
          
          // Show validation success
          validationResultsContainer.innerHTML = '<div class="validation-success">✓ Valid XML</div>';
          
          // Analyze the XML for structure
          analyzeXml(xmlDoc);
        }
        
        // Display formatted XML
        xmlOutput.textContent = formattedXml;
        
        // Apply syntax highlighting
        applyHighlighting();
        
        // Apply line numbers if enabled
        if (showLineNumbers) {
          applyLineNumbers();
        }
        
        // Save to history
        saveToHistory(xmlText, formattedXml, mode);
        
      } catch (e) {
        xmlOutput.textContent = 'Error: ' + e.message;
        validationResultsContainer.innerHTML = '<div class="validation-error">✗ Error: ' + 
          e.message.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
      }
    } catch (e) {
      console.error('Error formatting XML:', e);
      xmlOutput.textContent = 'Error: ' + e.message;
    }
  }
  
  // Pretty formatting function
  function formatXmlPretty(xml, options) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    
    // Helper function to format a DOM node
    function formatNode(node, level) {
      let result = '';
      const indent = options.indent.repeat(level);
      
      // Process different node types
      switch (node.nodeType) {
        case Node.ELEMENT_NODE:
          // Start tag
          result += indent + '<' + node.nodeName;
          
          // Add attributes
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            result += ' ' + attr.name + '="' + attr.value + '"';
          }
          
          // Handle empty elements vs elements with content
          if (node.childNodes.length === 0) {
            result += '/>';
          } else {
            result += '>';
            
            // Check if it only has text content and no other elements
            const hasOnlyTextContent = node.childNodes.length === 1 && 
                                      node.childNodes[0].nodeType === Node.TEXT_NODE && 
                                      node.childNodes[0].textContent.trim() !== '';
            
            if (!hasOnlyTextContent) {
              result += '\n';
            }
            
            // Process child nodes
            let childResult = '';
            for (let i = 0; i < node.childNodes.length; i++) {
              const childNode = node.childNodes[i];
              childResult += formatNode(childNode, level + 1);
            }
            
            // Add closing tag
            if (!hasOnlyTextContent) {
              result += indent;
            }
            result += '</' + node.nodeName + '>';
          }
          
          // Add newline if needed
          if (options.newlineElements) {
            result += '\n';
          }
          break;
        
        case Node.TEXT_NODE:
          // Only add non-empty text nodes
          const text = node.textContent.trim();
          if (text) {
            result += text;
          }
          break;
        
        case Node.CDATA_SECTION_NODE:
          result += indent + '<![CDATA[' + node.textContent + ']]>\n';
          break;
        
        case Node.COMMENT_NODE:
          if (options.preserveComments) {
            result += indent + '<!--' + node.textContent + '-->\n';
          }
          break;
        
        case Node.DOCUMENT_NODE:
          // Process all child nodes of the document
          for (let i = 0; i < node.childNodes.length; i++) {
            result += formatNode(node.childNodes[i], level);
          }
          break;
      }
      
      return result;
    }
    
    // Start with XML declaration if present in original
    let result = '';
    if (xml.startsWith('<?xml')) {
      const xmlDeclEnd = xml.indexOf('?>') + 2;
      result = xml.substring(0, xmlDeclEnd) + '\n';
      
      // Remove the declaration from xmlDoc since it's not part of the DOM
      const firstChild = xmlDoc.childNodes[0];
      if (firstChild.nodeType === Node.PROCESSING_INSTRUCTION_NODE && firstChild.nodeName === 'xml') {
        xmlDoc.removeChild(firstChild);
      }
    }
    
    // Format the rest of the document
    result += formatNode(xmlDoc, 0);
    
    return result;
  }
  
  // Apply syntax highlighting
  function applyHighlighting() {
    if (typeof hljs !== 'undefined') {
      hljs.highlightElement(xmlOutput);
      addXmlDocsTooltips();
    }
  }
  
  // Apply line numbers
  function applyLineNumbers() {
    const codeLines = xmlOutput.innerHTML.split('\n');
    let numberedCode = '';
    
    for (let i = 0; i < codeLines.length; i++) {
      const lineNumber = i + 1;
      numberedCode += `<span class="line-number">${lineNumber}</span>${codeLines[i]}${i < codeLines.length - 1 ? '\n' : ''}`;
    }
    
    xmlOutput.innerHTML = numberedCode;
    
    // Add styling for line numbers
    const style = document.createElement('style');
    style.id = 'line-number-style';
    
    // Remove existing style if any
    const existingStyle = document.getElementById('line-number-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.textContent = `
      .line-number {
        display: inline-block;
        width: 40px;
        text-align: right;
        padding-right: 10px;
        margin-right: 10px;
        color: var(--secondary);
        border-right: 1px solid var(--border);
        user-select: none;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Add tooltips for XML elements
  function addXmlDocsTooltips() {
    // Implementation would depend on adding tooltip functionality
    // This is a simplified version
    const tagElements = xmlOutput.querySelectorAll('.hljs-tag');
    tagElements.forEach(tag => {
      const tagText = tag.textContent;
      const tagName = tagText.replace(/[<\/>]/g, '').trim();
      
      if (xmlElementDefinitions[tagName]) {
        tag.title = xmlElementDefinitions[tagName];
        tag.style.cursor = 'help';
      }
    });
  }
  
  // Copy to clipboard
  function copyToClipboard() {
    try {
      const formattedCode = xmlOutput.textContent;
      navigator.clipboard.writeText(formattedCode)
        .then(() => {
          // Show success message
          const originalText = copyButton.textContent;
          copyButton.textContent = 'Copied!';
          
          setTimeout(() => {
            copyButton.textContent = originalText;
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy to clipboard. Please try again.');
        });
    } catch (e) {
      console.error('Copy error:', e);
      alert('Failed to copy to clipboard. Please try again.');
    }
  }
  
  // Download XML
  function downloadXml() {
    try {
      const formattedCode = xmlOutput.textContent;
      const blob = new Blob([formattedCode], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted-xml.xml';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (e) {
      console.error('Download error:', e);
      alert('Failed to download the file. Please try again.');
    }
  }
  
  // Save to history
  function saveToHistory(originalXml, formattedXml, mode) {
    try {
      const history = JSON.parse(localStorage.getItem('xmlFormatterHistory') || '[]');
      
      // Create new history entry
      const newEntry = {
        timestamp: Date.now(),
        original: originalXml,
        formatted: formattedXml,
        mode: mode
      };
      
      // Check if this XML is already in history
      const existingIndex = history.findIndex(item => 
        item.original === originalXml && item.mode === mode
      );
      
      if (existingIndex !== -1) {
        // Remove existing entry
        history.splice(existingIndex, 1);
      }
      
      // Add new entry at the beginning
      history.unshift(newEntry);
      
      // Limit history size
      while (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
      }
      
      // Save updated history
      localStorage.setItem('xmlFormatterHistory', JSON.stringify(history));
      
      // Update history dropdown
      updateHistoryDropdown();
    } catch (e) {
      console.error('Error saving history:', e);
    }
  }
  
  // Load history
  function loadHistory() {
    try {
      updateHistoryDropdown();
    } catch (e) {
      console.error('Error loading history:', e);
    }
  }
  
  // Update history dropdown
  function updateHistoryDropdown() {
    try {
      const history = JSON.parse(localStorage.getItem('xmlFormatterHistory') || '[]');
      
      // Clear current options, keeping the default one
      while (historySelect.options.length > 1) {
        historySelect.remove(1);
      }
      
      // Add history items
      history.forEach(item => {
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleString();
        
        // Get first line or truncate
        let preview = item.original.split('\n')[0];
        if (preview.length > 30) {
          preview = preview.substring(0, 27) + '...';
        }
        
        const option = document.createElement('option');
        option.value = item.timestamp;
        option.textContent = `${preview} (${formattedDate})`;
        historySelect.appendChild(option);
      });
    } catch (e) {
      console.error('Error updating history dropdown:', e);
    }
  }
  
  // Open template modal
  function openTemplateModal() {
    templateNameInput.value = '';
    templateModal.style.display = 'block';
  }
  
  // Close template modal
  function closeTemplateModal() {
    templateModal.style.display = 'none';
  }
  
  // Save template
  function saveTemplate() {
    try {
      const templateName = templateNameInput.value.trim() || 'My Template';
      
      const templates = JSON.parse(localStorage.getItem('xmlFormatterTemplates') || '{}');
      
      // Create new template with current settings
      templates[templateName] = {
        mode: modeSelect.value,
        indent: indentSelect.value,
        newlineElements: newlineElementsCheckbox.checked,
        preserveComments: preserveCommentsCheckbox.checked,
        createdAt: Date.now()
      };
      
      // Save updated templates
      localStorage.setItem('xmlFormatterTemplates', JSON.stringify(templates));
      
      // Update templates dropdown
      updateTemplatesDropdown();
      
      // Close modal
      closeTemplateModal();
    } catch (e) {
      console.error('Error saving template:', e);
      alert('Failed to save template. Please try again.');
    }
  }
  
  // Load templates
  function loadTemplates() {
    try {
      updateTemplatesDropdown();
    } catch (e) {
      console.error('Error loading templates:', e);
    }
  }
  
  // Update templates dropdown
  function updateTemplatesDropdown() {
    try {
      const templates = JSON.parse(localStorage.getItem('xmlFormatterTemplates') || '{}');
      
      // Clear current options, keeping the default one
      while (templateSelect.options.length > 1) {
        templateSelect.remove(1);
      }
      
      // Add template items
      Object.keys(templates).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        templateSelect.appendChild(option);
      });
    } catch (e) {
      console.error('Error updating templates dropdown:', e);
    }
  }
  
  // Toggle analysis panel
  function toggleAnalysisPanel(show) {
    const content = xmlAnalysisSection.querySelector('.analysis-content');
    content.style.display = show ? 'block' : 'none';
    
    const icon = toggleAnalysisButton.querySelector('.icon');
    icon.textContent = show ? '▲' : '▼';
  }
  
  // Analyze XML
  function analyzeXml(xmlDoc) {
    try {
      // Extract elements
      const elements = extractElements(xmlDoc);
      displayElements(elements);
      
      // Generate tree visualization
      generateTreeVisualization(xmlDoc);
      
    } catch (e) {
      console.error('Error analyzing XML:', e);
      clearAnalysis();
    }
  }
  
  // Extract elements from XML document
  function extractElements(xmlDoc) {
    const elements = {};
    
    function traverseNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const nodeName = node.nodeName;
        if (!elements[nodeName]) {
          elements[nodeName] = {
            count: 1,
            attributes: {}
          };
        } else {
          elements[nodeName].count++;
        }
        
        // Count attributes
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          if (!elements[nodeName].attributes[attr.name]) {
            elements[nodeName].attributes[attr.name] = 1;
          } else {
            elements[nodeName].attributes[attr.name]++;
          }
        }
      }
      
      // Process child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseNode(node.childNodes[i]);
      }
    }
    
    // Start traversal from document element
    traverseNode(xmlDoc.documentElement);
    
    return elements;
  }
  
  // Display elements in the analysis panel
  function displayElements(elements) {
    let html = '<ul class="elements-list">';
    
    for (const [element, data] of Object.entries(elements)) {
      html += `<li><strong>${element}</strong> (${data.count})`;
      
      // Show attributes if any
      const attributes = Object.keys(data.attributes);
      if (attributes.length > 0) {
        html += '<ul class="attribute-list">';
        attributes.forEach(attr => {
          html += `<li>${attr} (${data.attributes[attr]})</li>`;
        });
        html += '</ul>';
      }
      
      html += '</li>';
    }
    
    html += '</ul>';
    
    elementsListContainer.innerHTML = html;
  }
  
  // Generate tree visualization of XML structure
  function generateTreeVisualization(xmlDoc) {
    function createTreeNodeHTML(node, isLast = false) {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }
      
      let html = '<div class="tree-node"' + (isLast ? ' data-last="true"' : '') + '>';
      
      // Node content
      html += '<div class="tree-node-content">';
      html += `<span class="element-name">${node.nodeName}</span>`;
      
      // Add attributes if any
      if (node.attributes.length > 0) {
        html += ' (';
        const attrs = [];
        for (let i = 0; i < node.attributes.length; i++) {
          attrs.push(`${node.attributes[i].name}="${node.attributes[i].value}"`);
        }
        html += attrs.join(', ');
        html += ')';
      }
      
      html += '</div>';
      
      // Add children
      const childElements = Array.from(node.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
      
      if (childElements.length > 0) {
        for (let i = 0; i < childElements.length; i++) {
          html += createTreeNodeHTML(childElements[i], i === childElements.length - 1);
        }
      }
      
      html += '</div>';
      return html;
    }
    
    // Create tree from root element
    const rootElement = xmlDoc.documentElement;
    const treeHTML = createTreeNodeHTML(rootElement);
    
    treeDiagramContainer.innerHTML = treeHTML;
  }
  
  // Clear analysis
  function clearAnalysis() {
    elementsListContainer.innerHTML = '';
    treeDiagramContainer.innerHTML = '';
    validationResultsContainer.innerHTML = '';
  }
  
  // Initialize on load
  init();
}); 