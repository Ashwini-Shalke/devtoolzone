/**
 * Code Diff Vendor Library - Handles loading external dependencies
 * This ensures libraries are loaded before the main code-diff-viewer.js
 */
(function() {
  // Keep track of which libraries we've loaded
  const loadedLibraries = {
    diff: false,
    highlightJs: false,
    highlightCss: false
  };
  
  // List of required libraries
  const requiredLibraries = [
    {
      name: 'diff',
      type: 'script',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/diff/5.1.0/diff.min.js',
      integrity: 'sha512-lbo0+U/Rz9W/v5fJ+Hd7d1RZkL0xoVeoT8UQZ4f9TftyMZKTkfIIj4rqutx78mzX1xhZf+Tn+UqFPK9ZkoTYQ==',
      flag: 'diff'
    },
    {
      name: 'highlightJs',
      type: 'script',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
      integrity: 'sha512-bgHRAiTjGrzHzLyKOnpFvaEpGzJet3z4tZnXGjpsCcqOnAH6VGUx9frc5akBnhHzLJoKE1Sw/XBLVgkADpAQdg==',
      flag: 'highlightJs'
    },
    {
      name: 'javascript',
      type: 'script',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/javascript.min.js',
      integrity: 'sha512-js3vQwKHoJGwANhm8Kw3CiHcDhG85SPS9CpCZx8GafMm8Ftn2VQQrVHQq2oc3NNpBjjR5v3QYXRwjJzykZCdIA==',
      flag: 'highlightJs',
      dependsOn: 'highlightJs'
    },
    {
      name: 'python',
      type: 'script',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/python.min.js',
      integrity: 'sha512-7xnZFHWBPj8ysV/8+ROcbBRY25uw7VU+zV7wc5iC/qVCdHSH6OdqFczY/Z3JUvUyx2FcDD/dmEzco6kQwTJXJA==',
      flag: 'highlightJs',
      dependsOn: 'highlightJs'
    },
    {
      name: 'highlightCss',
      type: 'style',
      url: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css',
      integrity: 'sha512-0aPQyyeZrWj9QzC3MAKxw2OD5iMWP4jKYpqJVGaJek+Zafy3QcVmg5bLrV5NiRwiVnWnXY8FcUjzFH3J+aGYHQ==',
      flag: 'highlightCss'
    }
  ];
  
  // Event to dispatch when all libraries are loaded
  const LIBRARIES_LOADED_EVENT = 'code-diff-libraries-loaded';
  
  // Function to check if all libraries have been loaded
  function checkAllLibrariesLoaded() {
    const allLoaded = Object.values(loadedLibraries).every(loaded => loaded);
    if (allLoaded) {
      // Dispatch event that all libraries are loaded
      const event = new Event(LIBRARIES_LOADED_EVENT);
      document.dispatchEvent(event);
      console.log('All code diff libraries loaded successfully');
    }
  }
  
  // Function to load a script with error handling
  function loadScript(library) {
    return new Promise((resolve, reject) => {
      // Skip if this library depends on another that hasn't loaded yet
      if (library.dependsOn && !loadedLibraries[library.dependsOn]) {
        console.log(`Skipping ${library.name} until ${library.dependsOn} is loaded`);
        resolve(false);
        return;
      }
      
      const script = document.createElement('script');
      script.src = library.url;
      if (library.integrity) {
        script.integrity = library.integrity;
        script.crossOrigin = 'anonymous';
      }
      
      script.onload = () => {
        console.log(`Loaded ${library.name} script`);
        if (library.flag) {
          loadedLibraries[library.flag] = true;
        }
        checkAllLibrariesLoaded();
        resolve(true);
      };
      
      script.onerror = () => {
        console.error(`Failed to load ${library.name} script`);
        reject(new Error(`Failed to load ${library.name}`));
      };
      
      document.head.appendChild(script);
    });
  }
  
  // Function to load a stylesheet with error handling
  function loadStylesheet(library) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = library.url;
      if (library.integrity) {
        link.integrity = library.integrity;
        link.crossOrigin = 'anonymous';
      }
      
      link.onload = () => {
        console.log(`Loaded ${library.name} stylesheet`);
        if (library.flag) {
          loadedLibraries[library.flag] = true;
        }
        checkAllLibrariesLoaded();
        resolve(true);
      };
      
      link.onerror = () => {
        console.error(`Failed to load ${library.name} stylesheet`);
        reject(new Error(`Failed to load ${library.name}`));
      };
      
      document.head.appendChild(link);
    });
  }
  
  // Load libraries in parallel with appropriate error handling
  async function loadLibraries() {
    try {
      // First load the core libraries (diff and highlight.js)
      const coreLibraries = requiredLibraries.filter(lib => !lib.dependsOn);
      
      await Promise.all(coreLibraries.map(library => {
        if (library.type === 'script') {
          return loadScript(library);
        } else if (library.type === 'style') {
          return loadStylesheet(library);
        }
      }));
      
      // Then load any dependent libraries
      const dependentLibraries = requiredLibraries.filter(lib => lib.dependsOn);
      
      await Promise.all(dependentLibraries.map(library => {
        if (library.type === 'script') {
          return loadScript(library);
        } else if (library.type === 'style') {
          return loadStylesheet(library);
        }
      }));
      
      // Final check in case all libraries were already loaded
      checkAllLibrariesLoaded();
      
    } catch (error) {
      console.error('Error loading libraries:', error);
      
      // Try to recover by loading the main script anyway
      const mainScript = document.createElement('script');
      mainScript.src = '/js/code-diff-viewer.js';
      document.head.appendChild(mainScript);
    }
  }
  
  // Check if libraries are already loaded on the page
  function checkExistingLibraries() {
    // Check for Diff library
    if (typeof Diff !== 'undefined' && Diff.diffLines) {
      console.log('Diff library already loaded');
      loadedLibraries.diff = true;
    }
    
    // Check for highlight.js
    if (typeof hljs !== 'undefined') {
      console.log('highlight.js already loaded');
      loadedLibraries.highlightJs = true;
    }
    
    // Check for highlight.js CSS (approximation)
    const allStyles = document.querySelectorAll('link[rel="stylesheet"]');
    for (const style of allStyles) {
      if (style.href.includes('highlight.js')) {
        console.log('highlight.js CSS already loaded');
        loadedLibraries.highlightCss = true;
        break;
      }
    }
  }
  
  // Start the loading process
  function init() {
    checkExistingLibraries();
    loadLibraries();
  }
  
  // Make the loaded event accessible
  window.CODE_DIFF_LIBRARIES_LOADED_EVENT = LIBRARIES_LOADED_EVENT;
  
  // Initialize immediately
  init();
})(); 