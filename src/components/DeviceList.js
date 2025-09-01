import React, { useState } from 'react';
import api from '../api/api';

const DeviceList = ({ devices, onDeviceUpdated }) => {
  const [assignedTo, setAssignedTo] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editedDevice, setEditedDevice] = useState({});

  const handleAssign = async (id) => {
    try {
      const userToAssign = assignedTo[id];
      if (!userToAssign) {
        alert('Por favor, digite um usuário para atribuir.');
        return;
      }
      await api.put(`/devices/${id}/assign`, { assignedTo: userToAssign });
      alert(`Coletor atribuído para ${userToAssign} com sucesso!`);
      setEditingId(null);
      setAssignedTo({});
      onDeviceUpdated();
    } catch (err) {
      alert('Erro ao atribuir coletor.');
      console.error(err);
    }
  };

  const handleUnassign = async (id) => {
    if (window.confirm('Tem certeza que deseja desvincular este coletor?')) {
      try {
        await api.put(`/devices/${id}/unassign`);
        alert('Coletor desvinculado com sucesso!');
        onDeviceUpdated();
      } catch (err) {
        alert('Erro ao desvincular coletor.');
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja DELETAR este coletor? Esta ação é irreversível.')) {
      try {
        await api.delete(`/devices/${id}`);
        alert('Coletor excluído com sucesso!');
        onDeviceUpdated();
      } catch (err) {
        alert('Erro ao excluir coletor.');
        console.error(err);
      }
    }
  };

  const startEditing = (device) => {
    setEditingId(device._id);
    setEditedDevice({ ...device });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedDevice({});
  };

  const handleSave = async () => {
    try {
      await api.put(`/devices/${editedDevice._id}`, editedDevice);
      alert('Informações do coletor salvas com sucesso!');
      cancelEditing();
      onDeviceUpdated();
    } catch (err) {
      alert('Erro ao salvar as informações do coletor.');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDevice(prev => ({ ...prev, [name]: value }));
  };

  const handleSetInactive = async (id) => {
    if (window.confirm('Tem certeza que deseja definir este coletor como inativo?')) {
      try {
        await api.put(`/devices/${id}/set-inactive`);
        alert('Coletor definido como inativo!');
        onDeviceUpdated();
      } catch (err) {
        alert('Erro ao definir como inativo.');
        console.error(err);
      }
    }
  };

  const handleAssignedToChange = (e, id) => {
    setAssignedTo(prev => ({ ...prev, [id]: e.target.value }));
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>MAC Address</th>
            <th style={styles.th}>Serial Number</th>
            <th style={styles.th}>Categoria</th>
            <th style={styles.th}>Login WMS</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Usuário Atribuído</th>
            <th style={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device._id} style={styles.tr}>
              {editingId === device._id ? (
                <>
                  <td style={styles.td}>
                    <input name="macAddress" value={editedDevice.macAddress} onChange={handleInputChange} style={styles.input} />
                  </td>
                  <td style={styles.td}>
                    <input name="serialNumber" value={editedDevice.serialNumber} onChange={handleInputChange} style={styles.input} />
                  </td>
                  <td style={styles.td}>
                    <input name="category" value={editedDevice.category} onChange={handleInputChange} style={styles.input} />
                  </td>
                  <td style={styles.td}>
                    <input name="wmsLogin" value={editedDevice.wmsLogin} onChange={handleInputChange} style={styles.input} />
                  </td>
                </>
              ) : (
                <>
                  <td style={styles.td}>{device.macAddress}</td>
                  <td style={styles.td}>{device.serialNumber}</td>
                  <td style={styles.td}>{device.category}</td>
                  <td style={styles.td}>{device.wmsLogin}</td>
                </>
              )}
              <td style={styles.td}>
                <span style={
                  device.status === 'ativo' ? styles.statusAtivo :
                  device.status === 'inativo' ? styles.statusInativo :
                  styles.statusDisponivel
                }>
                  {device.status}
                </span>
              </td>
              <td style={styles.td}>
                {device.assignedTo}
              </td>
              <td style={styles.td}>
                {editingId === device._id ? (
                  <>
                    <button onClick={handleSave} style={styles.actionButton}>Salvar</button>
                    <button onClick={cancelEditing} style={styles.cancelButton}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(device)} style={styles.editButton}>Editar</button>
                    {device.status === 'ativo' ? (
                      <button onClick={() => handleUnassign(device._id)} style={styles.unassignButton}>Desvincular</button>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={assignedTo[device._id] || ''}
                          onChange={(e) => handleAssignedToChange(e, device._id)}
                          placeholder="Login"
                          style={styles.input}
                        />
                        <button onClick={() => handleAssign(device._id)} style={styles.assignButton}>Atribuir</button>
                      </>
                    )}
                    <button onClick={() => handleSetInactive(device._id)} style={styles.inactiveButton}>Inativo</button>
                    <button onClick={() => handleDelete(device._id)} style={styles.deleteButton}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    color: 'var(--text-color)',
  },
  th: {
    backgroundColor: 'var(--background-color)',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid var(--border-color)',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    backgroundColor: 'var(--card-background)',
    transition: 'background-color 0.5s',
  },
  statusAtivo: {
    color: 'white',
    backgroundColor: '#28a745',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  statusInativo: {
    color: 'white',
    backgroundColor: '#dc3545',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  statusDisponivel: {
    color: 'black',
    backgroundColor: '#ffc107',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  actionButton: {
    padding: '6px 12px',
    marginRight: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
  },
  unassignButton: {
    backgroundColor: '#ffc107',
    color: 'black',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  assignButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  inactiveButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  editButton: {
    backgroundColor: '#17a2b8',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  input: {
    padding: '4px',
    borderRadius: '4px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--card-background)',
    color: 'var(--text-color)',
    width: '100px',
    transition: 'background-color 0.5s, color 0.5s, border-color 0.5s',
  },
};

export default DeviceList;