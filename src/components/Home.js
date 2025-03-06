import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "./hero.js";
import Navbar from "./navbar.js";

export default function Home() {
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     // Send logout request to the backend
  //     const accessToken = localStorage.getItem('accessToken');
      
  //     const response = await axios.post("http://localhost:5000/users/logout", {}, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
      
  //     if (response.status === 200) {
  //       // Clear localStorage
  //       localStorage.removeItem("userId");
  //       localStorage.removeItem("refreshToken");
  //       localStorage.removeItem("accessToken");

  //       // Redirect to login page
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Logout failed:", error.response?.data?.msg || error.message);
  //     alert("Failed to log out. Please try again.");
  //   }
  // };

  return (<>
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <Navbar></Navbar>
      <Hero></Hero>
    </div>
    </>
  );
}





// import React from "react";
// import { Link } from "react-router-dom";
// import "../css/Home.css" // Optional: Add custom CSS for additional styling

// export default function Home() {
//   return (
//     <div>
//       {/* Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-light bg-primary">
//         <div className="container">
//           <a className="navbar-brand text-white fw-bold" href="/">
//             MyPassport
//           </a>
//         </div>
//       </nav>

//       {/* Body */}
//       <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
//         <div className="row text-center">
//           <div className="col-12 mb-4">
//             <h1 className="text-primary">Welcome to MyPassport</h1>
//           </div>
//           <div className="col-12 mb-3">
//             <Link to="/login" className="btn btn-primary btn-lg w-100">
//               Login
//             </Link>
//           </div>
//           <div className="col-12 mb-3">
//             <Link to="/register" className="btn btn-success btn-lg w-100">
//               Register
//             </Link>
//           </div>
//           <div className="col-12 mb-3">
//             <Link to="/appointment" className="btn btn-warning btn-lg w-100">
//               Appointment
//             </Link>
//           </div>
//           <div className="col-12 mb-3">
//             <Link to="/find-centers" className="btn btn-danger btn-lg w-100">
//               Find Centers
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



