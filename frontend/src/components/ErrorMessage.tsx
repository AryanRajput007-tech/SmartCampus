import React from 'react';

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-danger-light)',
        border: '1px solid #fca5a5',
        color: '#b91c1c',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm"
          style={{ backgroundColor: '#ffffff', color: '#b91c1c', border: '1px solid #fca5a5' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};
