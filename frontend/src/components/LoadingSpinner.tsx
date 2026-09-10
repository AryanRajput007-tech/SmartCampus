import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading...',
  size = 'md'
}) => {
  const sizePx = size === 'sm' ? '20px' : size === 'lg' ? '48px' : '32px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.75rem' }}>
      <div
        style={{
          width: sizePx,
          height: sizePx,
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      {message && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{message}</p>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
