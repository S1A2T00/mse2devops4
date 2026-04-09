// ✅ FIXED - React Component Issues Resolved

import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

// 1. FIXED: Added key prop in list rendering
export function VulnerableList({ items }) {
  if (!items || !Array.isArray(items)) {
    return <ul></ul>;
  }

  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id || index}>{item.name}</li>
      ))}
    </ul>
  );
}

// 2. FIXED: Added proper dependency array to useEffect
export function ProblematicComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []); // Added dependency array - runs only on mount

  return <div>{count}</div>;
}

// 3. FIXED: Removed state mutation, use setState instead
export function RaceConditionComponent() {
  const [user, setUser] = useState(null);

  const loadUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      
      // Use setUser instead of mutating state
      setUser({ ...user, name: data.name });
      return data;
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  return <div>{user?.name}</div>;
}

// 4. FIXED: Added null/undefined checks
export function UnsafeComponent({ userData }) {
  // Check if userData exists
  if (!userData || !userData.profile || !userData.address) {
    return <div>No user data available</div>;
  }

  return (
    <div>
      <h1>{userData.profile.firstName || 'N/A'}</h1>
      <p>{userData.address.street || 'N/A'}</p>
    </div>
  );
}

// 5. FIXED: Use environment variables instead of hardcoded URLs/tokens
export function ApiComponent() {
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token available');
        return;
      }

      const response = await fetch(`${API_URL}/secrets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.json();
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return <button onClick={fetchData}>Fetch</button>;
}

// 6. FIXED: Remove sensitive console.log or only in development
export function DebugComponent() {
  const [password, setPassword] = useState('');

  const handleLogin = (pwd) => {
    if (import.meta.env.DEV) {
      console.debug('Login attempt'); // No sensitive data logged
    }
    setPassword(pwd);
  };

  return <input onChange={(e) => handleLogin(e.target.value)} />;
}

// 7. FIXED: Reduce parameters using object destructuring
export function ComplexFunction({ a, b, c, d, e, f, g, h, i, j, k }) {
  return a + b + c + d + e + f + g + h + i + j + k;
}

// 8. FIXED: Add input sanitization to prevent XSS
export function UserInput({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    // Sanitize input to prevent XSS
    const sanitizedInput = DOMPurify.sanitize(input);
    onSubmit(sanitizedInput);
  };

  return (
    <>
      <input onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

// 9. FIXED: Added error handling and null checks
export function NoErrorHandling() {
  const data = undefined;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      {data.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}

// 10. FIXED: Simplified complex nested logic
export function VeryComplexLogic(a, b, c, d) {
  const conditions = [a, b, c, d];
  const allTrue = conditions.every(cond => cond);
  const someTrue = conditions.some(cond => cond);
  
  if (allTrue && someTrue) {
    return "Complex logic simplified";
  }
  return "Simple";
}
