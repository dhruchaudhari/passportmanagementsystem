import './App.css';
import Register from './components/Register.js';
import Login from './components/Login.js';
import { Routes , Route } from 'react-router-dom';
import Home from './components/Home.js';
import Profile from './components/Profile.js';
import PassportApplication from './components/PassportApplication.js'
import MyApplications from './components/MySubmittedApplications';
import AdminDashboard from './components/Dashboard';
import ApplicationDetail from './components/ApplicationDetail';
import AdminRoute from './components/AdminRoute'
import PrintApplication from './components/PrintApplication.js';

function App() {
  
 
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Home></Home>}>
      </Route>
      <Route path ='/register' element={<Register></Register>}></Route>
      <Route path = '/login' element = {<Login></Login>}></Route>
      <Route path = '/home' element = {<Home></Home>}>
      </Route>
      <Route path='/passportapplication' element={<PassportApplication></PassportApplication>}></Route>
      <Route path='/profile' element={<Profile></Profile>}></Route>
      <Route path="/myapplications" element={<MyApplications />} />
      <Route path="/application/:id/download" element={<PrintApplication />} />
      
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }/>
        <Route path="/admin/applications/:id" element={
          <AdminRoute>
            <ApplicationDetail />
          </AdminRoute>
        }/>
      
      
    </Routes>
  </div>

  );
}

export default App;