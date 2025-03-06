// // hero.js
// import { Calendar } from 'lucide-react';
// import React from 'react';

// export default function Hero() {
//   return React.createElement(
//     'div',
//     { className: 'hero-section' },
//     // Hero Content
//     React.createElement(
//       'div',
//       { className: 'container text-center hero-content' },
//       React.createElement(
//         'h1',
//         { className: 'hero-title' },
//         React.createElement('span', null, 'Easily Manage Your'),
//         React.createElement('br'),
//         React.createElement('span', { className: 'highlight-text' }, 'Passport Appointments')
//       ),
//       React.createElement(
//         'p',
//         { className: 'hero-description' },
//         'Schedule, manage, and track your passport appointments with ease. Fast, secure, and convenient.'
//       ),
//       React.createElement(
//         'div',
//         { className: 'button-container' },
//         React.createElement(
//           'button',
//           { className: 'btn btn-primary btn-lg' },
//           React.createElement(Calendar, { className: 'mr-2', size: 20 }),
//           'Book Appointment'
//         )
//       )
//     ),
//     // Image Section
//     // React.createElement(
//     //   'div',
//     //   { className: 'image-section' },
//     //   React.createElement('img', {
//     //     src: 'https://images.unsplash.com/photo-1540339832862-46d6a6d71bc5?auto=format&fit=crop&q=80',
//     //     alt: 'Travel and passport essentials on a desk',
//     //     className: 'hero-image',
//     //   }),
//     //   React.createElement('div', { className: 'gradient-overlay' })
//     // ),
//     // Style (Merged CSS)
//     React.createElement('style', null, `
//       .hero-section {
//         position: relative;
//         background-color: white;
//         padding-top: 16px;
//       }

//       .hero-content {
//         max-width: 1200px;
//         margin: 0 auto;
//         padding-top: 80px;
//         padding-bottom: 40px;
//       }

//       .hero-title {
//         font-size: 2.5rem;
//         font-weight: bold;
//         color: #1a202c;
//       }

//       .highlight-text {
//         color: #3182ce;
//       }

//       .hero-description {
//         margin-top: 20px;
//         max-width: 600px;
//         margin-left: auto;
//         margin-right: auto;
//         font-size: 1.25rem;
//         color: #4a5568;
//       }

//       .button-container {
//         margin-top: 40px;
//       }

//       .btn-primary {
//         background-color: #3182ce;
//         color: white;
//         padding: 12px 24px;
//         font-size: 1.25rem;
//         border-radius: 5px;
//         border: none;
//       }

//       .btn-primary:hover {
//         background-color: #2c5282;
//       }

//       .btn-lg {
//         font-size: 1.25rem;
//       }

//       .hero-image {
//         position: absolute;
//         inset: 0;
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//         border-radius: 10px;
//       }

//       .gradient-overlay {
//         position: absolute;
//         inset: 0;
//         background: linear-gradient(to top, white, rgba(255, 255, 255, 0.2));
//       }
//     `)
//   );
// }

import React from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {

  const navigate = useNavigate()

  const checklogin = () => {
    const userId =localStorage.getItem('userId');
    if(!userId){
      navigate("/login")
      return
    }
    navigate("/passportapplication")
  }

  return (
    <div className="hero-section">
      {/* Hero Content */}
      <div className="container text-center hero-content">
        <h1 className="hero-title">
          <span>Easily Manage Your</span>
          <br />
          <span className="highlight-text">Passport Appointments</span>
        </h1>
        <p className="hero-description">
          Schedule, manage, and track your passport appointments with ease. Fast, secure, and convenient.
        </p>
        <div className="button-container">
          <button className="btn btn-primary btn-lg" onClick={checklogin}>
            <Calendar className="mr-2" size={20} />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .hero-section {
          position: relative;
          background-color: white;
          padding-top: 16px;
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 80px;
          padding-bottom: 40px;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1a202c;
        }

        .highlight-text {
          color: #3182ce;
        }

        .hero-description {
          margin-top: 20px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-size: 1.25rem;
          color: #4a5568;
        }

        .button-container {
          margin-top: 40px;
        }

        .btn-primary {
          background-color: #3182ce;
          color: white;
          padding: 12px 24px;
          font-size: 1.25rem;
          border-radius: 5px;
          border: none;
        }

        .btn-primary:hover {
          background-color: #2c5282;
        }

        .btn-lg {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
}
