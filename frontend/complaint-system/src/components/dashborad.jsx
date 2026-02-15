import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashBoard() {
  const [username, setUsername] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // FORM STATES
  const [title, setTitle] = useState("");
  const [hostel, setHostel] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [urgent, setUrgent] = useState(false);

  const navigate = useNavigate();

  function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const userRes = await axios.get("http://localhost:3000/me", {
          headers: { authorization: token },
        });

        setUsername(userRes.data.username);

        const compRes = await axios.get(
          "http://localhost:3000/get-complaints",
          {
            headers: { authorization: token },
          }
        );

        setComplaints(compRes.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [navigate]);

  // SUBMIT COMPLAINT
  async function submitComplaint(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:3000/new-complaint",
        {
          title,
          hostel,
          room_no: roomNo,
          urgent,
        },
        {
          headers: { authorization: token },
        }
      );

      // Add new complaint to UI instantly
      setComplaints([...complaints, res.data]);

      // Reset form
      setTitle("");
      setHostel("");
      setRoomNo("");
      setUrgent(false);
      setShowForm(false);

    } catch (err) {
      console.error(err);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const pendingComplaints = complaints.filter(item => !item.done);

  return (
    <div className="dashboard">
      <h1 className="welcome">Welcome, {capitalizeFirstLetter(username)}</h1>

      <div className="dashboard-container">
        <div className="card quick-actions">
          <h2>Quick Actions</h2>

          <div className="quick-actions-content">
            <button
              className="btn primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✖ Close Form" : "✏️ New Complaint"}
            </button>

            {showForm && (
              <div className="dropdown-form">
                <form onSubmit={submitComplaint}>
                  <input
                    type="text"
                    placeholder="Complaint Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Hostel"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Room Number"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    required
                  />

                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={urgent}
                      onChange={(e) => setUrgent(e.target.checked)}
                    />
                    Mark as urgent
                  </label>

                  <button type="submit" className="btn primary">
                    Submit Complaint
                  </button>
                </form>
              </div>
            )}

            <button className="btn danger" onClick={logout}>
              🔓 Logout
            </button>
          </div>
        </div>

        <div className="card recent-complaints">
          <h2>Recent Complaints</h2>

          <div className="recent-complaints-content">
            {pendingComplaints.length === 0 ? (
              <p>No complaints yet.</p>
            ) : (
              pendingComplaints.map((item) => (
                <div
                  key={item._id}
                  className={`complaint-item ${item.urgent ? "urgent" : ""}`}
                >
                  <div>
                    <h4>{item.title}</h4>
                    <p>
                      {item.hostel}, Room {item.room_no}
                    </p>
                    <p>Status: Pending</p>
                  </div>

                  {item.urgent && (
                    <span className="urgent-badge">Urgent</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;