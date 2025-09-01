import React, { useState } from 'react';
import api from '../api/api';

const DeviceForm = ({ onDeviceAdded }) => {
  const [macAddress, setMacAddress] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [wmsLogin, setWmsLogin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/devices', { macAddress, serialNumber, category, wmsLogin });
      alert('Coletor adicionado com sucesso!');
      setMacAddress('');
      setSerialNumber('');
      setCategory('');
      setWmsLogin('');
      onDeviceAdded();
    } catch (err) {
      alert('Erro ao adicionar coletor. Verifique os dados.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Endereço MAC"
        value={macAddress}
        onChange={(e) => setMacAddress(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Número de Série"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Login WMS"
        value={wmsLogin}
        onChange={(e) => setWmsLogin(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Adicionar Coletor</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    transition: 'background-color 0.5s, color 0.5s, border-color 0.5s',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DeviceForm;