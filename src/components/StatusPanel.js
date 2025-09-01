import React from 'react';

const StatusPanel = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Estatísticas de Coletores</h3>
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statBox, ...styles.totalBox }}>
          <span style={styles.statValue}>{stats.total}</span>
          <span style={styles.statLabel}>Total</span>
        </div>
        <div style={{ ...styles.statBox, ...styles.activeBox }}>
          <span style={styles.statValue}>{stats.active}</span>
          <span style={styles.statLabel}>Ativos</span>
        </div>
        <div style={{ ...styles.statBox, ...styles.inactiveBox }}>
          <span style={styles.statValue}>{stats.inactive}</span>
          <span style={styles.statLabel}>Inativos</span>
        </div>
        <div style={{ ...styles.statBox, ...styles.availableBox }}>
          <span style={styles.statValue}>{stats.available}</span>
          <span style={styles.statLabel}>Disponíveis</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#333',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    textAlign: 'center',
  },
  statBox: {
    padding: '1rem',
    borderRadius: '8px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  totalBox: {
    backgroundColor: '#6c757d',
  },
  activeBox: {
    backgroundColor: '#28a745',
  },
  inactiveBox: {
    backgroundColor: '#dc3545',
  },
  availableBox: {
    backgroundColor: '#ffc107',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: '1rem',
    marginTop: '0.5rem',
  },
};

export default StatusPanel;