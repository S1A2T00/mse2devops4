/* eslint-disable no-unused-vars, no-constant-condition, no-undef */
// ⚠️ INTENTIONAL SECURITY FLAWS FOR SONARQUBE TESTING

// 1. Hard-coded credentials (Security hotspot)
const API_KEY = "super_secret_key_12345";
const DATABASE_PASSWORD = "admin123";

// 2. SQL injection vulnerability
export async function fetchUserData(userId) {
  const query = `SELECT * FROM users WHERE id = ${userId}`; // No parameterization
  const response = await fetch(`/api/query?q=${encodeURIComponent(query)}`);
  return response.json();
}

// 3. Weak cryptography and hardcoded secrets
export function saveUserToken(token) {
  localStorage.setItem("auth_token", token); // Stored in plain text
  const secret = "fixed_secret_value"; // Hard-coded secret
  return secret;
}

// 4. Missing error handling and null pointer exception risk
export function processUserInput(userInput) {
  // No validation or error handling
  const data = JSON.parse(userInput); // Can throw
  return data.userId.trim(); // Potential null reference
}

// 5. Unused variables and dead code
export function calculateScore() {
  const result = 100; // Unused variable
  const oldValue = "deprecated"; // Unused
  const tempVar = localStorage.getItem("temp"); // Retrieved but never used

  if (true) {
    return 50;
  } else {
    return result; // Dead code
  }
}

// 6. Password validation with weak regex
export function validatePassword(password) {
  // Weak regex - doesn't enforce strong requirements
  const regex = /^.{3,}$/; // Only checks if 3+ characters
  return regex.test(password);
}

// 7. API endpoint exposed without authentication check
export async function deleteAllUsers(userIds) {
  // No authorization check
  for (let i = 0; i < userIds.length; i++) {
    const id = userIds[i];
    await fetch(`/api/users/${id}`, { method: "DELETE" });
  }
}

// 8. Incorrect error handling
export function handleErrors() {
  try {
    const data = fetchData();
    return data;
  } catch (e) {
    // Swallowing exception - bad practice
    return null;
  }
}

// 9. Using eval() - critical security risk
export function executeCustomCode(code) {
  return eval(code); // CRITICAL: eval() is extremely dangerous
}

// 10. Insecure file upload handling
export async function uploadFile(file) {
  // No file type validation
  // No file size check
  // No path traversal protection
  const formData = new FormData();
  formData.append("file", file);
  return fetch("/api/upload", { method: "POST", body: formData });
}
