import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import "../css/PrintApplication.css"

export default function PrintApplication() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/passport/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log(res)
        setApplication(res.data);
      } catch (error) {
        console.error("Error fetching application:", error.response ? error.response.data : error.message);
      }
    };
    fetchApplication();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!application) return <div>Loading...</div>;

  return (
    <>
      <Navbar className="navbar" />
      <div className="print-container">
        <h2>Application Details</h2>

        {/* User Details */}

        {/* Applicant Details */}
        <div className="applicant-info">
          <h3>Applicant Details</h3>
          <p><strong>Full-Name:</strong> {application.userId?.fullname || "Unknown"}</p>
          <p><strong>Email:</strong> {application.userId?.email || "No Email"}</p>
          <p><strong>Phone Number:</strong> {application.phonenumber}</p>
        <p><strong>Date of Birth:</strong> {new Date(application.dateofbirth).toLocaleDateString()}</p>
        <p><strong>Mother's Name:</strong> {application.mothername}</p>
        <p><strong>Father's Name:</strong> {application.fathername}</p>
        <p><strong>State:</strong> {application.state}</p>
        <p><strong>Country:</strong> {application.country}</p>
        <p><strong>Gender:</strong> {application.gender}</p>
        </div>

        {/* Center Details */}
        <div className="center-info">
          <h3>Center Details</h3>
          <p><strong>Center Name:</strong> {application.centerId?.centername || "Not Assigned"}</p>
          <p><strong>Center Address:</strong> {application.centerId?.location || "Not Available"}</p>
          <p><strong>Visit Date:</strong> {new Date(application.visitDate).toLocaleDateString()}</p>
        </div>
        
        {/* Status */}
        <div className="application-status">
          <h3>Application Status</h3>
          <p className={`status ${application.status.toLowerCase()}`}>
            {application.status}
          </p>
        </div>

        {/* Print Button */}
        <button onClick={handlePrint} className="print-btn">Print</button>
      </div>
    </>
  );
}
