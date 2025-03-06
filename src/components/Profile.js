// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./navbar.js";

// export default function Profile() {
//   const [userData, setUserData] = useState(null); // State to store user data
//   const [error, setError] = useState(""); // State to handle errors
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         // Fetch user data from the backend
//         const response = await axios.get("http://localhost:5000/users/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserData(response.data.data.user);
//       } catch (error) {
//         setError("Failed to fetch user data. Please try again.");
//         console.error(error);
//         if (error.response && error.response.status === 401) {
//           // If unauthorized, redirect to login
//           navigate("/login");
//         }
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       // Send logout request to the backend
//       const accessToken = localStorage.getItem('accessToken');
      
//       const response = await axios.post("http://localhost:5000/users/logout", {}, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
      
//       if (response.status === 200) {
//         // Clear localStorage
//         localStorage.removeItem("userId");
//         localStorage.removeItem("refreshToken");
//         localStorage.removeItem("accessToken");

//         // Redirect to login page
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Logout failed:", error.response?.data?.msg || error.message);
//       alert("Failed to log out. Please try again.");
//     }
//   };

//   return (
//   <>
//   <Navbar></Navbar>
//     <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        
//       <div className="card p-4 col-md-6 col-lg-5 shadow">
//         <h2 className="text-center mb-4">Profile</h2>
//         {error ? (
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         ) : userData ? (
//           <div className="text-center">
//             {/* Avatar Section */}
//             <img
//               src={userData.avatar || "https://via.placeholder.com/150"} // Use placeholder if no avatar
//               alt="Avatar"
//               className="rounded-circle mb-4"
//               style={{ width: "120px", height: "120px", objectFit: "cover" }}
//             />
//             <p><strong>Username:</strong> {userData.username}</p>
//             <p><strong>Full Name:</strong> {userData.fullname}</p>
//             <p><strong>Email:</strong> {userData.email}</p>
//             <button className="btn btn-danger w-100 mt-4" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//         ) : (
//           <div className="text-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar.js";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data.user);
      } catch (error) {
        setError("Failed to fetch user data. Please try again.");
        if (error.response?.status === 401) navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await axios.post("http://localhost:5000/users/logout", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <h2>User Profile</h2>
          {error ? (
            <div className="error-message">{error}</div>
          ) : userData ? (
            <div className="profile-content">
              <img
                src={userData.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="profile-avatar"
              />
              <div className="profile-details">
                <p><span>Username:</span> {userData.username}</p>
                <p><span>Full Name:</span> {userData.fullname}</p>
                <p><span>Email:</span> {userData.email}</p>
              </div>
              <div className="profile-actions">
                <button 
                  className="app-button primary"
                  onClick={() => navigate("/myapplications")}
                >
                  My Applications
                </button>
                <button 
                  className="app-button danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="loading-spinner"></div>
          )}
        </div>
      </div>
    </>
  );
}

const profileStyles = `
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 2rem;
}

.profile-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  width: 100%;
  max-width: 500px;
  margin-top: 80px;
}

.profile-card h2 {
  text-align: center;
  color: #2d3748;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #4299e1;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid #4299e1;
  box-shadow: 0 4px 12px rgba(66,153,225,0.3);
}

.profile-details {
  width: 100%;
  margin-bottom: 2rem;
}

.profile-details p {
  font-size: 1.1rem;
  margin: 1rem 0;
  padding: 0.8rem;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
}

.profile-details span {
  font-weight: 600;
  color: #2d3748;
}

.profile-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.app-button.primary {
  background: #4299e1;
  color: white;
}

.app-button.danger {
  background: #e53e3e;
  color: white;
}

.app-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.error-message {
  background: #fff5f5;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #fc8181;
  margin: 1rem 0;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }

  .profile-card {
    padding: 1.5rem;
    margin-top: 70px;
  }

  .profile-avatar {
    width: 120px;
    height: 120px;
  }

  .profile-details p {
    flex-direction: column;
    gap: 0.5rem;
  }
}
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.innerText = profileStyles;
document.head.appendChild(styleSheet);