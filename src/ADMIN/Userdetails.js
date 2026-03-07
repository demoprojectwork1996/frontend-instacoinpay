import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Userdetails.css";

const API = "https://backend-instacoinpay-1.onrender.com/api/admin";

const Userdetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveUser = async () => {
    await axios.put(
      `${API}/users/${editingUser._id}`,
      editingUser,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setEditingUser(null);
    setIsModalOpen(false);
    fetchUsers();
  };

  const suspendUser = async (id) => {
    const reason = prompt("Reason for suspension?");
    if (!reason) return;

    await axios.put(
      `${API}/users/${id}/suspend`,
      { reason },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchUsers();
  };

  const unsuspendUser = async (id) => {
    await axios.put(
      `${API}/users/${id}/unsuspend`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user permanently?")) return;

    await axios.delete(`${API}/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchUsers();
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u =>
    `${u.fullName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="userdetails-admin-container">
      <div className="userdetails-header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>User Management</h2>
          <div className="userdetails-stats-info">
            <span className="userdetails-stat-badge">Total Users: {users.length}</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="userdetails-search-input"
        />
      </div>

      <div className="userdetails-table-container">
        <table className="userdetails-admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Bulk Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td data-label="Name">
                  <div className="userdetails-user-info">
                    <div className="userdetails-avatar-placeholder">
                      {u.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="userdetails-user-name">{u.fullName}</span>
                  </div>
                </td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Status">
                  <span className={`userdetails-status-badge ${u.isSuspended ? 'userdetails-suspended' : 'userdetails-active'}`}>
                    {u.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td data-label="Bulk Group">
                  {u.bulkGroup || "-"}
                </td>
                <td data-label="Actions">
                  <div className="userdetails-action-buttons">
                    <button className="userdetails-btn-edit" onClick={() => handleEditClick(u)}>
                      ✏️ Edit
                    </button>

                    {!u.isSuspended ? (
                      <button className="userdetails-btn-suspend" onClick={() => suspendUser(u._id)}>
                        ⏸️ Suspend
                      </button>
                    ) : (
                      <button className="userdetails-btn-unsuspend" onClick={() => unsuspendUser(u._id)}>
                        ▶️ Unsuspend
                      </button>
                    )}

                    <button className="userdetails-btn-delete" onClick={() => deleteUser(u._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingUser && (
        <div className="userdetails-modal-overlay" onClick={handleCloseModal}>
          <div className="userdetails-modal" onClick={e => e.stopPropagation()}>
            <div className="userdetails-modal-header">
              <h3>Edit User</h3>
              <button className="userdetails-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="userdetails-modal-body">
              <div className="userdetails-form-group">
                <label>Full Name</label>
                <input
                  value={editingUser.fullName || ""}
                  onChange={e =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="userdetails-form-group">
                <label>Country</label>
                <input
                  value={editingUser.country || ""}
                  onChange={e =>
                    setEditingUser({ ...editingUser, country: e.target.value })
                  }
                />
              </div>
              <div className="userdetails-form-group">
                <label>Email</label>
                <input value={editingUser.email || ""} disabled />
              </div>
            </div>
            <div className="userdetails-modal-footer">
              <button className="userdetails-btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="userdetails-btn-save" onClick={saveUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdetails;