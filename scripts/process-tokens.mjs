import fs from 'node:fs';
import path from 'node:path';

// Read the tokens file
const tokensPath = path.resolve('token/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Function to flatten tokens and extract direct values
function flattenTokens(obj, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    
    if (value && typeof value === 'object' && value.value !== undefined) {
      // This is a token with a value
      if (typeof value.value === 'string' && value.value.startsWith('{') && value.value.endsWith('}')) {
        // Skip references for now
        continue;
      }
      result[newKey.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '')] = value.value;
    } else if (value && typeof value === 'object') {
      // Recursively process nested objects
      Object.assign(result, flattenTokens(value, newKey));
    }
  }
  
  return result;
}

// Process tokens
const flatTokens = flattenTokens(tokens);

// Generate CSS variables
let css = '/* Generated from Figma tokens */\n:root {\n';
for (const [key, value] of Object.entries(flatTokens)) {
  if (typeof value === 'number') {
    css += `  --${key}: ${value}px;\n`;
  } else if (typeof value === 'string') {
    css += `  --${key}: ${value};\n`;
  }
}
css += '}\n';

// Generate JavaScript export
let js = '/* Generated from Figma tokens */\n';
js += 'export default {\n';
for (const [key, value] of Object.entries(flatTokens)) {
  js += `  '${key}': ${JSON.stringify(value)},\n`;
}
js += '};\n';

// Create build directories
fs.mkdirSync('build/css', { recursive: true });
fs.mkdirSync('build/js', { recursive: true });

// Write files
fs.writeFileSync('build/css/tokens.css', css);
fs.writeFileSync('build/js/tokens.js', js);

console.log('✅ Generated build/css/tokens.css');
console.log('✅ Generated build/js/tokens.js');
console.log(`📊 Processed ${Object.keys(flatTokens).length} tokens`);
