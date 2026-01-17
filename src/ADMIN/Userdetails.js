import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Userdetails.css";

const API = "https://backend-instacoinpay-1.onrender.com/api/admin";

const Userdetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

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
    fetchUsers();
  };

  const suspendUser = async (id) => {
    const reason = prompt("Reason?");
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

  return (
    <div className="admin-container">
      <h2>User Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.isSuspended ? "Suspended" : "Active"}</td>
              <td>
                <button onClick={() => setEditingUser(u)}>Edit</button>

                {!u.isSuspended ? (
                  <button onClick={() => suspendUser(u._id)}>Suspend</button>
                ) : (
                  <button onClick={() => unsuspendUser(u._id)}>Unsuspend</button>
                )}

                <button onClick={() => deleteUser(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="modal">
          <input
            value={editingUser.fullName}
            onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
          />
          <input
            value={editingUser.country}
            onChange={e => setEditingUser({ ...editingUser, country: e.target.value })}
          />
          <button onClick={saveUser}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Userdetails;
