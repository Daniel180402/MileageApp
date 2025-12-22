
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        padding: '1.5rem',
        maxWidth: '320px',
        width: '90%',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--danger)' }}>
          <AlertTriangle size={24} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={onCancel}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              background: 'transparent', 
              border: '1px solid var(--text-muted)', 
              color: 'var(--text-primary)', 
              borderRadius: 'var(--radius-md)' 
            }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              background: 'var(--danger)', 
              color: 'white', 
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
