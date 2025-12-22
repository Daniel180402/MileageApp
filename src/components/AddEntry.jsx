
import React, { useState, useEffect } from 'react';
import { Save, Calendar, Gauge, DollarSign, Activity } from 'lucide-react';

export const AddEntry = ({ onSave, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mileage: '', // Total Odometer
    reach: '',   // Trip Distance
    cost: '',    // Cost
    finalMileage: '',
    isPrecise: true,
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date.split('T')[0]
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      mileage: Number(formData.mileage),
      reach: Number(formData.reach),
      cost: Number(formData.cost),
      finalMileage: formData.finalMileage ? Number(formData.finalMileage) : null
    });
  };

  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>
        {initialData ? 'Edit Entry' : 'New Refuel'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Date</label>
          <div style={{ position: 'relative' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="date" 
              name="date" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.date} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Odometer (Total Mileage)</label>
          <div style={{ position: 'relative' }}>
            <Gauge size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="number" 
              name="mileage" 
              className="input-field" 
              placeholder="e.g. 150000"
              style={{ paddingLeft: '40px' }}
              value={formData.mileage} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Reach (Trip Distance)</label>
          <div style={{ position: 'relative' }}>
            <Activity size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="number" 
              name="reach" 
              className="input-field" 
              placeholder="e.g. 650"
              style={{ paddingLeft: '40px' }}
              value={formData.reach} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Cost</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="number" 
              name="cost" 
              step="0.01"
              className="input-field" 
              placeholder="e.g. 50.00"
              style={{ paddingLeft: '40px' }}
              value={formData.cost} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>


        {initialData && (
          <div className="input-group" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)' }}>
            <label className="input-label" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              Final Odometer (End of Tank)
            </label>
            <div style={{ position: 'relative' }}>
              <Gauge size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input 
                type="number" 
                name="finalMileage" 
                className="input-field" 
                placeholder="Before next refuel..."
                style={{ paddingLeft: '40px' }}
                value={formData.finalMileage || ''} 
                onChange={handleChange} 
              />
            </div>
            {formData.finalMileage && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                Actual Reach: <strong style={{ color: 'var(--text-primary)' }}>{Number(formData.finalMileage) - Number(formData.mileage)} km</strong>
                <br />
                Difference: <span style={{ 
                  color: (Number(formData.finalMileage) - Number(formData.mileage) - Number(formData.reach)) >= 0 ? 'var(--success)' : 'var(--danger)',
                  fontWeight: 600 
                }}>
                  {((Number(formData.finalMileage) - Number(formData.mileage)) - Number(formData.reach)) > 0 ? '+' : ''}
                  {(Number(formData.finalMileage) - Number(formData.mileage)) - Number(formData.reach)} km
                </span>
              </div>
            )}
          </div>
        )}

        <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <input 
            type="checkbox" 
            id="isPrecise" 
            name="isPrecise" 
            checked={formData.isPrecise} 
            onChange={handleChange}
            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-primary)' }} 
          />
          <label htmlFor="isPrecise" style={{ color: 'var(--text-primary)' }}>Precise Calculation?</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {initialData && (
            <button 
              type="button"
              onClick={onCancel}
              style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)' }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="primary-btn" style={{ flex: 2 }}>
            <Save size={20} />
            {initialData ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};
