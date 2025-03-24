import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function PrintApplication() {
  const navigate = useNavigate()
  const { id } = useParams();
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/passport/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setApplication(res.data);
      } catch (error) {
        console.error("Error fetching application:", error.response ? error.response.data : error.message);
      }
    };
    fetchApplication();
  }, [id]);

  const handleDownload = () => {
    const input = document.getElementById("print-container");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`application_${id}.pdf`);
    });
    navigate("/myapplications")
  };

  if (!application) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <div id="print-container" style={styles.printContainer}>
        <h2 style={styles.heading}>Application Details</h2>

        {/* Applicant Details */}
        <div style={styles.section}>
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
        <div style={styles.section}>
          <h3>Center Details</h3>
          <p><strong>Center Name:</strong> {application.centerId?.centername || "Not Assigned"}</p>
          <p><strong>Center Address:</strong> {application.centerId?.location || "Not Available"}</p>
          <p><strong>Visit Date:</strong> {new Date(application.visitDate).toLocaleDateString()}</p>
        </div>
        
        {/* Status */}
        <div style={styles.section}>
          <h3>Application Status</h3>
          <p><strong>Status:</strong> {application.status}</p>
        </div>
      </div>

      {/* Download Button */}
      <button onClick={handleDownload} style={styles.downloadButton}>
        Download as PDF
      </button>
    </div>
  );
}

// Plain and simple styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  printContainer: {
    width: "800px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  downloadButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
  },
};