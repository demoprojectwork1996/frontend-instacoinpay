import { useEffect, useState } from "react";

export default function AdminPendingCard() {
  const [activated, setActivated] = useState([]);
  const [pending, setPending] = useState([]);
  const [inactive, setInactive] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 DEMO DATA
  const demoActivated = [
    { _id: "1", fullName: "Rahul Sharma", email: "rahul@gmail.com" },
    { _id: "2", fullName: "Amit Verma", email: "amit@yahoo.com" }
  ];

  const demoPending = [
    { _id: "3", fullName: "Neha Singh", email: "neha@gmail.com" },
    { _id: "4", fullName: "Rohit Das", email: "rohit@outlook.com" }
  ];

  const demoInactive = [
    { _id: "5", fullName: "Suresh Patel", email: "suresh@gmail.com" },
    { _id: "6", fullName: "Anita Roy", email: "anita@rediff.com" }
  ];

  useEffect(() => {
    const filterByEmail = (list) =>
      list.filter((u) =>
        u.email.toLowerCase().includes(search.toLowerCase())
      );

    setActivated(filterByEmail(demoActivated));
    setPending(filterByEmail(demoPending));
    setInactive(filterByEmail(demoInactive));
  }, [search]);

  return (
    <>
      {/* INLINE CSS */}
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #020617;
          padding: 30px;
          color: white;
        }

        .search-box {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: none;
          margin-bottom: 25px;
        }

        .columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .column {
          background: #0f172a;
          border-radius: 14px;
          padding: 20px;
        }

        .column h3 {
          margin-bottom: 15px;
          text-align: center;
        }

        .user-card {
          background: #020617;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .badge-active {
          color: #22c55e;
          font-weight: bold;
        }

        .badge-pending {
          color: #facc15;
          font-weight: bold;
        }

        .badge-inactive {
          color: #ef4444;
          font-weight: bold;
        }

        .empty {
          text-align: center;
          color: #94a3b8;
        }

        @media (max-width: 1024px) {
          .columns {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-page">
        <h2>Card Users Status</h2>

        {/* SEARCH */}
        <input
          className="search-box"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="columns">
          {/* ACTIVATED USERS */}
          <div className="column">
            <h3 className="badge-active">Activated Users</h3>

            {activated.length === 0 ? (
              <p className="empty">No activated users</p>
            ) : (
              activated.map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <span className="badge-active">Activated</span>
                </div>
              ))
            )}
          </div>

          {/* PENDING USERS */}
          <div className="column">
            <h3 className="badge-pending">Pending Users</h3>

            {pending.length === 0 ? (
              <p className="empty">No pending users</p>
            ) : (
              pending.map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <span className="badge-pending">Pending</span>
                </div>
              ))
            )}
          </div>

          {/* INACTIVE USERS */}
          <div className="column">
            <h3 className="badge-inactive">Inactive Users</h3>

            {inactive.length === 0 ? (
              <p className="empty">No inactive users</p>
            ) : (
              inactive.map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <span className="badge-inactive">Inactive</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}