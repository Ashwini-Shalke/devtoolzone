---
title: "Developer Tools"
description: "A collection of free online tools for developers to streamline common tasks. Welcome to our comprehensive suite of developer tools designed to make your coding life easier. All tools are free to use, work directly in your browser, and don't store any of your data."
layout: "devtools-index"
---

## Text & Code Tools

<div class="tools-grid">
  <a href="/devtools/json-formatter/" class="card-link">
    <div class="tool-card available">
      <div class="tool-icon">🔍</div>
      <h3>JSON Formatter</h3>
      <p>Format, validate, and beautify JSON data with syntax highlighting</p>
    </div>
  </a>
  
  <a href="/devtools/markdown-editor/" class="card-link">
    <div class="tool-card available">
      <div class="tool-icon">📝</div>
      <h3>Markdown Editor</h3>
      <p>Live preview markdown with syntax highlighting and export options</p>
    </div>
  </a>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">📊</div>
    <h3>SQL Formatter</h3>
    <p>Format SQL queries for better readability and debugging</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">📄</div>
    <h3>XML Formatter</h3>
    <p>Format and beautify XML documents</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">⚙️</div>
    <h3>Code Diff Viewer</h3>
    <p>Compare and highlight differences between code snippets</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🔄</div>
    <h3>CSV to JSON Converter</h3>
    <p>Convert between CSV and JSON data formats</p>
    <span class="badge">Coming Soon</span>
  </div>
</div>

## Encoding & Cryptography

<div class="tools-grid">
  <div class="tool-card coming-soon">
    <div class="tool-icon">🔒</div>
    <h3>Base64 Encoder/Decoder</h3>
    <p>Convert text between Base64 and plain formats</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🔠</div>
    <h3>URL Encoder/Decoder</h3>
    <p>Escape and unescape URL components</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🔏</div>
    <h3>JWT Decoder</h3>
    <p>Decode and verify JSON Web Tokens</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🔑</div>
    <h3>Hash Generator</h3>
    <p>Generate MD5, SHA-1, SHA-256, and other cryptographic hashes</p>
    <span class="badge">Coming Soon</span>
  </div>
</div>

## Web Development

<div class="tools-grid">
  <div class="tool-card coming-soon">
    <div class="tool-icon">⚡</div>
    <h3>HTML/CSS/JS Minifier</h3>
    <p>Compress web code to improve load times</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🎨</div>
    <h3>Color Picker & Converter</h3>
    <p>Select colors and convert between HEX, RGB, and HSL</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🪄</div>
    <h3>Regex Tester</h3>
    <p>Build, test, and debug regular expressions</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">📋</div>
    <h3>Lorem Ipsum Generator</h3>
    <p>Generate placeholder text for design mockups</p>
    <span class="badge">Coming Soon</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">⏰</div>
    <h3>Cron Expression Generator</h3>
    <p>Create and explain cron scheduling expressions</p>
    <span class="badge">Coming Soon</span>
  </div>
</div>

<style>
.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(230px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  width: 100%;
  box-sizing: border-box;
}

/* Card link styling */
.card-link {
  display: block;
  text-decoration: none !important;
  color: inherit !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  outline: none !important;
  box-shadow: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.card-link::after {
  display: none !important;
  content: none !important;
}

.card-link:hover {
  text-decoration: none !important;
  border: none !important;
  border-bottom: none !important;
}

.card-link:focus {
  outline: none !important;
  border: none !important;
}

.card-link:focus .tool-card {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
}

/* Responsive adjustments */
@media (max-width: 1400px) {
  .tools-grid {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
}

@media (max-width: 1000px) {
  .tools-grid {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
}

@media (max-width: 600px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

.tool-card {
  border-radius: 8px;
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: visible;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Style for clickable cards */
.tool-card.available {
  cursor: pointer;
}

.dark .tool-card {
  background-color: #2a2a2a;
}

body:not(.dark) .tool-card {
  background-color: #ffffff !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.08) !important;
  border-radius: 8px !important;
}

body:not(.dark) .tool-card.available {
  background-color: #ffffff !important;
  border: 1px solid #d0d0ff !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08) !important;
}

.dark .tool-card.available {
  background-color: #2a3144;
}

.tool-card:hover {
  transform: translateY(-5px);
}

.dark .tool-card:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

body:not(.dark) .tool-card:hover {
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.tool-card.available:hover {
  transform: translateY(-5px);
}

.dark .tool-card.available:hover {
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.2);
}

body:not(.dark) .tool-card.available:hover {
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.tool-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.tool-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal;
  hyphens: none;
}

.tool-card p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal;
  hyphens: none;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #64748b;
  color: white;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.coming-soon {
  opacity: 0.8;
}
</style> 