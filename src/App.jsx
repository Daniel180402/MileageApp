
import React, { useState, useEffect } from 'react';
import { Plus, List, BarChart3, Settings } from 'lucide-react';
import { AddEntry } from './components/AddEntry';
import { HistoryList } from './components/HistoryList';
import { StatsDashboard } from './components/StatsDashboard';
import { StorageService } from './services/StorageService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConfirmModal } from './components/ConfirmModal';

function App() {
  const [activeTab, setActiveTab] = useState('add');
  const [entries, setEntries] = useState([]);
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = StorageService.getEntries();
    setEntries(data);
  };

  const handleSave = (entry) => {
    if (entryToEdit) {
      StorageService.updateEntry(entryToEdit.id, entry);
      setEntryToEdit(null);
    } else {
      StorageService.addEntry(entry);
    }
    loadData();
    setActiveTab('history');
  };

  const handleEdit = (entry) => {
    setEntryToEdit(entry);
    setActiveTab('add');
  };

  const handleDeleteRequest = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      StorageService.deleteEntry(deleteModal.id);
      loadData();
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddEntry onSave={handleSave} initialData={entryToEdit} onCancel={() => { setEntryToEdit(null); setActiveTab('history'); }} />;
      case 'history':
        return <HistoryList entries={entries} onEdit={handleEdit} onDelete={handleDeleteRequest} />;
      case 'stats':
        return <StatsDashboard entries={entries} />;
      default:
        return <AddEntry onSave={handleSave} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header glass-panel" style={{ 
        position: 'sticky', top: 0, zIndex: 10, margin: '1rem', padding: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Mileage<span style={{ color: 'var(--accent-primary)' }}>Tracker</span>
        </h1>
      </header>
      
      <main style={{ flex: 1, padding: '0 1rem 6rem 1rem' }}>
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </main>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title="Delete Entry"
        message="Are you sure you want to remove this refueling entry? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
      />

      <nav className="bottom-nav glass-panel" style={{
        position: 'fixed', bottom: '1rem', left: '1rem', right: '1rem', maxWidth: '568px', margin: '0 auto',
        height: '64px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        boxShadow: 'var(--shadow-lg)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <NavItem 
          active={activeTab === 'add'} 
          onClick={() => { setEntryToEdit(null); setActiveTab('add'); }} 
          icon={<Plus size={24} />} 
          label="Add" 
        />
        <NavItem 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<List size={24} />} 
          label="History" 
        />
        <NavItem 
          active={activeTab === 'stats'} 
          onClick={() => setActiveTab('stats')} 
          icon={<BarChart3 size={24} />} 
          label="Stats" 
        />
      </nav>
    </div>
  );
}

const NavItem = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    style={{
      background: 'transparent',
      color: active ? 'var(--accent-primary)' : 'var(--text-muted)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      fontSize: '0.7rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    }}
  >
    <div style={{
      padding: '4px', 
      borderRadius: '12px',
      background: active ? 'rgba(56, 189, 248, 0.1)' : 'transparent'
    }}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default App;
