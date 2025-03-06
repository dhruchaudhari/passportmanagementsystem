// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "./navbar.js";
// import { useNavigate } from "react-router-dom";

// export default function PassportApplication() {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [centers, setCenters] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState(0);
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     userId: "", 
//     centerId: "",
//     phonenumber: "", 
//     dateofbirth: "",
//     placeofbirth: "",
//     mothername: "",
//     fathername: "",
//     district: "",
//     state: "",
//     country: "",
//     gender: "", 
//     visitDate: "",
//     documents: {
//       adharcard: null,
//       birthcertificate: null,
//       utilitybill: null,
//     },
//   });

//   const [fullName, setFullName] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/centers")
//       .then((response) => setCenters(response.data.data))
//       .catch((error) => console.error("Error fetching centers:", error));
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       documents: {
//         ...formData.documents,
//         [e.target.name]: e.target.files[0],
//       },
//     });
//   };

//   const handleCenterChange = async (e) => {
//     const selectedCenter = e.target.value;
//     setFormData({ ...formData, centerId: selectedCenter });

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/centers/${selectedCenter}/slots`
//       );
//       setAvailableSlots(response.data.data.remainingslots);
//       console.log(availableSlots);
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//     }
//   };

//   const handleDateChange = async (e) => {
//     const selectedDate = new Date(e.target.value);
//     const day = selectedDate.getDay();
//     if (day === 6 || day === 0) {
//       alert("Weekends are not allowed. Please select a weekday.");
//       return;
//     }
//     setFormData({ ...formData, visitDate: e.target.value });

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/centers/${formData.centerId}/slots/${e.target.value}`
//       );
//       setAvailableSlots(response.data.data.remainingslots);
//     } catch (error) {
//       console.log("No slots found for this date, adding new slot...");
//       await axios.post(`http://localhost:5000/centers/${formData.centerId}/slots`, {
//         date: e.target.value,
//         remainingslots: 10, // Default slots
//       });
//       setAvailableSlots(10);
//     }
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     // Get userId from localStorage
//     const userId = localStorage.getItem("userId");
//     if (!userId) {
//       alert("User not authenticated");
//       setLoading(false);
//       return;
//     }

//     // Prepare form data (including files)
//     const applicationFormData = new FormData();
//     applicationFormData.append("userId", userId);
//     applicationFormData.append("centerId", formData.centerId);
//     applicationFormData.append("phonenumber", formData.phonenumber);
//     applicationFormData.append("dateofbirth", formData.dateofbirth);
//     applicationFormData.append("placeofbirth", formData.placeofbirth);
//     applicationFormData.append("mothername", formData.mothername);
//     applicationFormData.append("fathername", formData.fathername);
//     applicationFormData.append("district", formData.district);
//     applicationFormData.append("state", formData.state);
//     applicationFormData.append("country", formData.country);
//     applicationFormData.append("gender", formData.gender);
//     applicationFormData.append("visitDate" , formData.visitDate)

//     // Attach files if they exist
//     if (formData.documents) {
//       if (formData.documents.adharcard)
//         applicationFormData.append("adharcard", formData.documents.adharcard);
//       if (formData.documents.birthcertificate)
//         applicationFormData.append("birthcertificate", formData.documents.birthcertificate);
//       if (formData.documents.utilitybill)
//         applicationFormData.append("utilitybill", formData.documents.utilitybill);
//     }

//     // Submit the application (including files) to the backend
//     const applicationResponse = await axios.post(
//       "http://localhost:5000/passport/apply",
//       applicationFormData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     const applicationId = applicationResponse?.data?.data?._id;
//     if (!applicationId) throw new Error("Failed to submit application");


//     alert("Application submitted successfully!");
//     navigate("/profile")
//   } catch (error) {
//     console.error("Error submitting application:", error.response?.data || error.message);
//     alert("An error occurred while submitting the application.");
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleNext = () => setStep(step + 1);
//   const handlePrevious = () => setStep(step - 1);

//   return (
//     <>
//       <Navbar />
//       <div className="form-container">
//         <form onSubmit={handleSubmit} className="form-box">
//           {step === 1 && (
//             <>
//               <h4>Step 1: Personal Information</h4>
//               <input
//                 type="text"
//                 name="fullname"
//                 placeholder="Full Name"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 required
//               />
//               <input
//                 type="text"
//                 name="phonenumber" // Added phonenumber field
//                 placeholder="Phone Number"
//                 value={formData.phonenumber}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="fathername"
//                 placeholder="Father's Name"
//                 value={formData.fathername}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="mothername"
//                 placeholder="Mother's Name"
//                 value={formData.mothername}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="date"
//                 name="dateofbirth"
//                 value={formData.dateofbirth}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="placeofbirth"
//                 placeholder="Place of Birth"
//                 value={formData.placeofbirth}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="district"
//                 placeholder="District"
//                 value={formData.district}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={formData.state}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 required
//               />
//               <select
//                 name="gender" // Added gender field
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select Gender</option>
//                 <option value="MALE">Male</option>
//                 <option value="FEMALE">Female</option>
//                 <option value="OTHER">Other</option>
//               </select>
//               <button type="button" onClick={handleNext}>
//                 Next
//               </button>
//             </>
//           )}
//           {step === 2 && (
//             <>
//               <h4>Step 2: Upload Documents</h4>
//               Adharcard
//               <input
//                 type="file"
//                 name="adharcard"
//                 onChange={handleFileChange}
//                 required
//               />
//               Birth certificate
//               <input
//                 type="file"
//                 name="birthcertificate"
//                 onChange={handleFileChange}
//                 required
//               />
//               Utilitybill
//               <input
//                 type="file"
//                 name="utilitybill"
//                 onChange={handleFileChange}
//                 required
//               />
//               <button type="button" onClick={handlePrevious}>
//                 Previous
//               </button>
//               <button type="button" onClick={handleNext}>
//                 Next
//               </button>
//             </>
//           )}
//           {step === 3 && (
//             <>
//               <h4>Step 3: Select Center and Visit Date</h4>
//               <select className="s" name="centerId" onChange={handleCenterChange} required>
//                 <option value="">Select Center</option>
//                 {Array.isArray(centers) && centers.length > 0 ? (
//                   centers.map((center) => (
//                     <option key={center._id} value={center._id}>
//                       {center.centername} - {center.location}
//                     </option>
//                   ))
//                 ) : (
//                   <option disabled>No centers available</option>
//                 )}
//               </select>
//               Select date for visit
//               <input type="date" name="visitDate" onChange={handleDateChange} required />
//               {availableSlots !== null && <p>Available Slots: {availableSlots}</p>}
//               <div className="btns">
//                 <button type="button" onClick={handlePrevious}>
//                   Previous
//                 </button>
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Submitting..." : "Submit"}
//                 </button>
//               </div>
//             </>
//           )}
//         </form>
//       </div>
//       <style jsx>{`
//         .s {
//           margin: 10px;
//         }
//         .form-container {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           background: #f8f9fa;
//         }
//         .form-box {
//           margin-top: 80px;
//           background: white;
//           padding: 2rem;
//           border-radius: 10px;
//           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//           width: 700px;
//           display: flex;
//           flex-direction: column;
//         }
//         input {
//           margin-bottom: 15px;
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//           font-size: 16px;
//         }
//         select {
//           margin-bottom: 15px;
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//           font-size: 16px;
//         }
//         button {
//           background: #007bff;
//           color: white;
//           padding: 10px;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//           font-size: 16px;
//           margin: 5px;
//         }
//         button:hover {
//           background: #0056b3;
//         }
//       `}</style>
//     </>
//   );
// }



import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar.js";
import { useNavigate } from "react-router-dom";

export default function PassportApplication() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // State for success message
  const [message, setMessage] = useState({ text: "", type: "" }); // State for messages
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    centerId: "",
    phonenumber: "",
    dateofbirth: "",
    placeofbirth: "",
    mothername: "",
    fathername: "",
    district: "",
    state: "",
    country: "",
    gender: "",
    visitDate: "",
    documents: {
      adharcard: null,
      birthcertificate: null,
      utilitybill: null,
    },
  });

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/centers/")
      .then((response) => setCenters(response.data.data))
      .catch((error) => {
        console.error("Error fetching centers:", error);
        setMessage({ text: "Failed to fetch centers. Please try again.", type: "error" });
      });
  }, []);

  useEffect(() => {
    if (formData.centerId && formData.visitDate) {
      handleDateChange({ target: { value: formData.visitDate } });
    }
  }, [formData.centerId, formData.visitDate]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [e.target.name]: e.target.files[0],
      },
    });
  };

  const handleCenterChange = async (e) => {
    const selectedCenter = e.target.value;
    setFormData({ ...formData, centerId: selectedCenter });

    try {
      const response = await axios.get(
        `http://localhost:5000/centers/${selectedCenter}/slots`
      );
      const slots = response.data.data.slots ?? {}; // slots is now a Map (object)

      // If a visitDate is already selected, check the remaining slots for that date
      if (formData.visitDate) {
        const formattedDate = new Date(formData.visitDate).toISOString().split("T")[0];
        const remainingslots = slots[formattedDate] ? slots[formattedDate] : 10; // Default to 10 if no slot exists
        setAvailableSlots(remainingslots);
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const handleDateChange = async (e) => {
    const selectedDate = new Date(e.target.value);
    const day = selectedDate.getDay();

    if (day === 6 || day === 0) {
        setMessage({ text: "Weekends are not allowed. Please select a weekday.", type: "error" });
        return;
    }

    // Update formData correctly before making API request
    const formattedDate = selectedDate.toISOString().split("T")[0];
    setFormData((prevFormData) => ({ ...prevFormData, visitDate: formattedDate }));

    // Ensure centerId is valid
    if (!formData.centerId) {
        setMessage({ text: "Please select a center first.", type: "error" });
        return;
    }

    try {
        const response = await axios.get(`http://localhost:5000/centers/${formData.centerId}/slots`);
        const slotsArray = response.data.data ?? []; // Ensure we get an array

        console.log(slotsArray);

        // Convert array to an object for easy lookup
        const slotsMap = slotsArray.reduce((acc, { date, remainingslots }) => {
            acc[date] = remainingslots;
            return acc;
        }, {});

        // Get remaining slots or default to 10
        const remainingSlots = slotsMap[formattedDate] ?? 10;
        setAvailableSlots(remainingSlots);
    } catch (error) {
        console.error("Error fetching slots:", error);
        setMessage({ text: "Failed to fetch slots. Please try again.", type: "error" });
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get userId from localStorage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setMessage({ text: "User not authenticated. Please log in.", type: "error" });
        setLoading(false);
        return;
      }

      // Prepare form data (including files)
      const applicationFormData = new FormData();
      applicationFormData.append("userId", userId);
      applicationFormData.append("centerId", formData.centerId);
      applicationFormData.append("phonenumber", formData.phonenumber);
      applicationFormData.append("dateofbirth", formData.dateofbirth);
      applicationFormData.append("placeofbirth", formData.placeofbirth);
      applicationFormData.append("mothername", formData.mothername);
      applicationFormData.append("fathername", formData.fathername);
      applicationFormData.append("district", formData.district);
      applicationFormData.append("state", formData.state);
      applicationFormData.append("country", formData.country);
      applicationFormData.append("gender", formData.gender);
      applicationFormData.append("visitDate", formData.visitDate);

      // Attach files if they exist
      if (formData.documents) {
        if (formData.documents.adharcard)
          applicationFormData.append("adharcard", formData.documents.adharcard);
        if (formData.documents.birthcertificate)
          applicationFormData.append("birthcertificate", formData.documents.birthcertificate);
        if (formData.documents.utilitybill)
          applicationFormData.append("utilitybill", formData.documents.utilitybill);
      }

      // Submit the application (including files) to the backend
      const applicationResponse = await axios.post(
        "http://localhost:5000/passport/apply",
        applicationFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const applicationId = applicationResponse?.data?.data?._id;
      if (!applicationId) throw new Error("Failed to submit application");

      // Show success message
      // setMessage({ text: "Application submitted successfully!", type: "success" });
      setIsSubmitted(true);

      // Redirect to profile after 3 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error.response?.data || error.message);
      // setMessage({ text: "An error occurred while submitting the application.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <Navbar />
      <div className="form-container">
        {!isSubmitted && message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {isSubmitted ? (
          <div className="success-message">
            <h3>Application Submitted Successfully!</h3>
            <p>You will be redirected to your profile shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-box">
            <div className="stepper">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`step ${step === num ? 'active' : ''}`}>
                  {num}
                </div>
              ))}
            </div>
            {step === 1 && (
              <>
                <h4>Step 1: Personal Information</h4>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  name="phonenumber"
                  placeholder="Phone Number"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="fathername"
                  placeholder="Father's Name"
                  value={formData.fathername}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="mothername"
                  placeholder="Mother's Name"
                  value={formData.mothername}
                  onChange={handleChange}
                  required
                />
                <input
                  type="date"
                  name="dateofbirth"
                  value={formData.dateofbirth}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="placeofbirth"
                  placeholder="Place of Birth"
                  value={formData.placeofbirth}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <h4>Step 2: Upload Documents</h4>
                Adharcard
                <input
                  type="file"
                  name="adharcard"
                  onChange={handleFileChange}
                  required
                />
                Birth certificate
                <input
                  type="file"
                  name="birthcertificate"
                  onChange={handleFileChange}
                  required
                />
                Utilitybill
                <input
                  type="file"
                  name="utilitybill"
                  onChange={handleFileChange}
                  required
                />
                <button type="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}
            {step === 3 && (
              <>
                <h4>Step 3: Select Center and Visit Date</h4>
                <select className="s" name="centerId" onChange={handleCenterChange} required>
                  <option value="">Select Center</option>
                  {Array.isArray(centers) && centers.length > 0 ? (
                    centers.map((center) => (
                      <option key={center._id} value={center._id}>
                        {center.centername} - {center.location}
                      </option>
                    ))
                  ) : (
                    <option disabled>No centers available</option>
                  )}
                </select>
                Select date for visit
                <input type="date" name="visitDate" onChange={handleDateChange} required />
                {availableSlots !== null && <p>Available Slots: {availableSlots}</p>}
                <div className="btns">
                  <button type="button" onClick={handlePrevious}>
                    Previous
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
      <style jsx>{`
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f0f4f8;
    padding: 2rem;
  }

  .form-box {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    width: 100%;
    max-width: 700px;
    margin: 80px auto 2rem;
  }

  h4 {
    color: #2d3748;
    font-size: 1.3rem;
    margin: 1.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 3px solid #4299e1;
    font-family: 'Segoe UI', sans-serif;
  }

  input, select {
    width: 100%;
    padding: 12px 15px;
    margin: 8px 0;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66,153,225,0.2);
  }

  input[type="file"] {
    padding: 10px;
    background: #f8fafc;
    border: 2px dashed #cbd5e0;
  }

  input[type="file"]::file-selector-button {
    padding: 8px 16px;
    background: #4299e1;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  input[type="file"]::file-selector-button:hover {
    background: #3182ce;
  }

  .btns {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  button {
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  button[type="button"] {
    background: #718096;
    color: white;
  }

  button[type="submit"] {
    background: #4299e1;
    color: white;
  }

  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  button[type="button"]:hover {
    background: #4a5568;
  }

  button[type="submit"]:hover {
    background: #3182ce;
  }

  button:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .success {
    background: #f0fff4;
    color: #38a169;
    border: 2px solid #68d391;
  }

  .error {
    background: #fff5f5;
    color: #e53e3e;
    border: 2px solid #fc8181;
  }

  .success-message {
    text-align: center;
    padding: 2rem;
    background: #f0fff4;
    border-radius: 10px;
    border: 2px solid #68d391;
  }

  .success-message h3 {
    color: #38a169;
    margin-bottom: 1rem;
  }

  .success-message p {
    color: #38a169;
    opacity: 0.9;
  }

  .stepper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    position: relative;
    padding: 0 1rem;
  }

  .step {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #718096;
    position: relative;
    z-index: 1;
  }

  .step.active {
    background: #4299e1;
    color: white;
  }

  .stepper::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e2e8f0;
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    .form-container {
      padding: 1rem;
    }

    .form-box {
      padding: 1.25rem;
      margin-top: 70px;
    }

    h4 {
      font-size: 1.2rem;
      margin: 1rem 0;
    }

    button {
      width: 100%;
      padding: 12px;
    }

    .btns {
      flex-direction: column;
      margin-top: 1rem;
    }

    .stepper {
      margin-bottom: 0.5rem;
      padding: 0;
    }
  }
`}</style>
    </>
  );
}