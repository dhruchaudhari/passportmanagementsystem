import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar.js";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const response = await axios.get(`http://localhost:5000/passport/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setApplications(response.data.data || []);
        console.log(response.data.data);
      } catch (error) {
        setError("Failed to fetch applications. Please try again.");
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="applications-container">
        <div className="applications-card">
          <h2>My Applications</h2>
          {error ? (
            <div className="error-message">{error}</div>
          ) : loading ? (
            <div className="loading-spinner"></div>
          ) : applications.length === 0 ? (
            <div className="no-applications">No applications found</div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app._id} className="application-card">
                  <div className="application-header">
                    <span>Application ID: {app._id}</span>
                    <span className={`status ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="application-details">
                    <p>Center: {app.centerId?.centername || 'N/A'}</p>
                    <p>Appointment Date: {new Date(app.visitDate).toLocaleDateString()}</p>
                    <p>Submitted: {new Date(app.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Add this CSS
const applicationsStyles = `
.applications-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 2rem;
}

.applications-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  width: 100%;
  max-width: 800px;
  margin-top: 80px;
}

.applications-card h2 {
  text-align: center;
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #4299e1;
}

.applications-list {
  display: grid;
  gap: 1.5rem;
}

.application-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.approved {
  background: #d4edda;
  color: #155724;
}

.status.rejected {
  background: #f8d7da;
  color: #721c24;
}

.application-details {
  display: grid;
  gap: 0.8rem;
  color: #4a5568;
}

.application-details p {
  margin: 0;
}

.no-applications {
  text-align: center;
  color: #718096;
  padding: 2rem;
}

@media (max-width: 768px) {
  .applications-card {
    padding: 1.5rem;
    margin-top: 70px;
  }

  .application-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
`;

// Add styles to the document
const applicationsStyleSheet = document.createElement('style');
applicationsStyleSheet.innerText = applicationsStyles;
document.head.appendChild(applicationsStyleSheet);