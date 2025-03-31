/**
 * Code Diff Viewer Tool - Implementation with lazy loading and performance optimizations
 */
(function() {
  // DOM elements cache
  let elements = {};
  
  // State variables
  let showLineNumbers = true;
  let diffCache = {}; // Cache for previously calculated diffs
  let resizeObserver;
  
  // Sample code to populate on first load
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

  // Initialize the viewer
  function init() {
    console.log("Initializing Code Diff Viewer...");
    try {
      // Cache DOM elements
      cacheElements();
      
      // Make sure layout is stable before proceeding
      stabilizeLayout(function() {
        // Setup event listeners
        setupEventListeners();
        
        // Add sample code if input is empty
        if (elements.originalCode && !elements.originalCode.value.trim()) {
          elements.originalCode.value = sampleOriginalCode;
        }
        if (elements.modifiedCode && !elements.modifiedCode.value.trim()) {
          elements.modifiedCode.value = sampleModifiedCode;
        }
        
        // Initial comparison
        compareCode();
        
        // Setup resize observer for responsive layout
        setupResizeObserver();
        
        // Show the container by adding the loaded class
        const container = document.querySelector('.code-diff-viewer-container');
        if (container) {
          container.classList.add('loaded');
        }
        
        // Remove loading class from document
        document.documentElement.classList.remove('loading');
      });
    } catch (error) {
      console.error("Error initializing Code Diff Viewer:", error);
      document.documentElement.classList.remove('loading');
    }
  }

  // Cache DOM elements for better performance
  function cacheElements() {
    elements = {
      originalCode: document.getElementById('original-code'),
      modifiedCode: document.getElementById('modified-code'),
      compareButton: document.getElementById('compare-button'),
      swapButton: document.getElementById('swap-button'),
      clearAllButton: document.getElementById('clear-all-button'),
      clearOriginalButton: document.getElementById('clear-original-button'),
      clearModifiedButton: document.getElementById('clear-modified-button'),
      copyDiffButton: document.getElementById('copy-diff-button'),
      downloadDiffButton: document.getElementById('download-diff-button'),
      languageSelect: document.getElementById('language-select'),
      viewMode: document.getElementById('view-mode'),
      ignoreWhitespace: document.getElementById('ignore-whitespace'),
      contextLines: document.getElementById('context-lines'),
      diffOutput: document.getElementById('diff-output'),
      diffStats: document.getElementById('diff-stats'),
      toggleLineNumbers: document.getElementById('toggle-line-numbers')
    };

    // Check for required elements
    const requiredElements = ['originalCode', 'modifiedCode', 'compareButton', 'diffOutput'];
    for (const element of requiredElements) {
      if (!elements[element]) {
        console.error(`Required element ${element} not found in the DOM`);
      }
    }
  }

  // Ensure layout stability before proceeding
  function stabilizeLayout(callback) {
    // If we can't find the containers, try again after a short delay
    if (!elements.originalCode || !elements.modifiedCode || !elements.diffOutput) {
      setTimeout(function() {
        cacheElements();
        stabilizeLayout(callback);
      }, 50);
      return;
    }
    
    // Wait a bit to ensure rendering completes before proceeding
    setTimeout(callback, 100);
  }

  // Setup all event listeners
  function setupEventListeners() {
    // Compare button click
    if (elements.compareButton) {
      elements.compareButton.addEventListener('click', compareCode, { passive: true });
    }
    
    // Swap button click
    if (elements.swapButton) {
      elements.swapButton.addEventListener('click', swapCode, { passive: true });
    }
    
    // Clear all button click
    if (elements.clearAllButton) {
      elements.clearAllButton.addEventListener('click', clearAll, { passive: true });
    }
    
    // Clear original button click
    if (elements.clearOriginalButton) {
      elements.clearOriginalButton.addEventListener('click', function() {
        if (elements.originalCode) {
          elements.originalCode.value = '';
        }
      }, { passive: true });
    }
    
    // Clear modified button click
    if (elements.clearModifiedButton) {
      elements.clearModifiedButton.addEventListener('click', function() {
        if (elements.modifiedCode) {
          elements.modifiedCode.value = '';
        }
      }, { passive: true });
    }
    
    // Copy diff button click
    if (elements.copyDiffButton) {
      elements.copyDiffButton.addEventListener('click', copyDiff, { passive: true });
    }
    
    // Download diff button click
    if (elements.downloadDiffButton) {
      elements.downloadDiffButton.addEventListener('click', downloadDiff, { passive: true });
    }
    
    // Toggle line numbers
    if (elements.toggleLineNumbers) {
      elements.toggleLineNumbers.addEventListener('click', function() {
        showLineNumbers = !showLineNumbers;
        compareCode();
      }, { passive: true });
    }
    
    // Options change events
    const optionElements = [
      elements.languageSelect,
      elements.viewMode,
      elements.ignoreWhitespace,
      elements.contextLines
    ];
    
    optionElements.forEach(element => {
      if (element) {
        element.addEventListener('change', compareCode, { passive: true });
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Ctrl+Enter or Cmd+Enter to compare
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        compareCode();
      }
      
      // Ctrl+Shift+S or Cmd+Shift+S to swap
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        swapCode();
      }
      
      // Ctrl+Shift+C or Cmd+Shift+C to copy diff
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        copyDiff();
      }
      
      // Ctrl+Shift+X or Cmd+Shift+X to clear all
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        clearAll();
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

  // Compare code and show diff
  function compareCode() {
    if (!elements.originalCode || !elements.modifiedCode || !elements.diffOutput) {
      return;
    }
    
    try {
      const originalText = elements.originalCode.value;
      const modifiedText = elements.modifiedCode.value;
      
      // Skip if both texts are empty
      if (!originalText.trim() && !modifiedText.trim()) {
        elements.diffOutput.innerHTML = `
          <div class="empty-state">
            <p>Enter code in both panels and click "Compare" to see the differences</p>
          </div>
        `;
        if (elements.diffStats) {
          elements.diffStats.innerHTML = '';
        }
        return;
      }
      
      // Get options
      const language = elements.languageSelect ? elements.languageSelect.value : 'auto';
      const viewMode = elements.viewMode ? elements.viewMode.value : 'side-by-side';
      const ignoreWhitespace = elements.ignoreWhitespace ? elements.ignoreWhitespace.checked : false;
      const contextLines = elements.contextLines ? parseInt(elements.contextLines.value, 10) : 3;
      
      // Create cache key
      const cacheKey = `${originalText}|${modifiedText}|${language}|${viewMode}|${ignoreWhitespace}|${contextLines}|${showLineNumbers}`;
      
      // Check cache
      if (diffCache[cacheKey]) {
        elements.diffOutput.innerHTML = diffCache[cacheKey].html;
        if (elements.diffStats) {
          elements.diffStats.innerHTML = diffCache[cacheKey].stats;
        }
        return;
      }
      
      // Show loading state
      elements.diffOutput.innerHTML = '<div class="empty-state"><p>Calculating differences...</p></div>';
      
      // Use setTimeout to prevent UI blocking
      setTimeout(() => {
        // Process differently based on view mode
        let diffResult = '';
        let statsHtml = '';
        
        switch (viewMode) {
          case 'side-by-side':
            diffResult = generateSideBySideDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language);
            break;
          case 'unified':
            diffResult = generateUnifiedDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language);
            break;
          case 'inline':
            diffResult = generateInlineDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language);
            break;
          default:
            diffResult = generateSideBySideDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language);
        }
        
        // Calculate stats
        const stats = calculateDiffStats(originalText, modifiedText, ignoreWhitespace);
        statsHtml = `
          <span class="added-stat">+${stats.added}</span> 
          <span class="deleted-stat">-${stats.deleted}</span> 
          <span class="modified-stat">~${stats.modified}</span>
        `;
        
        // Update the DOM
        elements.diffOutput.innerHTML = diffResult;
        if (elements.diffStats) {
          elements.diffStats.innerHTML = statsHtml;
        }
        
        // Apply syntax highlighting if needed
        applyHighlighting(language);
        
        // Cache the result
        diffCache[cacheKey] = {
          html: diffResult,
          stats: statsHtml
        };
      }, 0);
    } catch (error) {
      console.error("Error comparing code:", error);
      elements.diffOutput.innerHTML = `<div class="error-state">Error calculating differences: ${error.message}</div>`;
    }
  }
  
  // Generate side by side diff
  function generateSideBySideDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language) {
    if (!originalText && !modifiedText) return '';
    
    // Split into lines
    const originalLines = originalText.split('\n');
    const modifiedLines = modifiedText.split('\n');
    
    // Process with diff library
    const diffOptions = {
      ignoreWhitespace: ignoreWhitespace
    };
    
    const diffResult = Diff.diffLines(originalText, modifiedText, diffOptions);
    
    // Prepare for side-by-side display
    let leftLines = [];
    let rightLines = [];
    let originalLineNum = 1;
    let modifiedLineNum = 1;
    
    for (const part of diffResult) {
      const lines = part.value.split('\n');
      // Remove the last empty line that results from split
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }
      
      if (part.added) {
        // Added lines only go to right side
        leftLines.push(...Array(lines.length).fill(''));
        rightLines.push(...lines);
        modifiedLineNum += lines.length;
      } else if (part.removed) {
        // Removed lines only go to left side
        leftLines.push(...lines);
        rightLines.push(...Array(lines.length).fill(''));
        originalLineNum += lines.length;
      } else {
        // Unchanged lines go to both sides
        leftLines.push(...lines);
        rightLines.push(...lines);
        originalLineNum += lines.length;
        modifiedLineNum += lines.length;
      }
    }
    
    // Generate HTML
    let html = '<div class="side-by-side-view">';
    
    // Left side
    html += '<div class="side-by-side-left">';
    for (let i = 0; i < leftLines.length; i++) {
      const lineClass = rightLines[i] === '' ? 'diff-line deleted' : (leftLines[i] === '' ? 'diff-line empty' : 'diff-line unchanged');
      html += `<div class="${lineClass}">`;
      if (showLineNumbers) {
        html += `<span class="diff-line-number">${leftLines[i] !== '' ? (i + 1) : ' '}</span>`;
      }
      html += `<span class="diff-line-content">${escapeHtml(leftLines[i])}</span>`;
      html += '</div>';
    }
    html += '</div>';
    
    // Right side
    html += '<div class="side-by-side-right">';
    for (let i = 0; i < rightLines.length; i++) {
      const lineClass = leftLines[i] === '' ? 'diff-line added' : (rightLines[i] === '' ? 'diff-line empty' : 'diff-line unchanged');
      html += `<div class="${lineClass}">`;
      if (showLineNumbers) {
        html += `<span class="diff-line-number">${rightLines[i] !== '' ? (i + 1) : ' '}</span>`;
      }
      html += `<span class="diff-line-content">${escapeHtml(rightLines[i])}</span>`;
      html += '</div>';
    }
    html += '</div>';
    
    html += '</div>';
    
    return html;
  }
  
  // Generate unified diff
  function generateUnifiedDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language) {
    if (!originalText && !modifiedText) return '';
    
    // Split into lines
    const originalLines = originalText.split('\n');
    const modifiedLines = modifiedText.split('\n');
    
    // Process with diff library
    const diffOptions = {
      ignoreWhitespace: ignoreWhitespace
    };
    
    const diffResult = Diff.diffLines(originalText, modifiedText, diffOptions);
    
    // Generate unified diff
    let html = '';
    let lineNumber = 1;
    
    for (const part of diffResult) {
      const lines = part.value.split('\n');
      // Remove the last empty line that results from split
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }
      
      for (const line of lines) {
        let lineClass = 'diff-line';
        let prefix = ' ';
        
        if (part.added) {
          lineClass += ' added';
          prefix = '+';
        } else if (part.removed) {
          lineClass += ' deleted';
          prefix = '-';
        }
        
        html += `<div class="${lineClass}">`;
        if (showLineNumbers) {
          html += `<span class="diff-line-number">${lineNumber}</span>`;
        }
        html += `<span class="diff-line-prefix">${prefix}</span>`;
        html += `<span class="diff-line-content">${escapeHtml(line)}</span>`;
        html += '</div>';
        
        lineNumber++;
      }
    }
    
    return html;
  }
  
  // Generate inline diff with character-level differences
  function generateInlineDiff(originalText, modifiedText, ignoreWhitespace, contextLines, language) {
    if (!originalText && !modifiedText) return '';
    
    // Split into lines
    const originalLines = originalText.split('\n');
    const modifiedLines = modifiedText.split('\n');
    
    // Process with diff library for line level
    const diffOptions = {
      ignoreWhitespace: ignoreWhitespace
    };
    
    const diffResult = Diff.diffLines(originalText, modifiedText, diffOptions);
    
    // Generate inline diff
    let html = '';
    let lineNumber = 1;
    
    for (const part of diffResult) {
      const lines = part.value.split('\n');
      // Remove the last empty line that results from split
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }
      
      if (part.added || part.removed) {
        // If there's a modified section, find corresponding added/removed parts
        const addedPart = part.added ? part : diffResult.find(p => p.added && p.__adjacent);
        const removedPart = part.removed ? part : diffResult.find(p => p.removed && p.__adjacent);
        
        if (addedPart && removedPart) {
          // We have both added and removed parts, do character-level diff
          const addedLines = addedPart.value.split('\n');
          const removedLines = removedPart.value.split('\n');
          
          // Remove empty last lines
          if (addedLines[addedLines.length - 1] === '') addedLines.pop();
          if (removedLines[removedLines.length - 1] === '') removedLines.pop();
          
          // Match lines for character diffs
          const maxLines = Math.max(addedLines.length, removedLines.length);
          
          for (let i = 0; i < maxLines; i++) {
            const removedLine = i < removedLines.length ? removedLines[i] : '';
            const addedLine = i < addedLines.length ? addedLines[i] : '';
            
            if (removedLine) {
              html += `<div class="diff-line deleted">`;
              if (showLineNumbers) {
                html += `<span class="diff-line-number">${lineNumber++}</span>`;
              }
              html += `<span class="diff-line-prefix">-</span>`;
              html += `<span class="diff-line-content">${escapeHtml(removedLine)}</span>`;
              html += '</div>';
            }
            
            if (addedLine) {
              html += `<div class="diff-line added">`;
              if (showLineNumbers) {
                html += `<span class="diff-line-number">${lineNumber++}</span>`;
              }
              html += `<span class="diff-line-prefix">+</span>`;
              html += `<span class="diff-line-content">${escapeHtml(addedLine)}</span>`;
              html += '</div>';
            }
          }
        } else {
          // Only have either added or removed part
          for (const line of lines) {
            let lineClass = 'diff-line ' + (part.added ? 'added' : 'deleted');
            let prefix = part.added ? '+' : '-';
            
            html += `<div class="${lineClass}">`;
            if (showLineNumbers) {
              html += `<span class="diff-line-number">${lineNumber++}</span>`;
            }
            html += `<span class="diff-line-prefix">${prefix}</span>`;
            html += `<span class="diff-line-content">${escapeHtml(line)}</span>`;
            html += '</div>';
          }
        }
      } else {
        // Unchanged lines
        for (const line of lines) {
          html += `<div class="diff-line unchanged">`;
          if (showLineNumbers) {
            html += `<span class="diff-line-number">${lineNumber++}</span>`;
          }
          html += `<span class="diff-line-prefix"> </span>`;
          html += `<span class="diff-line-content">${escapeHtml(line)}</span>`;
          html += '</div>';
        }
      }
    }
    
    return html;
  }
  
  // Apply syntax highlighting
  function applyHighlighting(language) {
    if (language === 'auto' || language === 'plaintext') return;
    
    // Apply highlighting with a small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        const codeElements = document.querySelectorAll('.diff-line-content');
        if (codeElements.length && window.hljs) {
          codeElements.forEach(element => {
            // Only highlight if not already highlighted
            if (!element.classList.contains('hljs')) {
              const code = element.textContent;
              const result = window.hljs.highlight(code, { language: language });
              element.innerHTML = result.value;
              element.classList.add('hljs');
            }
          });
        }
      } catch (error) {
        console.error("Error applying syntax highlighting:", error);
      }
    }, 50);
  }
  
  // Calculate diff statistics
  function calculateDiffStats(originalText, modifiedText, ignoreWhitespace) {
    const stats = {
      added: 0,
      deleted: 0,
      modified: 0
    };
    
    // Process with diff library
    const diffOptions = {
      ignoreWhitespace: ignoreWhitespace
    };
    
    const diffResult = Diff.diffLines(originalText, modifiedText, diffOptions);
    
    for (const part of diffResult) {
      const lines = part.value.split('\n');
      // Remove the last empty line that results from split
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }
      
      const lineCount = lines.length;
      
      if (part.added) {
        stats.added += lineCount;
      } else if (part.removed) {
        stats.deleted += lineCount;
      }
    }
    
    // Estimate modified lines (simplified approach)
    stats.modified = Math.min(stats.added, stats.deleted);
    stats.added -= stats.modified;
    stats.deleted -= stats.modified;
    
    return stats;
  }
  
  // Swap original and modified code
  function swapCode() {
    if (!elements.originalCode || !elements.modifiedCode) return;
    
    const temp = elements.originalCode.value;
    elements.originalCode.value = elements.modifiedCode.value;
    elements.modifiedCode.value = temp;
    
    // Update diff
    compareCode();
  }
  
  // Clear all code
  function clearAll() {
    if (elements.originalCode) elements.originalCode.value = '';
    if (elements.modifiedCode) elements.modifiedCode.value = '';
    
    // Clear diff output
    if (elements.diffOutput) {
      elements.diffOutput.innerHTML = `
        <div class="empty-state">
          <p>Enter code in both panels and click "Compare" to see the differences</p>
        </div>
      `;
    }
    
    // Clear stats
    if (elements.diffStats) {
      elements.diffStats.innerHTML = '';
    }
  }
  
  // Copy diff to clipboard
  function copyDiff() {
    if (!elements.diffOutput) return;
    
    try {
      // Extract text content without HTML
      const diffText = extractDiffText();
      
      // Use Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(diffText)
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
        textArea.value = diffText;
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
      console.error("Error copying diff:", error);
      showCopyMessage('Failed to copy');
    }
  }
  
  // Extract diff text without HTML
  function extractDiffText() {
    if (!elements.diffOutput) return '';
    
    // Get current view mode
    const viewMode = elements.viewMode ? elements.viewMode.value : 'side-by-side';
    let result = '';
    
    if (viewMode === 'side-by-side') {
      // Extract left and right sides
      const leftSide = elements.diffOutput.querySelector('.side-by-side-left');
      const rightSide = elements.diffOutput.querySelector('.side-by-side-right');
      
      if (leftSide && rightSide) {
        result += "--- Original\n+++ Modified\n\n";
        
        // Process the lines
        const leftLines = leftSide.querySelectorAll('.diff-line');
        const rightLines = rightSide.querySelectorAll('.diff-line');
        
        for (let i = 0; i < leftLines.length; i++) {
          const leftContent = leftLines[i].querySelector('.diff-line-content');
          const rightContent = rightLines[i].querySelector('.diff-line-content');
          
          const leftText = leftContent ? leftContent.textContent : '';
          const rightText = rightContent ? rightContent.textContent : '';
          
          if (leftLines[i].classList.contains('deleted')) {
            result += `- ${leftText}\n`;
          } else if (rightLines[i].classList.contains('added')) {
            result += `+ ${rightText}\n`;
          } else if (leftText === rightText) {
            result += `  ${leftText}\n`;
          }
        }
      }
    } else {
      // Unified or inline view
      const lines = elements.diffOutput.querySelectorAll('.diff-line');
      
      result += "--- Original\n+++ Modified\n\n";
      
      for (const line of lines) {
        const prefix = line.querySelector('.diff-line-prefix');
        const content = line.querySelector('.diff-line-content');
        
        if (prefix && content) {
          result += `${prefix.textContent}${content.textContent}\n`;
        }
      }
    }
    
    return result;
  }
  
  // Download diff as a file
  function downloadDiff() {
    if (!elements.diffOutput) return;
    
    try {
      // Extract diff text
      const diffText = extractDiffText();
      if (!diffText.trim()) return;
      
      // Create download link
      const blob = new Blob([diffText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = `code-diff-${new Date().toISOString().slice(0, 10)}.diff`;
      a.style.display = 'none';
      
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading diff:", error);
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
  
  // Setup ResizeObserver for dynamic layout adjustments
  function setupResizeObserver() {
    try {
      if (window.ResizeObserver) {
        // Use ResizeObserver for efficient resize handling
        resizeObserver = new ResizeObserver(debounce(function(entries) {
          if (!entries || !entries[0]) return;
          
          // Re-run comparison if the view size changes
          compareCode();
        }, 300));
        
        if (elements.diffOutput) {
          resizeObserver.observe(elements.diffOutput);
        }
      } else {
        // Fallback for browsers without ResizeObserver
        window.addEventListener('resize', debounce(compareCode, 300), { passive: true });
      }
    } catch (error) {
      console.error("Error setting up ResizeObserver:", error);
    }
  }
  
  // Escape HTML special characters
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  // Clean up resources
  function cleanup() {
    try {
      // Disconnect ResizeObserver if it was created
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      // Clear any debounced functions
      if (compareCode.cancel) compareCode.cancel();
      
      // Clear cache
      diffCache = {};
    } catch (error) {
      console.error("Error in cleanup:", error);
    }
  }
  
  // Set up cleanup on page unload
  window.addEventListener('unload', cleanup);
  
  // Start the viewer once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 