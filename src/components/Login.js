import React, { useState } from "react";
import axios from 'axios';
import '../css/auth.css'
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // useNavigate for redirecting

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST form data to the backend
      const response = await axios.post('http://localhost:5000/users/login', formData);
      const data = response.data.data;
      
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('user', JSON.stringify(data.user)); 
      localStorage.setItem('refreshToken',data.refreshToken );  // handle success
      localStorage.setItem('accessToken',data.accessToken );  // handle success
      // const userId =localStorage.getItem('userId');
      // console.log(userId);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        // Set the error message from server or display a generic error message
        setErrorMessage(error.response.data.msg || 'Invalid credentials, please try again');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", minWidth: '100vw' }}
      >
        <div className="card p-4 col-md-6 col-lg-5">
          <h2 className="text-center mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username or email
              </label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                id="username"
                placeholder="Enter your username or email"
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
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <p className="mt-3 text-center">
              Don't have an account?{" "}
              <Link to={"/register"} style={{ color: "#6200ea" }}>
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}