import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertCircle : Info;
        return (
          <div key={t.id} className={`toast ${t.type || 'info'}`}>
            <Icon
              size={18}
              color={
                t.type === 'success'
                  ? '#10b981'
                  : t.type === 'error'
                  ? '#f43f5e'
                  : '#6366f1'
              }
            />
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
