document.addEventListener('DOMContentLoaded', function() {
  const sqlInput = document.getElementById('sql-input');
  const sqlOutput = document.getElementById('sql-output');
  const formatButton = document.getElementById('format-button');
  const clearButton = document.getElementById('clear-button');
  const copyButton = document.getElementById('copy-button');
  const dialectSelect = document.getElementById('sql-dialect');
  const indentSelect = document.getElementById('indent-size');
  const uppercaseCheckbox = document.getElementById('uppercase-keywords');
  
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
  
  // Initialize with sample
  sqlInput.value = sampleSql;
  
  // Format SQL when page loads
  formatSql();
  
  // Format SQL button click
  formatButton.addEventListener('click', function() {
    formatSql();
  });
  
  // Clear button click
  clearButton.addEventListener('click', function() {
    sqlInput.value = '';
    sqlOutput.textContent = '';
  });
  
  // Copy button click
  copyButton.addEventListener('click', function() {
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
      }
    }, 500);
  });
  
  // Format SQL function - uses sql-formatter library
  function formatSql() {
    try {
      const sqlText = sqlInput.value.trim();
      if (!sqlText) {
        sqlOutput.textContent = '';
        return;
      }
      
      // Get user formatting preferences
      const dialect = dialectSelect.value;
      const indent = " ".repeat(parseInt(indentSelect.value, 10));
      const uppercase = uppercaseCheckbox.checked;
      
      // Load the sql-formatter library dynamically if not already loaded
      if (typeof sqlFormatter === 'undefined') {
        // We're loading the library from a CDN for simplicity
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/sql-formatter@12.2.3/dist/sql-formatter.min.js';
        script.onload = function() {
          actuallyFormatSql(sqlText, dialect, indent, uppercase);
        };
        document.head.appendChild(script);
      } else {
        actuallyFormatSql(sqlText, dialect, indent, uppercase);
      }
    } catch (error) {
      sqlOutput.textContent = `Error: ${error.message}`;
    }
  }
  
  // Actual formatting function using the library
  function actuallyFormatSql(sqlText, dialect, indent, uppercase) {
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
        linesBetweenQueries: 2
      });
      
      sqlOutput.textContent = formattedSql;
      applyHighlighting();
    } catch (error) {
      sqlOutput.textContent = `Error: ${error.message}`;
    }
  }
  
  // Simple syntax highlighting for SQL
  function applyHighlighting() {
    // This is a placeholder for actual syntax highlighting
    // For production, consider using a library like highlight.js or Prism.js
    // Basic highlighting could be implemented here if needed
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
}); 