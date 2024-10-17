import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Mentors from './pages/root/mentor';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Singup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Student from './pages/student';
import Dashboard from './pages/root/dashboard';
import Loader from './pages/root/Loader';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [meetingsLength, setMeetingsLength] = useState<number>(0);

  useEffect(() => {
    // Check if the user is authenticated by checking for a token
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set authenticated state based on token presence

    const fetchMeetingsLength = async () => {
      // Here you can make an API call to fetch the actual meetings length
      const length = 5; // Example length value
      setMeetingsLength(length);
      setIsLoading(false); // Set loading to false after fetching length
    };

    fetchMeetingsLength();
  }, []);

  // Show loader while fetching
  if (isLoading) {
    return <Loader />; 
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard meetingsLength={meetingsLength} /> : <Navigate to="/login" />}
        />
        <Route
          path="/mentors"
          element={isAuthenticated ? <Mentors /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/studentdetails/:id"
          element={isAuthenticated ? <Student /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
