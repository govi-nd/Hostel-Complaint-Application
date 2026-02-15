
import { useEffect, useState } from "react";
import axios from "axios";
import userProfile from "./assets/userProfile.png";

const API = "http://localhost:5000/api/complaints";

function Dash({ setDash }) {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  // FETCH COMPLAINTS
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setComplaints(res.data);
    } catch (err) {
      alert("Failed to fetch complaints");
    }
  };

  // REGISTER COMPLAINT
  const registerComplaint = async () => {
    if (!title || !category) {
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        API,
        {
          title,
          category,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setTitle("");
      setCategory("");
      fetchComplaints();
    } catch {
      alert("Failed to register complaint");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="topDash">
        <h1>Welcome, Student 🎉</h1>
        <img src={userProfile} alt="profile" />
        <button
          onClick={() => {
            localStorage.clear();
            setDash(false);
          }}
        >
          Logout
        </button>
      </div>

      {/* RECENT COMPLAINTS */}
      <div className="cardDash">
        <h2>Recent Complaints</h2>
        {complaints.length === 0 && <p>No complaints yet</p>}

        {complaints.slice(0, 3).map((c) => (
          <div key={c.id} className="complaintRow">
            <span>{c.title}</span>
            <span>{c.status}</span>
          </div>
        ))}
      </div>

      {/* REGISTER COMPLAINT */}
      <div className="cardDash">
        <h2>Register Complaint</h2>
        <input
          placeholder="Complaint title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Category (Water / Electricity / Cleanliness)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={registerComplaint}>Submit</button>
      </div>

      {/* VIEW ALL COMPLAINTS */}
      <div className="cardDash">
        <h2>View My Complaints</h2>

        {complaints.map((c) => (
          <div key={c.id} className="complaintRow">
            <span>{c.title}</span>
            <span>{c.category}</span>
            <span>{c.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dash;