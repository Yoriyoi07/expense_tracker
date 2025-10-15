import React, { useEffect, useState } from 'react';
import api from '../api';

export default function StatusBadge() {
  const [status, setStatus] = useState({ api: 'unknown', db: 'unknown' });

  const load = async () => {
    try {
      const res = await api.get('/api/health');
      setStatus({ api: 'ok', db: res?.data?.db || 'unknown' });
    } catch (e) {
      setStatus({ api: 'down', db: 'unknown' });
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const color = status.api === 'ok' && status.db === 'connected' ? 'ok' : 'warn';
  return (
    <div className={`pill ${color}`} title={`API: ${status.api} · DB: ${status.db}`}>
      <span className={`dot ${color}`} />
      {status.db === 'connected' ? 'Online' : 'Connecting...'}
    </div>
  );
}
