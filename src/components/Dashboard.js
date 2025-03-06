import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import '../css/admin.css'

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/applications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, []);

  return (<>
    <Navbar></Navbar>
    <div className="admin-dashboard">
      <h1>Applications</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Visit Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td >{app.userId.username}</td>
              <td>
                <span className="status" data-status={app.status}>
                  {app.status}
                </span>
              </td>
              <td>{new Date(app.visitDate).toLocaleDateString()}</td>
              <td>
                <Link className="view-btn" to={`/admin/applications/${app._id}`}>
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}