import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import DeviceList from '../components/DeviceList';
import DeviceForm from '../components/DeviceForm';
import StatusPanel from '../components/StatusPanel';
// Importação do WebSocket não é mais necessária aqui

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '' });

  // Use useCallback para evitar que a função seja recriada a cada render
  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/devices', { params: filters });
      setDevices(res.data);
    } catch (err) {
      console.error('Erro ao buscar dispositivos', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/devices/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Erro ao buscar estatísticas', err);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    fetchStats();

    // A lógica de conexão WebSocket deve usar o objeto nativo do navegador
    const ws = new WebSocket('wss://projeto-coletores.onrender.com');
    ws.onopen = () => console.log('Conectado ao servidor WebSocket');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      console.log('Update recebido:', update);

      switch (update.type) {
        case 'device-added':
        case 'device-updated':
        case 'device-deleted':
        case 'device-ping':
          fetchDevices();
          fetchStats();
          break;
        default:
          break;
      }
    };
    ws.onclose = () => console.log('Desconectado do servidor WebSocket');
    ws.onerror = (err) => console.error('Erro no WebSocket', err);

    return () => {
      ws.close();
    };
  }, [fetchDevices, fetchStats]); // Adicionado fetchDevices e fetchStats aqui
  
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Gerenciamento de Coletores</h1>
      <StatusPanel stats={stats} />

      <div style={styles.filterSection}>
        <h2 style={styles.subHeading}>Filtros</h2>
        <input
          type="text"
          name="search"
          placeholder="Buscar por MAC, Serial..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={styles.filterInput}
        />
        <select name="status" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} style={styles.filterSelect}>
          <option value="">Todos os Status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="disponível">Disponível</option>
        </select>
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Adicionar Novo Coletor</h2>
          <DeviceForm onDeviceAdded={() => { fetchDevices(); fetchStats(); }} />
        </div>
        <div style={styles.section}>
          <h2 style={styles.subHeading}>Lista de Coletores</h2>
          <DeviceList devices={devices} onDeviceUpdated={() => { fetchDevices(); fetchStats(); }} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: 'var(--text-color)',
  },
  subHeading: {
    marginBottom: '1rem',
    borderBottom: '2px solid var(--text-color)',
    paddingBottom: '0.5rem',
    color: 'var(--text-color)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
  },
  section: {
    backgroundColor: 'var(--card-background)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  filterSection: {
    backgroundColor: 'var(--card-background)',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  filterInput: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    marginRight: '1rem',
  },
  filterSelect: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
  },
};

export default Dashboard;