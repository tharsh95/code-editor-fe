// Templates for reading stdin in different programming languages
export const stdinTemplates = {
  javascript: `const fs = require('fs');

// Read stdin
const stdin = fs.readFileSync(0, 'utf-8');
const input = JSON.parse(stdin.trim());

CODE_PLACEHOLDER

console.log(JSON.stringify(FUNCTION_NAME(input)));`,

  python: `from typing import Any, Dict, List, Union
import sys
import json

def FUNCTION_NAME(input: Union[Dict[str, Any], List[Any]]) -> Union[Dict[str, Any], List[Any]]:
    CODE_PLACEHOLDER

# Read stdin
stdin = sys.stdin.read()
input = json.loads(stdin.strip())

print(json.dumps(FUNCTION_NAME(input)))`,

};

// Extract function name from code
const extractFunctionName = (code) => {
  // Common patterns for function declarations
  const patterns = [
    /function\s+(\w+)\s*\(/,  // function name()
    /const\s+(\w+)\s*=\s*function\s*\(/,  // const name = function()
    /let\s+(\w+)\s*=\s*function\s*\(/,  // let name = function()
    /var\s+(\w+)\s*=\s*function\s*\(/,  // var name = function()
    /def\s+(\w+)\s*\(/,  // def name()
    /public\s+static\s+(\w+)\s*\(/,  // public static name()
    /(\w+)\s*\(/,  // name()
  ];

  for (const pattern of patterns) {
    const match = code.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Default to 'solution' if no function name is found
  return 'solution';
};

// Get the template for a specific language
export const getStdinTemplate = (language, code) => {
  const functionName = extractFunctionName(code);
  return (stdinTemplates[language] || '')
    .replace('CODE_PLACEHOLDER', code)
    .replace(/FUNCTION_NAME/g, functionName);
}; 