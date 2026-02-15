import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashBoardAdmin() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    async function fetchData() {
      try {
        const compRes = await axios.get(
          "http://localhost:3000/admin",
          {
            headers: { authorization: token },
          }
        );

        setComplaints(compRes.data.allComplaints);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [navigate]);

  // 🔥 Mark Complaint as Done
  async function markAsDone(id) {
    try {
      await axios.put(
        `http://localhost:3000/markedDone/${id}`,
        {},
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      // Update UI instantly
      setComplaints((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, done: true } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  const pendingComplaints = complaints.filter(
    (item) => !item.done
  );

  return (
    <div className="dashboard">
      <h1 className="welcome">Welcome, Admin</h1>

      <div className="card recent-complaints">
        <h2>Recent Complaints</h2>

        <div className="recent-complaints-content">
          {pendingComplaints.length === 0 ? (
            <p>No complaints yet.</p>
          ) : (
            pendingComplaints.map((item) => (
              <div
                key={item._id}
                className={`complaint-item ${
                  item.urgent ? "urgent" : ""
                }`}
              >
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    {item.hostel}, Room {item.room_no}
                  </p>
                  <p>Status: Pending</p>
                </div>

                {item.urgent && (
                  <span className="urgent-badge">
                    Urgent
                  </span>
                )}

                <label
                  style={{ marginLeft: "60px" }}
                  className="checkbox"
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() =>
                      markAsDone(item._id)
                    }
                  />
                  Mark as done
                </label>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoardAdmin;
