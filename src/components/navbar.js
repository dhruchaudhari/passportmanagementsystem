// import React from 'react';
// import { Menu } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';



// export default function Navbar() {

//     const navigate = useNavigate()

//   return React.createElement(
//     'nav',
//     { className: 'navbar navbar-expand-md navbar-light bg-light fixed-top shadow-sm' },
//     React.createElement(
//       'div',
//       { className: 'container-fluid' },
//       // Logo Section
//       React.createElement(
//         'a',
//         { className: 'navbar-brand fw-bold text-primary', href: '#' },
//         'MyPassport'
//       ),
//       // Mobile Menu Toggle Button
//       React.createElement(
//         'button',
//         {
//           className: 'navbar-toggler',
//           type: 'button',
//           'data-bs-toggle': 'collapse',
//           'data-bs-target': '#navbarNav',
//           'aria-controls': 'navbarNav',
//           'aria-expanded': 'false',
//           'aria-label': 'Toggle navigation',
//         },
//         React.createElement(Menu, { size: 24, className: 'text-secondary' })
//       ),
//       // Collapsible Menu Section
//       React.createElement(
//         'div',
//         { className: 'collapse navbar-collapse', id: 'navbarNav' },
//         React.createElement(
//           'ul',
//           { className: 'navbar-nav ms-auto' },
//           React.createElement(
//             'li',
//             { className: 'nav-item' },
//             // React.createElement(
//             //   'a',
//             //   { className: 'nav-link text-secondary', href: '#' },
//             //   'Home'
//             // )
//           ),
//           React.createElement(
//             'li',
//             { className: 'nav-item' },
//             // React.createElement(
//             //   'a',
//             //   { className: 'nav-link text-secondary', href: '#' },
//             //   'About'
//             // )
//           ),
//           React.createElement(
//             'li',
//             { className: 'nav-item' },
//             // React.createElement(
//             //   'a',
//             //   { className: 'nav-link text-secondary', href: '#' },
//             //   'Services'
//             // )
//           ),
//           React.createElement(
//             'li',
//             { className: 'nav-item' },
//             // React.createElement(
//             //   'a',
//             //   { className: 'nav-link text-secondary', href: '#' },
//             //   'FAQs'
//             // )
//           ),
//           React.createElement(
//             'li',
//             { className: 'nav-item' },
//             // React.createElement(
//             //   'a',
//             //   { className: 'nav-link text-secondary', href: '#' },
//             //   'Contact Us'
//             // )
//           ),
//           React.createElement(
//             'li',
//             { className: 'nav-item' },
//             React.createElement(
//               'button',
//               {
//                 className: 'btn btn-primary text-white',
//                 style: { marginLeft: '10px' },
//                 onClick: ( ) => {navigate("/login")} 
//               },
//               'Login / Register'
//             )
//           )
//         )
//       )
//     )
//   );
// }


import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by verifying the token in localStorage
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Set true if token exists, otherwise false
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage and navigate to login
    localStorage.clear();
    setIsLoggedIn(false); // Update state
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top shadow-sm">
      <div className="container-fluid">
        {/* Logo Section */}
        <a className="navbar-brand fw-bold text-primary" href="/home">
          MyPassport
        </a>

        {/* Mobile Menu Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Menu size={24} className="text-secondary" />
        </button>

        {/* Collapsible Menu Section */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Conditionally Render Login/Register or Profile Button */}
            {!isLoggedIn ? (
              <li className="nav-item">
                <button
                  className="btn btn-primary text-white"
                  style={{ marginLeft: "10px" }}
                  onClick={() => navigate("/login")}
                >
                  Login / Register
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-primary text-white"
                    style={{ marginLeft: "10px"
                     }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-primary text-white"
                    style={{ marginLeft: "10px" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
