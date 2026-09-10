import React from 'react';

export const EmptyState: React.FC<{
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ icon = '📂', title, description, actionText, onAction }) => {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        margin: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed'
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: actionText ? '1.5rem' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};
