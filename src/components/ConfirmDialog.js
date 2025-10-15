import React, { useEffect } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter') onConfirm?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <h3 id="confirm-title" style={{ marginTop: 0 }}>{title}</h3>
        {message && <p>{message}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>{cancelText}</button>
          <button className={`btn ${destructive ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
