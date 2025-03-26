document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sqlInput = document.getElementById('sql-input');
  const sqlOutput = document.getElementById('sql-output');
  const formatButton = document.getElementById('format-button');
  const clearButton = document.getElementById('clear-button');
  const copyButton = document.getElementById('copy-button');
  const downloadButton = document.getElementById('download-button');
  const dialectSelect = document.getElementById('sql-dialect');
  const indentSelect = document.getElementById('indent-size');
  const uppercaseCheckbox = document.getElementById('uppercase-keywords');
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
  const sqlAnalysisSection = document.getElementById('sql-analysis');
  const tablesListContainer = document.getElementById('tables-list');
  const schemaDiagramContainer = document.getElementById('schema-diagram');
  const queryStatsContainer = document.getElementById('query-stats');
  
  // State variables
  let showLineNumbers = false;
  let sqlKeywordDocs = {};
  let formatterReady = false;
  
  // Default SQL keyword documentation
  const sqlKeywordsDefinitions = {
    'SELECT': 'Used to select data from a database. The data returned is stored in a result table, called the result-set.',
    'FROM': 'Specifies which table to select or delete data from.',
    'WHERE': 'Filters records based on a specified condition.',
    'JOIN': 'Used to combine rows from two or more tables, based on a related column between them.',
    'ON': 'Specifies the join condition in a JOIN clause.',
    'GROUP BY': 'Groups rows that have the same values into summary rows.',
    'HAVING': 'Like WHERE, but applies to grouped records returned by GROUP BY.',
    'ORDER BY': 'Sorts the result-set in ascending or descending order.',
    'INSERT INTO': 'Adds new rows of data to a table in a database.',
    'UPDATE': 'Modifies the existing data in a table.',
    'DELETE FROM': 'Removes rows from a table.',
    'CREATE TABLE': 'Creates a new table in the database.',
    'ALTER TABLE': 'Modifies a table structure.',
    'DROP TABLE': 'Deletes a table and all rows in the table.',
    'CREATE INDEX': 'Creates an index on a table (allows duplicate values).',
    'DROP INDEX': 'Deletes an index.',
  };
  
  // Sample SQL to help users get started
  const sampleSql = `SELECT 
  c.customer_id, 
  c.name, 
  c.email, 
  o.order_id, 
  o.order_date,
  p.product_name,
  p.price * oi.quantity as total_price
FROM 
  customers c
  JOIN orders o ON c.customer_id = o.customer_id
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
WHERE 
  o.order_date >= '2023-01-01'
  AND p.category = 'Electronics'
ORDER BY 
  o.order_date DESC, 
  total_price DESC
LIMIT 10;`;
  
  // Initialize
  function init() {
    // Initialize with sample
    sqlInput.value = sampleSql;
    
    // Load sql-formatter library
    loadSqlFormatter();
    
    // Load history
    loadHistory();
    
    // Load templates
    loadTemplates();
    
    // Setup event listeners
    setupEventListeners();
    
    // Hide analysis section by default
    toggleAnalysisPanel(false);
  }
  
  // Load the SQL formatter library
  function loadSqlFormatter() {
    if (typeof sqlFormatter === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/sql-formatter@12.2.3/dist/sql-formatter.min.js';
      script.onload = function() {
        formatterReady = true;
        formatSql(); // Format the initial sample SQL
      };
      document.head.appendChild(script);
    } else {
      formatterReady = true;
      formatSql(); // Format the initial sample SQL
    }
  }
  
  // Setup all event listeners
  function setupEventListeners() {
    // Format SQL button click
    formatButton.addEventListener('click', function() {
      formatSql();
    });
    
    // Clear button click
    clearButton.addEventListener('click', function() {
      sqlInput.value = '';
      sqlOutput.textContent = '';
      clearAnalysis();
    });
    
    // Copy button click
    copyButton.addEventListener('click', function() {
      copyToClipboard();
    });
    
    // Download button click
    downloadButton.addEventListener('click', function() {
      downloadSql();
    });
    
    // Toggle line numbers
    toggleLineNumbersButton.addEventListener('click', function() {
      showLineNumbers = !showLineNumbers;
      if (sqlOutput.textContent) {
        applyLineNumbers();
      }
    });
    
    // Toggle analysis panel
    toggleAnalysisButton.addEventListener('click', function() {
      const isVisible = sqlAnalysisSection.querySelector('.analysis-content').style.display !== 'none';
      toggleAnalysisPanel(!isVisible);
    });
    
    // History selection
    historySelect.addEventListener('change', function() {
      const selectedValue = historySelect.value;
      if (selectedValue) {
        const history = JSON.parse(localStorage.getItem('sqlFormatterHistory') || '[]');
        const entry = history.find(item => item.timestamp.toString() === selectedValue);
        if (entry) {
          sqlInput.value = entry.original;
          dialectSelect.value = entry.dialect;
          formatSql();
        }
      }
    });
    
    // Template selection
    templateSelect.addEventListener('change', function() {
      const selectedValue = templateSelect.value;
      if (selectedValue) {
        const templates = JSON.parse(localStorage.getItem('sqlFormatterTemplates') || '{}');
        const template = templates[selectedValue];
        if (template) {
          dialectSelect.value = template.dialect;
          indentSelect.value = template.indent;
          uppercaseCheckbox.checked = template.uppercase;
          preserveCommentsCheckbox.checked = template.preserveComments;
          
          // Apply formatting with new settings
          if (sqlInput.value.trim()) {
            formatSql();
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
    sqlInput.addEventListener('input', function() {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(function() {
        if (sqlInput.value.trim()) {
          formatSql();
        } else {
          sqlOutput.textContent = '';
          clearAnalysis();
        }
      }, 500);
    });
  }
  
  // Format SQL function
  function formatSql() {
    try {
      const sqlText = sqlInput.value.trim();
      if (!sqlText) {
        sqlOutput.textContent = '';
        clearAnalysis();
        return;
      }
      
      // Get user formatting preferences
      const dialect = dialectSelect.value;
      const indent = " ".repeat(parseInt(indentSelect.value, 10));
      const uppercase = uppercaseCheckbox.checked;
      const preserveComments = preserveCommentsCheckbox.checked;
      
      if (!formatterReady) {
        loadSqlFormatter();
        sqlOutput.textContent = "Loading SQL formatter...";
        return;
      }
      
      // Format SQL
      try {
        // Map our dialect values to the ones expected by sql-formatter
        const dialectMap = {
          'standard': 'sql',
          'mysql': 'mysql',
          'postgresql': 'postgresql',
          'tsql': 'tsql',
          'oracle': 'plsql'
        };
        
        const formattedSql = sqlFormatter.format(sqlText, {
          language: dialectMap[dialect] || 'sql',
          indent: indent,
          uppercase: uppercase,
          linesBetweenQueries: 2,
          keywordCase: uppercase ? 'upper' : 'preserve',
        });
        
        // Display formatted SQL
        sqlOutput.textContent = formattedSql;
        
        // Apply syntax highlighting
        applyHighlighting();
        
        // Apply line numbers if enabled
        if (showLineNumbers) {
          applyLineNumbers();
        }
        
        // Add SQL doc tooltips
        addSqlDocsTooltips();
        
        // Analyze SQL
        analyzeSql(sqlText, dialect);
        
        // Save to history
        saveToHistory(sqlText, formattedSql, dialect);
        
      } catch (error) {
        // If sql-formatter fails, try our simple formatter
        sqlOutput.textContent = simpleFormat(sqlText);
        console.error('Error using SQL formatter library:', error);
      }
    } catch (error) {
      sqlOutput.textContent = `Error: ${error.message}`;
    }
  }
  
  // Apply syntax highlighting
  function applyHighlighting() {
    if (typeof hljs !== 'undefined') {
      const highlighted = hljs.highlight(sqlOutput.textContent, {language: 'sql'}).value;
      sqlOutput.innerHTML = highlighted;
    }
  }
  
  // Apply line numbers
  function applyLineNumbers() {
    if (!showLineNumbers) {
      // Remove line numbers if they exist
      if (sqlOutput.classList.contains('line-numbers')) {
        sqlOutput.classList.remove('line-numbers');
        const content = sqlOutput.innerHTML;
        sqlOutput.innerHTML = content.replace(/<span class="line">(.*?)<\/span>/g, '$1');
      }
      return;
    }
    
    // Add line numbers
    const content = sqlOutput.innerHTML;
    const lines = content.split('\n');
    let numberedContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        numberedContent += `<span class="line">${lines[i]}</span>\n`;
      } else {
        numberedContent += '\n';
      }
    }
    
    sqlOutput.innerHTML = numberedContent;
    sqlOutput.classList.add('line-numbers');
  }
  
  // Add tooltips with SQL documentation
  function addSqlDocsTooltips() {
    if (!sqlOutput.innerHTML) return;
    
    Object.keys(sqlKeywordsDefinitions).forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sqlOutput.innerHTML = sqlOutput.innerHTML.replace(regex, 
        `<span class="sql-keyword" data-docs="${sqlKeywordsDefinitions[keyword]}">$&</span>`);
    });
  }
  
  // Copy to clipboard
  function copyToClipboard() {
    if (sqlOutput.textContent) {
      navigator.clipboard.writeText(sqlOutput.textContent)
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
  }
  
  // Download SQL
  function downloadSql() {
    if (sqlOutput.textContent) {
      const blob = new Blob([sqlOutput.textContent], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formatted-sql-${new Date().toISOString().slice(0, 10)}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
  
  // Save to history
  function saveToHistory(originalSql, formattedSql, dialect) {
    const history = JSON.parse(localStorage.getItem('sqlFormatterHistory') || '[]');
    
    // Create a new history entry
    const entry = {
      timestamp: Date.now(),
      original: originalSql,
      formatted: formattedSql,
      dialect: dialect,
      preview: originalSql.substring(0, 50) + (originalSql.length > 50 ? '...' : '')
    };
    
    // Add to the beginning of the array
    history.unshift(entry);
    
    // Keep only the last 10 entries
    if (history.length > 10) {
      history.pop();
    }
    
    // Save back to localStorage
    localStorage.setItem('sqlFormatterHistory', JSON.stringify(history));
    
    // Update history dropdown
    updateHistoryDropdown();
  }
  
  // Load history from localStorage
  function loadHistory() {
    updateHistoryDropdown();
  }
  
  // Update history dropdown
  function updateHistoryDropdown() {
    const history = JSON.parse(localStorage.getItem('sqlFormatterHistory') || '[]');
    
    // Clear existing options except the default
    while (historySelect.options.length > 1) {
      historySelect.remove(1);
    }
    
    // Add history entries to dropdown
    history.forEach(entry => {
      const option = document.createElement('option');
      option.value = entry.timestamp;
      
      // Create a formatted date string
      const date = new Date(entry.timestamp);
      const dateStr = date.toLocaleString();
      
      option.text = `${dateStr} - ${entry.preview}`;
      historySelect.appendChild(option);
    });
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
    const name = templateNameInput.value.trim();
    if (!name) {
      alert('Please enter a template name');
      return;
    }
    
    const templates = JSON.parse(localStorage.getItem('sqlFormatterTemplates') || '{}');
    
    // Create template object with current settings
    templates[name] = {
      dialect: dialectSelect.value,
      indent: indentSelect.value,
      uppercase: uppercaseCheckbox.checked,
      preserveComments: preserveCommentsCheckbox.checked
    };
    
    // Save to localStorage
    localStorage.setItem('sqlFormatterTemplates', JSON.stringify(templates));
    
    // Update templates dropdown
    updateTemplatesDropdown();
    
    // Close modal
    closeTemplateModal();
  }
  
  // Load templates from localStorage
  function loadTemplates() {
    updateTemplatesDropdown();
  }
  
  // Update templates dropdown
  function updateTemplatesDropdown() {
    const templates = JSON.parse(localStorage.getItem('sqlFormatterTemplates') || '{}');
    
    // Clear existing options except the default
    while (templateSelect.options.length > 1) {
      templateSelect.remove(1);
    }
    
    // Add template entries to dropdown
    Object.keys(templates).forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.text = name;
      templateSelect.appendChild(option);
    });
  }
  
  // Toggle analysis panel visibility
  function toggleAnalysisPanel(show) {
    const analysisContent = sqlAnalysisSection.querySelector('.analysis-content');
    if (show) {
      analysisContent.style.display = 'block';
      toggleAnalysisButton.innerHTML = '<span class="icon">▼</span>';
    } else {
      analysisContent.style.display = 'none';
      toggleAnalysisButton.innerHTML = '<span class="icon">▶</span>';
    }
  }
  
  // Analyze SQL query
  function analyzeSql(sqlText, dialect) {
    try {
      // Extract tables
      const tables = extractTables(sqlText);
      displayTables(tables);
      
      // Generate simple schema visualization
      generateSchemaVisualization(tables);
      
      // Analyze query complexity and features
      analyzeQueryComplexity(sqlText);
      
    } catch (error) {
      console.error('Error analyzing SQL:', error);
      clearAnalysis();
    }
  }
  
  // Extract tables from SQL
  function extractTables(sqlText) {
    const tables = new Set();
    
    // Look for patterns like "FROM tableName" or "JOIN tableName"
    const fromMatches = sqlText.match(/FROM\s+([a-z0-9_\.]+)(\s+as\s+[a-z0-9_]+)?/gi);
    const joinMatches = sqlText.match(/JOIN\s+([a-z0-9_\.]+)(\s+as\s+[a-z0-9_]+)?/gi);
    
    if (fromMatches) {
      fromMatches.forEach(match => {
        // Extract table name
        const tableName = match.replace(/FROM\s+/i, '').split(/\s+/)[0];
        tables.add(tableName);
      });
    }
    
    if (joinMatches) {
      joinMatches.forEach(match => {
        // Extract table name
        const tableName = match.replace(/JOIN\s+/i, '').split(/\s+/)[0];
        tables.add(tableName);
      });
    }
    
    return Array.from(tables);
  }
  
  // Display tables
  function displayTables(tables) {
    if (!tables || tables.length === 0) {
      tablesListContainer.innerHTML = '<p>No tables detected</p>';
      return;
    }
    
    let html = '<ul class="tables-list">';
    tables.forEach(table => {
      html += `<li>${table}</li>`;
    });
    html += '</ul>';
    
    tablesListContainer.innerHTML = html;
  }
  
  // Generate schema visualization
  function generateSchemaVisualization(tables) {
    if (!tables || tables.length === 0) {
      schemaDiagramContainer.innerHTML = '<p>No tables to visualize</p>';
      return;
    }
    
    // For now, just show a placeholder. In a full implementation,
    // you would generate a diagram showing tables and their relationships
    schemaDiagramContainer.innerHTML = `
      <div class="schema-placeholder">
        <p>${tables.length} table${tables.length > 1 ? 's' : ''} in query</p>
        <p>Schema visualization coming soon!</p>
      </div>
    `;
  }
  
  // Analyze query complexity
  function analyzeQueryComplexity(sqlText) {
    // Count features
    const hasWhere = /WHERE\s/i.test(sqlText);
    const hasJoin = /JOIN\s/i.test(sqlText);
    const hasGroupBy = /GROUP\s+BY/i.test(sqlText);
    const hasOrderBy = /ORDER\s+BY/i.test(sqlText);
    const hasHaving = /HAVING\s/i.test(sqlText);
    const hasSubquery = /\(\s*SELECT/i.test(sqlText);
    const hasAggregate = /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(sqlText);
    
    let complexity = "Simple";
    let reasons = [];
    
    if (hasJoin) reasons.push("Uses joins");
    if (hasSubquery) {
      reasons.push("Uses subqueries");
      complexity = "Complex";
    }
    if (hasAggregate && hasGroupBy) reasons.push("Uses aggregations");
    if (hasHaving) reasons.push("Uses HAVING clause");
    
    if (reasons.length > 2 || hasSubquery) {
      complexity = "Complex";
    } else if (reasons.length > 0) {
      complexity = "Moderate";
    }
    
    // Generate info HTML
    const infoHtml = `
      <div class="query-info">
        <p><strong>Complexity:</strong> ${complexity}</p>
        <p><strong>Features:</strong></p>
        <ul>
          ${hasWhere ? '<li>WHERE clause</li>' : ''}
          ${hasJoin ? '<li>JOIN operations</li>' : ''}
          ${hasGroupBy ? '<li>GROUP BY clause</li>' : ''}
          ${hasOrderBy ? '<li>ORDER BY clause</li>' : ''}
          ${hasHaving ? '<li>HAVING clause</li>' : ''}
          ${hasSubquery ? '<li>Subqueries</li>' : ''}
          ${hasAggregate ? '<li>Aggregate functions</li>' : ''}
        </ul>
      </div>
    `;
    
    queryStatsContainer.innerHTML = infoHtml;
  }
  
  // Clear analysis panel
  function clearAnalysis() {
    tablesListContainer.innerHTML = '';
    schemaDiagramContainer.innerHTML = '';
    queryStatsContainer.innerHTML = '';
  }
  
  // Fallback if sql-formatter library isn't available
  // This is a very simple formatter as backup
  function simpleFormat(sql) {
    // Replace multiple spaces with a single space
    sql = sql.replace(/\s+/g, ' ');
    
    // Add line breaks after common SQL keywords
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 
      'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'LIMIT', 'OFFSET', 'UNION', 'INSERT INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE FROM'
    ];
    
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sql = sql.replace(regex, `\n${keyword.toUpperCase()}`);
    }
    
    // Add line breaks and indentation after commas in SELECT and GROUP BY clauses
    sql = sql.replace(/,/g, ',\n  ');
    
    return sql;
  }
  
  // Start the initialization
  init();
}); 