import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/ApplicationDetail.css'
import { useNavigate } from "react-router-dom";
import Navbar from './navbar'

export default function ApplicationDetail() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("Fetching application with ID:", id); // Debugging
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/applications/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log("Application fetched:", res.data); // Debugging
        setApplication(res.data);
        setStatus(res.data.status);
      } catch (error) {
        console.error("Error fetching application:", error.response ? error.response.data : error.message);
      }
    };
    fetchApplication();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating status:", status);
      await axios.patch(
        `http://localhost:5000/api/admin/applications/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      alert("Status updated successfully!");
      navigate("/admin")
    } catch (error) {
      console.error("Error updating status:", error.response ? error.response.data : error.message);
    }
  };

  if (!application) return <div>Loading...</div>;

  return (
    <>
    <Navbar></Navbar>
    <div className="application-detail">
      <h2>Application Details</h2>

      {/* User Info */}
      <div className="user-info">
        <h3>User Details</h3>
        <p><strong>Username:</strong> {application.userId?.username || "Unknown"}</p>
        <p><strong>Email:</strong> {application.userId?.email || "No Email"}</p>
      </div>

      {/* Center Details */}
      <div className="center-info">
        <h3>Center Details</h3>
        <p><strong>Center Name:</strong> {application.centerId?.centername || "Not Assigned"}</p>
        <p><strong>Center Address:</strong> {application.centerId?.location || "Not Available"}</p>
        <p><strong>Visit Date:</strong> {new Date(application.visitDate).toLocaleDateString()}</p>
      </div>

      {/* Applicant Details */}
      <div className="applicant-info">
        <h3>Applicant Details</h3>
        <p><strong>Phone Number:</strong> {application.phonenumber}</p>
        <p><strong>Date of Birth:</strong> {new Date(application.dateofbirth).toLocaleDateString()}</p>
        <p><strong>Place of Birth:</strong> {application.placeofbirth}</p>
        <p><strong>Mother's Name:</strong> {application.mothername}</p>
        <p><strong>Father's Name:</strong> {application.fathername}</p>
        <p><strong>District:</strong> {application.district}</p>
        <p><strong>State:</strong> {application.state}</p>
        <p><strong>Country:</strong> {application.country}</p>
        <p><strong>Gender:</strong> {application.gender}</p>
      </div>

      {/* Document Links */}
      <div className="documents">
        <h3>Documents</h3>
        <div className="document-links">
          {application.documents && application.documents.length > 0 ? (
            application.documents.map((doc, index) => (
              <div key={index}>
                <a href={doc.adharcard} target="_blank" rel="noopener noreferrer">
                  Aadhar Card
                </a>
                <a href={doc.birthcertificate} target="_blank" rel="noopener noreferrer">
                  Birth Certificate
                </a>
                <a href={doc.utilitybill} target="_blank" rel="noopener noreferrer">
                  Utility Bill
                </a>
              </div>
            ))
          ) : (
            <p>No documents available</p>
          )}
        </div>
      </div>


      {/* Status Update Form */}
      <form onSubmit={handleSubmit}>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </label>
        <button type="submit">Update Status</button>
      </form>
    </div>
    </>
  );
}
