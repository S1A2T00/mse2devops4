/* eslint-disable no-unused-vars, no-undef */
// ⚠️ INTENTIONAL BUGS FOR SONARQUBE TESTING - React Component Issues

import React, { useState, useEffect } from 'react';

// 1. Missing key prop in list rendering
export function VulnerableList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li>{item.name}</li>  // Missing key prop
      ))}
    </ul>
  );
}

// 2. Incorrect dependency array in useEffect
export function ProblematicComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetches every render due to missing dependencies
    fetch('/api/data')
      .then(r => r.json())
      .then(d => setData(d));
  }); // Missing dependency array - infinite loop!

  return <div>{count}</div>;
}

// 3. Race condition and state mutation
export function RaceConditionComponent() {
  const [user, setUser] = useState(null);

  const loadUser = async (id) => {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    // Directly mutating state - bad practice
    user.name = data.name;
    return user;
  };

  return <div>{user?.name}</div>;
}

// 4. Missing null/undefined checks
export function UnsafeComponent({ userData }) {
  // No check if userData exists
  return (
    <div>
      <h1>{userData.profile.firstName}</h1>{/* Potential null reference */}
      <p>{userData.address.street}</p>{/* Potential null reference */}
    </div>
  );
}

// 5. Hardcoded API URLs and credentials in component
export function ApiComponent() {
  const API_URL = "http://localhost:8080/api";
  const TOKEN = "hardcoded_jwt_token_abc123"; // Credentials in code!

  const fetchData = async () => {
    const response = await fetch(API_URL + "/secrets", {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.json();
  };

  return <button onClick={fetchData}>Fetch</button>;
}

// 6. Console.log left in production code
export function DebugComponent() {
  const [password, setPassword] = useState('');

  const handleLogin = (pwd) => {
    console.log("Password is: " + pwd); // Logging sensitive data!
    console.log("API Key: " + process.env.REACT_APP_SECRET_KEY);
  };

  return <input onChange={(e) => handleLogin(e.target.value)} />;
}

// 7. Function with too many parameters
export function ComplexFunction(a, b, c, d, e, f, g, h, i, j, k) {
  return a + b + c + d + e + f + g + h + i + j + k;
}

// 8. No input validation or sanitization
export function UserInput({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    // Direct injection - no sanitization
    const html = `<div>${input}</div>`; // XSS vulnerability!
    onSubmit(html);
  };

  return (
    <>
      <input onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

// 9. Missing error boundaries and error handling
export function NoErrorHandling() {
  const data = undefined;

  return (
    <div>
      {data.map(item => <p>{item}</p>)}{/* Will crash - no error boundary */}
    </div>
  );
}

// 10. Cognitive complexity - deeply nested conditions
export function VeryComplexLogic(a, b, c, d) {
  if (a) {
    if (b) {
      if (c) {
        if (d) {
          if (a && b) {
            if (c || d) {
              return "This is too complex";
            }
          }
        }
      }
    }
  }
  return "Simple";
}
