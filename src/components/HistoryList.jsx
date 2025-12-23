
import React from 'react';
import { Edit2, Trash2, Calendar, Gauge, Fuel } from 'lucide-react';

export const HistoryList = ({ entries, onEdit, onDelete }) => {
  if (!entries.length) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
        <Fuel size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>No entries yet</h3>
        <p>Add your first refuel to track your mileage.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>History</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.map(entry => (
          <div key={entry.id} className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Calendar size={14} />
                {new Date(entry.date).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="icon-btn" onClick={() => onEdit(entry)}><Edit2 size={16} /></button>
                <button className="icon-btn" onClick={() => onDelete(entry.id)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cost</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {typeof entry.cost === 'number' ? entry.cost.toFixed(2) : entry.cost}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reach</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {entry.reach} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>km</span>
                </div>
                {entry.finalMileage && (
                  <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Actual: <span style={{ color: 'var(--text-primary)' }}>{entry.finalMileage - entry.mileage}</span>
                    {entry.remainingReach && <span> + {entry.remainingReach}</span>}
                     
                    <span style={{ 
                      marginLeft: '0.5rem',
                      fontWeight: 700,
                      color: ((entry.finalMileage - entry.mileage + (entry.remainingReach || 0)) - entry.reach) >= 0 ? 'var(--success)' : 'var(--danger)'
                    }}>
                      ({((entry.finalMileage - entry.mileage + (entry.remainingReach || 0)) - entry.reach) > 0 ? '+' : ''}
                      {(entry.finalMileage - entry.mileage + (entry.remainingReach || 0)) - entry.reach})
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Gauge size={14} color="var(--text-muted)" />
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Odo: {entry.mileage} km</span>
              {!entry.isPrecise && (
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '12px' }}>Est</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
