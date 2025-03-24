import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar.js";
import { useNavigate } from "react-router-dom";
import "../css/PassportApplication.css";

export default function PassportApplication() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState([]);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false); // State for success message
  const [message, setMessage] = useState({ text: "", type: "" }); // State for messages
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State for payment success
  const [walletBalance, setWalletBalance] = useState(0); // State for wallet balance
  const [showAddFundsModal, setShowAddFundsModal] = useState(false); // State for add funds modal
  const [amount, setAmount] = useState(""); // State for amount to add to wallet
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
    const fetchWalletBalance = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Ensure token is stored in localStorage
        // console.log(token)
        if (!token) {
          console.error("No token found!");
          return;
        }
        
        const response = await axios.get("http://localhost:5000/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setWalletBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setMessage({ text: "Failed to fetch wallet balance.", type: "error" });
      }
    };

    fetchWalletBalance();
  }, [setWalletBalance]);

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

  const handlePayment = async () => {
    setLoading(true);

    try {
      console.log(localStorage.getItem("accessToken"))
      const response = await axios.post("http://localhost:5000/wallet/deduct",{amount: 50 },{ // ₹50 appointment fees
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });

      if (response.data.success) {
        setPaymentSuccess(true);
        setWalletBalance(response.data.balance); // Update wallet balance
        setMessage({ text: "Payment successful!", type: "success" });
      } else {
        setMessage({ text: response.data.message, type: "error" });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setMessage({ text: "Payment failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // const handleAddFunds = async () => {
  //   if (!amount || isNaN(amount)) {
  //     setMessage({ text: "Please enter a valid amount.", type: "error" });
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     // console.log(token)
  //     const response = axios.post("http://localhost:5000/wallet/add", { amount }, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  //     });

  //     if (response.data.success) {
  //       setWalletBalance(response.data.balance); // Update wallet balance
  //       setShowAddFundsModal(false); // Close the modal
  //       setMessage({ text: "Funds added successfully!", type: "success" });
  //     } else {
  //       setMessage({ text: response.data.message, type: "error" });
  //     }
  //   } catch (error) {
  //     console.error("Error adding funds:", error);
  //     setMessage({ text: "Failed to add funds. Please try again.", type: "error" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleAddFunds = async (e) => {
    e.preventDefault(); // Prevent form submission reload
  
    if (!amount || isNaN(amount)) {
      setMessage({ text: "Please enter a valid amount.", type: "error" });
      return;
    }
  
    setLoading(true);
  
    try {
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        setMessage({ text: "Authentication required. Please log in again.", type: "error" });
        return;
      }
  
      const response = await axios.post("http://localhost:5000/wallet/add", 
        { amount: Number(amount) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Add Funds Response:", response);
  
      if (response && response.data && response.data.success) {
        setWalletBalance(response.data.balance); // Update wallet balance
        setShowAddFundsModal(false); // Close modal
        setMessage({ text: "Funds added successfully!", type: "success" });
      } else {
        setMessage({ text: "Unexpected response format.", type: "error" });
      }
    } catch (error) {
      console.error("Error adding funds:", error);
  
      if (error.response) {
        console.log("Server Response:", error.response.data);
        setMessage({ text: error.response.data.message || "Failed to add funds.", type: "error" });
      } else {
        setMessage({ text: "Network error. Please try again.", type: "error" });
      }
    } finally {
      setLoading(false);
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
      setIsSubmitted(true);

      // Redirect to profile after 3 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error.response?.data || error.message);
      setMessage({ text: "An error occurred while submitting the application.", type: "error" });
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
          <form className="form-box">
            <div className="stepper">
              {[1, 2, 3, 4].map((num) => (
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
                <div>
                  <label>Adharcard      {!formData.documents.adharcard && <label className="required-fields"> *required </label>}</label>
                  <div className="file-input-container">
                    {formData.documents.adharcard ? (
                      <div className="file-preview">
                        <p>Selected: {formData.documents.adharcard.name}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              documents: { ...formData.documents, adharcard: null },
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="adharcard"
                          name="adharcard"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <label htmlFor="adharcard" className="custom-file-button">
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label>Birth Certificate  {!formData.documents.birthcertificate && <label className="required-fields"> *required </label>}</label>
                  <div className="file-input-container">
                    {formData.documents.birthcertificate ? (
                      <div className="file-preview">
                        <p>Selected: {formData.documents.birthcertificate.name}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              documents: { ...formData.documents, birthcertificate: null },
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="birthcertificate"
                          name="birthcertificate"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <label htmlFor="birthcertificate" className="custom-file-button">
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label>Utility Bill   {!formData.documents.utilitybill && <label className="required-fields"> *required </label>}</label>
                  <div className="file-input-container">
                    {formData.documents.utilitybill ? (
                      <div className="file-preview">
                        <p>Selected: {formData.documents.utilitybill.name}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              documents: { ...formData.documents, utilitybill: null },
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          id="utilitybill"
                          name="utilitybill"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <label htmlFor="utilitybill" className="custom-file-button">
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <button type="button" onClick={handlePrevious}>
                  Previous
                </button>
                <button className="next-btn" type="button" onClick={handleNext}>
                  Next
                </button>
              </>
            )}
            {step === 3 && (
  <>
    <h4>Step 3: Select Center and Visit Date</h4>
    <select
      className="s"
      name="centerId"
      value={formData.centerId} // Bind the value to formData.centerId
      onChange={handleCenterChange}
      required
    >
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
    <input
      type="date"
      name="visitDate"
      value={formData.visitDate} // Bind the value to formData.visitDate
      onChange={handleDateChange}
      required
    />
    {availableSlots !== null && <p>Available Slots: {availableSlots}</p>}
    <div className="btns">
      <button type="button" onClick={handlePrevious}>
        Previous
      </button>
      <button type="button" onClick={handleNext}>
        Next
      </button>
    </div>
  </>
)}
            {step === 4 && (
              <>
                <h4>Step 4: Payment</h4>
                <div className="payment-container">
                  <p>Appointment Fees: ₹50</p>
                  <p>Your Wallet Balance: ₹{walletBalance}</p>

                  {walletBalance >= 50 ? (
                    <button onClick={handlePayment} disabled={loading || paymentSuccess}>
                      {loading ? "Processing..." : paymentSuccess ? "Payment Successful" : "Pay Now"}
                    </button>
                  ) : (!paymentSuccess &&
                    <><h3>Add Funds to Wallet</h3>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button type = "button"onClick={handleAddFunds} disabled={loading}>
                {loading ? "Adding..." : "Add to Wallet"}
              </button></>
              
                    // <button type="button" onClick={() => setShowAddFundsModal(true)}>
                    //   Add Amount to Wallet
                    // </button>
                  )}

                  {paymentSuccess && (
                    <button onClick={handleSubmit} disabled={loading}>
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  )}
                </div>
                <button type="button" onClick={handlePrevious}>
                  Previous
                </button>
              </>
            )}
          </form>
        )}

        {/* Add Funds Modal */}
        {/* {showAddFundsModal && (
          <div className="modal-overlay">
            <div className="modal">
              
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}