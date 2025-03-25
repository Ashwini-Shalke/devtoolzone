document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const markdownInput = document.getElementById('markdown-input');
  const markdownOutput = document.getElementById('markdown-output');
  const previewButton = document.getElementById('preview-button');
  const clearButton = document.getElementById('clear-button');
  const copyButton = document.getElementById('copy-button');
  const downloadButton = document.getElementById('download-button');
  const characterCount = document.getElementById('character-count');
  const wordCount = document.getElementById('word-count');
  const shortcutButtons = document.querySelectorAll('[data-markdown-shortcut]');
  
  // Set up marked.js options for the markdown parser
  marked.setOptions({
    breaks: true,               // Add <br> on single line breaks
    gfm: true,                  // GitHub Flavored Markdown
    headerIds: true,            // Add IDs to headers
    mangle: false,              // Don't escape HTML
    sanitize: false,            // Don't sanitize HTML
    silent: false,              // Don't suppress warnings
    smartLists: true,           // Use smarter list behavior
    smartypants: true,          // Use "smart" typographic punctuation
    xhtml: false                // Don't close void elements with />
  });
  
  // Initialize with some example Markdown
  markdownInput.value = `# Markdown Editor

This is a simple **Markdown** editor. You can write your content here and preview it on the right.

## Features

- Live preview
- Markdown shortcuts
- Character and word count
- Download as .md file
- Copy to clipboard

### Try it out!

> This is a blockquote

\`\`\`
// This is a code block
function hello() {
  console.log("Hello, world!");
}
\`\`\`

![Image placeholder](https://via.placeholder.com/150)

[Learn more about Markdown](https://www.markdownguide.org/)
`;

  // Initial preview
  updatePreview();
  updateCounts();
  
  // Event listeners
  previewButton.addEventListener('click', updatePreview);
  clearButton.addEventListener('click', clearContent);
  copyButton.addEventListener('click', copyToClipboard);
  downloadButton.addEventListener('click', downloadMarkdown);
  markdownInput.addEventListener('input', updateCounts);
  
  // Add event listeners to shortcut buttons
  shortcutButtons.forEach(button => {
    button.addEventListener('click', function() {
      const shortcutType = this.getAttribute('data-markdown-shortcut');
      applyMarkdownShortcut(shortcutType);
    });
  });
  
  // Add input event for real-time preview (optional)
  markdownInput.addEventListener('input', debounce(updatePreview, 300));
  
  // Functions
  function updatePreview() {
    try {
      // Parse markdown and render HTML
      markdownOutput.innerHTML = marked.parse(markdownInput.value);
      
      // Make links open in new tab
      const links = markdownOutput.querySelectorAll('a');
      links.forEach(link => {
        if (link.hostname !== window.location.hostname) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    } catch (error) {
      console.error('Error parsing markdown:', error);
      markdownOutput.innerHTML = '<p style="color: red;">Error parsing markdown</p>';
    }
  }
  
  function updateCounts() {
    const text = markdownInput.value;
    // Update character count
    characterCount.textContent = text.length;
    
    // Update word count - split by whitespace and filter empty items
    const words = text.trim().split(/\s+/).filter(Boolean);
    wordCount.textContent = words.length;
  }
  
  function clearContent() {
    markdownInput.value = '';
    markdownOutput.innerHTML = '';
    updateCounts();
  }
  
  function copyToClipboard() {
    markdownInput.select();
    markdownInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
      document.execCommand('copy');
      showNotification('Copied to clipboard!');
    } catch (err) {
      // Fallback for modern browsers
      navigator.clipboard.writeText(markdownInput.value)
        .then(() => showNotification('Copied to clipboard!'))
        .catch(err => showNotification('Failed to copy: ' + err, true));
    }
  }
  
  function downloadMarkdown() {
    const markdown = markdownInput.value;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
  
  function applyMarkdownShortcut(type) {
    // Save the current selection
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const selectedText = markdownInput.value.substring(start, end);
    
    let replacement = '';
    
    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `\n## ${selectedText || 'Heading'}\n`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || 'alt text'}](https://example.com/image.jpg)`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'List item 1'}\n- List item 2\n- List item 3\n`;
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          replacement = `\n\`\`\`\n${selectedText || 'code block'}\n\`\`\`\n`;
        } else {
          replacement = `\`${selectedText || 'inline code'}\``;
        }
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'Blockquote'}\n`;
        break;
      default:
        replacement = selectedText;
    }
    
    // Insert the markdown at the cursor position
    markdownInput.focus();
    document.execCommand('insertText', false, replacement);
    
    // If no text was selected, we need to position the cursor properly
    if (!selectedText) {
      const cursorPos = start + replacement.length;
      markdownInput.selectionStart = cursorPos;
      markdownInput.selectionEnd = cursorPos;
    }
    
    // Update the preview and counts
    updatePreview();
    updateCounts();
  }
  
  function showNotification(message, isError = false) {
    // Check if a notification already exists and remove it
    const existingNotification = document.querySelector('.markdown-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'markdown-notification ' + (isError ? 'error' : 'success');
    notification.textContent = message;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Hide and remove after a delay
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 2000);
  }
  
  // Debounce helper function to limit how often a function can be called
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
  .markdown-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: #4caf50;
    color: white;
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s, transform 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .markdown-notification.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .markdown-notification.error {
    background-color: #f44336;
  }
`;
document.head.appendChild(style); 