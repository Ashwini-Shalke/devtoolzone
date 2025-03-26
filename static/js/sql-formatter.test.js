/**
 * SQL Formatter Test Suite
 * 
 * This file contains automated tests for the SQL Formatter tool's functionality.
 * Run these tests in the browser console when the SQL Formatter page is loaded.
 */

(function() {
  // Only run tests in development environment
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    console.log('SQL Formatter tests only run in development environment');
    return;
  }

  // Log test status
  console.log('SQL Formatter Test Suite: Starting tests...');
  
  // Wait for the formatter to be ready before running tests
  const waitForFormatter = setInterval(() => {
    if (typeof sqlFormatter !== 'undefined' && document.readyState === 'complete') {
      clearInterval(waitForFormatter);
      runTests();
    }
  }, 100);
  
  // Main test runner
  function runTests() {
    // Get UI elements
    const sqlInput = document.getElementById('sql-input');
    const sqlOutput = document.getElementById('sql-output');
    const formatButton = document.getElementById('format-button');
    const dialectSelect = document.getElementById('sql-dialect');
    const indentSelect = document.getElementById('indent-size');
    const uppercaseCheckbox = document.getElementById('uppercase-keywords');
    const preserveCommentsCheckbox = document.getElementById('preserve-comments');
    
    // Track test results
    let passedTests = 0;
    let failedTests = 0;
    const testResults = [];
    
    // Test utility functions
    function assert(condition, message) {
      if (condition) {
        passedTests++;
        testResults.push({ passed: true, message });
        console.log(`✅ PASSED: ${message}`);
      } else {
        failedTests++;
        testResults.push({ passed: false, message });
        console.error(`❌ FAILED: ${message}`);
      }
    }
    
    function runTest(testName, testFunction) {
      try {
        console.log(`Running test: ${testName}`);
        testFunction();
      } catch (error) {
        failedTests++;
        testResults.push({ passed: false, message: testName });
        console.error(`❌ ERROR in test "${testName}":`, error);
      }
    }
    
    function resetFormatter() {
      // Reset to default settings
      dialectSelect.value = 'standard';
      indentSelect.value = '4';
      uppercaseCheckbox.checked = true;
      preserveCommentsCheckbox.checked = true;
    }
    
    function testFormatting(testName, sqlToFormat, expectedPattern, options = {}) {
      // Set options if provided
      if (options.dialect) dialectSelect.value = options.dialect;
      if (options.indent) indentSelect.value = options.indent;
      if (options.uppercase !== undefined) uppercaseCheckbox.checked = options.uppercase;
      if (options.preserveComments !== undefined) preserveCommentsCheckbox.checked = options.preserveComments;
      
      // Input the SQL
      sqlInput.value = sqlToFormat;
      
      // Trigger formatting
      formatButton.click();
      
      // Allow time for async operations
      setTimeout(() => {
        // Check if output matches expected pattern
        const outputValue = sqlOutput.textContent || '';
        const matches = typeof expectedPattern === 'string' 
          ? outputValue.includes(expectedPattern)
          : expectedPattern.test(outputValue);
        
        assert(matches, testName);
        
        // Reset for next test
        resetFormatter();
      }, 100);
    }
    
    // Test Cases
    
    // 1. Standard SQL Test Cases
    runTest('Basic SELECT query formatting', () => {
      const sql = 'SELECT id, name, email FROM users WHERE status = "active" ORDER BY name;';
      const expectedPattern = 'SELECT\n    id,\n    name,\n    email\nFROM\n    users\nWHERE';
      testFormatting('Basic SELECT query formatting', sql, expectedPattern);
    });
    
    runTest('Complex SELECT with JOIN', () => {
      const sql = 'SELECT u.id, u.name, o.order_id, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = "shipped";';
      const expectedPattern = 'JOIN\n    orders o\nON';
      testFormatting('Complex SELECT with JOIN', sql, expectedPattern);
    });
    
    runTest('Query with subquery', () => {
      const sql = 'SELECT name FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100);';
      const expectedPattern = 'IN (\n        SELECT';
      testFormatting('Query with subquery', sql, expectedPattern);
    });
    
    // 2. Dialect-specific Tests
    
    // MySQL
    runTest('MySQL specific syntax', () => {
      const sql = 'SELECT * FROM users LIMIT 10 OFFSET 20;';
      const expectedPattern = 'LIMIT\n    10 OFFSET 20';
      testFormatting('MySQL specific syntax', sql, expectedPattern, { dialect: 'mysql' });
    });
    
    // PostgreSQL
    runTest('PostgreSQL specific syntax', () => {
      const sql = 'SELECT * FROM users WHERE name ILIKE "%john%";';
      const expectedPattern = 'ILIKE';
      testFormatting('PostgreSQL specific syntax', sql, expectedPattern, { dialect: 'postgresql' });
    });
    
    // T-SQL (SQL Server)
    runTest('T-SQL specific syntax', () => {
      const sql = 'SELECT TOP 10 * FROM users ORDER BY id;';
      const expectedPattern = 'SELECT\n    TOP 10';
      testFormatting('T-SQL specific syntax', sql, expectedPattern, { dialect: 'tsql' });
    });
    
    // Oracle
    runTest('Oracle specific syntax', () => {
      const sql = 'SELECT * FROM users WHERE ROWNUM <= 10;';
      const expectedPattern = 'ROWNUM <= 10';
      testFormatting('Oracle specific syntax', sql, expectedPattern, { dialect: 'oracle' });
    });
    
    // 3. Formatting Options Tests
    
    runTest('Indent size 2', () => {
      const sql = 'SELECT id, name FROM users;';
      const expectedPattern = 'SELECT\n  id,\n  name\nFROM';
      testFormatting('Indent size 2', sql, expectedPattern, { indent: '2' });
    });
    
    runTest('Lowercase keywords', () => {
      const sql = 'SELECT id FROM users;';
      const expectedPattern = 'select\n';
      testFormatting('Lowercase keywords', sql, expectedPattern, { uppercase: false });
    });
    
    // 4. Edge Cases
    
    runTest('SQL with comments', () => {
      const sql = 'SELECT id, name -- Get basic user info\nFROM users; -- Users table';
      const expectedPattern = '-- Get basic user info';
      testFormatting('SQL with comments', sql, expectedPattern);
    });
    
    runTest('SQL with string literals containing SQL', () => {
      const sql = "SELECT 'SELECT id FROM table' AS example_code FROM examples;";
      const expectedPattern = "'SELECT id FROM table'";
      testFormatting('SQL with string literals containing SQL', sql, expectedPattern);
    });
    
    runTest('Multiple SQL statements', () => {
      const sql = 'DELETE FROM temp_users; INSERT INTO audit_log VALUES (NOW(), "cleanup");';
      const expectedPattern = /DELETE.*?;\s+INSERT/s;
      testFormatting('Multiple SQL statements', sql, expectedPattern);
    });
    
    runTest('Complex GROUP BY with HAVING', () => {
      const sql = 'SELECT department, COUNT(*) as count FROM employees GROUP BY department HAVING count > 10 ORDER BY count DESC;';
      const expectedPattern = 'GROUP BY\n    department\nHAVING\n    count > 10';
      testFormatting('Complex GROUP BY with HAVING', sql, expectedPattern);
    });
    
    // 5. Feature-specific Tests
    
    // History feature
    runTest('History feature stores queries', () => {
      // Clear history first
      localStorage.removeItem('sqlFormatterHistory');
      
      // Format a SQL query
      const sql = 'SELECT test_col FROM test_table;';
      sqlInput.value = sql;
      formatButton.click();
      
      // Check if it was stored in history
      setTimeout(() => {
        const history = JSON.parse(localStorage.getItem('sqlFormatterHistory') || '[]');
        assert(history.length > 0, 'History feature stores queries');
        assert(history[0].original.includes('test_table'), 'History contains correct query');
      }, 100);
    });
    
    // Templates feature
    runTest('Templates feature saves and applies settings', () => {
      // Set up a custom template
      dialectSelect.value = 'postgresql';
      indentSelect.value = '2';
      uppercaseCheckbox.checked = false;
      
      // Save as template
      const templateName = 'TestTemplate' + Date.now();
      const templates = JSON.parse(localStorage.getItem('sqlFormatterTemplates') || '{}');
      templates[templateName] = {
        dialect: 'postgresql',
        indent: '2',
        uppercase: false,
        preserveComments: true
      };
      localStorage.setItem('sqlFormatterTemplates', JSON.stringify(templates));
      
      // Reset to default settings
      resetFormatter();
      
      // Test applying the template
      const templateSelect = document.getElementById('template-select');
      const option = document.createElement('option');
      option.value = templateName;
      option.text = templateName;
      templateSelect.appendChild(option);
      templateSelect.value = templateName;
      
      // Trigger change event
      const event = new Event('change');
      templateSelect.dispatchEvent(event);
      
      // Check if settings were applied
      setTimeout(() => {
        assert(dialectSelect.value === 'postgresql', 'Template applies correct dialect');
        assert(indentSelect.value === '2', 'Template applies correct indent');
        assert(uppercaseCheckbox.checked === false, 'Template applies correct case setting');
      }, 100);
    });
    
    // 6. Table extraction tests
    
    runTest('Table extraction from query', () => {
      // Use a query with multiple tables
      const sql = 'SELECT u.name, o.order_id FROM users u JOIN orders o ON u.id = o.user_id JOIN order_items oi ON o.id = oi.order_id;';
      sqlInput.value = sql;
      formatButton.click();
      
      // Check if tables are extracted
      setTimeout(() => {
        const tablesList = document.getElementById('tables-list').innerHTML;
        assert(tablesList.includes('users'), 'Extracts users table');
        assert(tablesList.includes('orders'), 'Extracts orders table');
        assert(tablesList.includes('order_items'), 'Extracts order_items table');
      }, 100);
    });
    
    // 7. Line numbers test
    
    runTest('Line numbers toggle', () => {
      // Format a simple query
      const sql = 'SELECT col1, col2, col3 FROM table1;';
      sqlInput.value = sql;
      formatButton.click();
      
      // Toggle line numbers on
      const toggleLineNumbersButton = document.getElementById('toggle-line-numbers');
      toggleLineNumbersButton.click();
      
      // Check if line numbers are displayed
      setTimeout(() => {
        assert(sqlOutput.classList.contains('line-numbers'), 'Line numbers class is added');
        assert(sqlOutput.querySelector('.line') !== null, 'Line elements are created');
        
        // Toggle back off
        toggleLineNumbersButton.click();
        
        // Check if removed
        setTimeout(() => {
          assert(!sqlOutput.classList.contains('line-numbers'), 'Line numbers class is removed');
        }, 50);
      }, 100);
    });
    
    // 8. Download test (mocked)
    
    runTest('Download functionality', () => {
      // Mock the download functionality
      const originalCreateElement = document.createElement;
      const mockAnchor = {
        href: '',
        download: '',
        click: function() {},
        remove: function() {}
      };
      
      document.createElement = function(tag) {
        if (tag.toLowerCase() === 'a') {
          return mockAnchor;
        }
        return originalCreateElement.call(document, tag);
      };
      
      // Set up spy
      let downloadCalled = false;
      mockAnchor.click = function() {
        downloadCalled = true;
      };
      
      // Format sample query
      sqlInput.value = 'SELECT test FROM download_test;';
      formatButton.click();
      
      // Trigger download
      const downloadButton = document.getElementById('download-button');
      downloadButton.click();
      
      // Restore original function
      document.createElement = originalCreateElement;
      
      // Check if download was triggered
      assert(downloadCalled, 'Download button triggers file download');
    });
    
    // Display test summary
    setTimeout(() => {
      console.log(`SQL Formatter Test Suite: ${passedTests} passed, ${failedTests} failed`);
      if (failedTests === 0) {
        console.log('🎉 All tests passed!');
      } else {
        console.warn(`⚠️ ${failedTests} tests failed.`);
        console.log('Failed tests:', testResults.filter(r => !r.passed).map(r => r.message));
      }
    }, 2000);
  }
})(); 