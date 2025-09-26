/**
 * Filters out common browser extension and development-related console errors
 * that don't affect the actual application functionality
 */

const FILTERED_ERROR_PATTERNS = [
  'Could not establish connection',
  'Receiving end does not exist',
  'deferred DOM Node could not be resolved',
  'Download the React DevTools',
  'Extension context invalidated',
  'chrome-extension://',
  'moz-extension://',
  'webkit-masked-url://',
  'Content Security Policy',
  'Non-Error promise rejection captured',
  'Error: Could not establish connection. Receiving end does not exist',
  'Uncaught (in promise) Error: Could not establish connection',
  'content-script.js',
  'extensions/::',
];

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

export function setupConsoleFiltering() {
  // Override console.error
  console.error = (...args: any[]) => {
    const message = args.join(' ').toString();
    
    // Check if this error should be filtered
    const shouldFilter = FILTERED_ERROR_PATTERNS.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!shouldFilter) {
      originalConsoleError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ').toString();
    
    // Check if this warning should be filtered
    const shouldFilter = FILTERED_ERROR_PATTERNS.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!shouldFilter) {
      originalConsoleWarn.apply(console, args);
    }
  };
}

export function restoreConsoleDefault() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

// Setup filtering automatically in development
if (process.env.NODE_ENV === 'development') {
  setupConsoleFiltering();
}