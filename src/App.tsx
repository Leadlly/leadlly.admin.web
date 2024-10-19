import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Mentors from './pages/root/mentor';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Singup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Student from './pages/student';
import Dashboard from './pages/root/dashboard/page';
import Loader from './pages/root/Loader';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); 

  
    setIsLoading(false); 
  }, []);

  if (isLoading) {
    return <Loader />; 
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={isAuthenticated ? <Dashboard  /> : <Login/>}
        />
        <Route
          path="/mentors"
          element={isAuthenticated ? <Mentors /> : <Login />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/studentdetails/:id"
          element={isAuthenticated ? <Student /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
