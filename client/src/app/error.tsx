"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      padding: 40, 
      background: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: 40,
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: 600,
        width: '100%'
      }}>
        <h2 style={{ color: '#c00', marginBottom: 16 }}>Something went wrong!</h2>
        <pre style={{ 
          color: 'red', 
          background: '#fff', 
          padding: 16, 
          borderRadius: 8, 
          maxWidth: '100%', 
          overflowX: 'auto',
          border: '1px solid #e5e7eb',
          fontSize: '14px'
        }}>
          {error.message}
        </pre>
        <button 
          style={{ 
            marginTop: 24, 
            padding: '10px 24px', 
            borderRadius: 6, 
            background: '#DAFF7D', 
            color: '#222', 
            fontWeight: 700, 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '16px'
          }} 
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
} 