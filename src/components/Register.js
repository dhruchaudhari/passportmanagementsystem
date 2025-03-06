import React, { useState } from "react";
import axios from "axios";
import '../css/auth.css'
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

  const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        avatar: null,
      });
      const [message, setMessage] = useState("");
      const navigate = useNavigate();
    
      const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
          ...formData,
          [name]: files ? files[0] : value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const data = new FormData();
          data.append("username", formData.username);
          data.append("fullname", formData.fullname);
          data.append("email", formData.email);
          data.append("password", formData.password);
          data.append("avatar", formData.avatar);
    
          const response = await axios.post("http://localhost:5000/users/register", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
    
          console.log("Response:", response.data);
    
          // Navigate to /login if registration is successful
          if (response.data.statusCode === 201) {
            setMessage("Registered successfully");
            navigate("/login"); // Redirect to login page
          }
        } catch (error) {
          console.error("Registration Error:", error.stack);
    
          setMessage(
            error.response?.data?.message || "An error occurred during registration."
          );
        }
      };
  // const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   username: "",
  //   fullname: "",
  //   email: "",
  //   password: "",
  //   avatar: "",
  // });

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // POST form data to the backend
  //     const response = await axios.post(
  //       "http://localhost:5000/users/register",
  //       formData
  //     );
  //     console.log(response.data); // handle success
  //     navigate("/login");
  //   } catch (error) {
  //     if (error.response) {
  //       console.error(error.response.data); // handle error from server
  //     } else {
  //       console.error("Error:", error.message); // handle other errors
  //     }
  //   }
  // };

  return (
    <div>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", minWidth: "100vw" }}
      >
        <div className="card p-4 col-md-6 col-lg-5">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                id="username"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fullname" className="form-label">
                Fullname
              </label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                value={formData.fullname}
                onChange={handleChange}
                id="fullname"
                placeholder="Enter your fullname"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                id="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
            <p className="mt-3 text-center">
              Already have an account?{" "}
              <Link to={"/login"} style={{ color: "#6200ea" }}>
                {" "}
                Login{" "}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     fullname: "",
//     email: "",
//     password: "",
//     avatar: null,
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("username", formData.username);
//       data.append("fullname", formData.fullname);
//       data.append("email", formData.email);
//       data.append("password", formData.password);
//       data.append("avatar", formData.avatar);

//       const response = await axios.post("http://localhost:5000/users/register", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("Response:", response.data);

//       // Navigate to /login if registration is successful
//       if (response.data.statusCode === 201) {
//         setMessage("Registered successfully");
//         navigate("/login"); // Redirect to login page
//       }
//     } catch (error) {
//       console.error("Registration Error:", error.stack);

//       setMessage(
//         error.response?.data?.message || "An error occurred during registration."
//       );
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={formData.username}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="fullname"
//           placeholder="Full Name"
//           value={formData.fullname}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="file"
//           name="avatar"
//           accept="image/*"
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Register</button>
//       </form>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default Register;
