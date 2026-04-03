// ⚠️ MORE INTENTIONAL BUGS FOR SONARQUBE - Additional Issues

// 1. Weak random number generation (not cryptographically secure)
export function generateToken() {
  // Math.random() is NOT secure for tokens
  return Math.random().toString(36).substr(2);
}

// 2. Inadequate cryptographic hashing
import crypto from 'crypto';

export function hashPassword(password) {
  // MD5 is broken and should not be used!
  return crypto.createHash('md5').update(password).digest('hex');
}

// 3. Global state mutation without safeguards
let globalUserData = {};

export function updateGlobalUser(data) {
  globalUserData = data; // Unsafe global mutation
  return globalUserData;
}

// 4. Resource leak - not closing connections
export async function fetchWithoutCleanup(url) {
  const response = await fetch(url);
  return response.json(); // Response stream not properly handled
}

// 5. Command injection vulnerability
export function executeCommand(userInput) {
  const child_process = require('child_process');
  // Direct shell command execution - DANGEROUS!
  return child_process.exec(`process_file ${userInput}`);
}

// 6. Path traversal vulnerability
export function readFile(filePath) {
  const fs = require('fs');
  // No validation of filePath
  return fs.readFileSync(filePath, 'utf8'); // ../../etc/passwd possible
}

// 7. Insecure deserialization
export function parseUserData(jsonString) {
  return new Function('return ' + jsonString)(); // Code injection risk!
}

// 8. Missing data validation
export function processTransaction(amount, userId) {
  // No validation for amount (could be negative, NaN, etc.)
  const fee = amount * 0.1; // Potential miscalculation
  return amount - fee;
}

// 9. Observable timing attack vulnerability
export function authenticateUser(password, storedHash) {
  // Simple string comparison - vulnerable to timing attacks
  if (password === storedHash) {
    return true;
  }
  return false;
}

// 10. CORS misconfiguration
export function setupServer() {
  const express = require('express');
  const app = express();

  // Allow all origins - major security issue!
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  return app;
}

// 11. XSS vulnerability through dangerouslySetInnerHTML
export function RiskyRender({ content }) {
  // Content not sanitized - XSS attack vector!
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// 12. Ignored promise rejection
export function makeRequest(url) {
  fetch(url)
    .then(r => r.json())
    .catch(() => {}); // Empty catch - error ignored!
}

// 13. Unreachable code
export function checkValue(value) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  if (value === 0) return "zero";
  
  return "unreachable"; // This is unreachable
}

// 14. Variable shadowing
export function shadowingExample() {
  let x = 5;
  
  if (true) {
    let x = 10; // Shadows outer x - confusing!
    console.log(x); // Logs 10
  }
  
  console.log(x); // Logs 5
}

// 15. Untrusted data in regex
export function validateInput(userInput) {
  // User input directly used in regex - ReDoS attack possible
  const regex = new RegExp(userInput);
  return regex.test("test string");
}
