import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function fetchUsers() {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch {
      setError('Failed to load users.');
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function startEdit(u) {
    setEditingUser(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
    setError('');
    setSuccess('');
  }

  function cancelEdit() {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: '' });
  }

  async function saveEdit(id) {
    setError('');
    setSuccess('');
    try {
      const { data } = await api.put(`/admin/users/${id}`, editForm);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.user } : u)));
      setEditingUser(null);
      setSuccess('User updated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user.');
    }
  }

  function requestDelete(id, name) {
    setConfirmDelete({ id, name });
  }

  async function handleDelete() {
    const { id } = confirmDelete;
    setConfirmDelete(null);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccess('User deleted.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user.');
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>StudyDigest Admin</h1>
        <div className="header-right">
          <span>Admin: {user.name}</span>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <main className="admin-content">
        <h2>User Management</h2>
        <p className="admin-subtitle">{users.length} registered users</p>

        <Alert message={error} variant="error" onDismiss={() => setError('')} />
        <Alert message={success} variant="success" onDismiss={() => setSuccess('')} />

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                {editingUser === u.id ? (
                  <>
                    <td>
                      <input
                        className="edit-input"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="edit-input"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        className="edit-select"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-action save" onClick={() => saveEdit(u.id)}>Save</button>
                      <button className="btn-action cancel" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-action edit" onClick={() => startEdit(u)}>Edit</button>
                      {u.id !== user.id && (
                        <button className="btn-action delete" onClick={() => requestDelete(u.id, u.name)}>Delete</button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete User"
        message={confirmDelete ? `Delete user "${confirmDelete.name}" and all their data?` : ''}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
