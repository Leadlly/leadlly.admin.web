
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/root/dashboard'; 
import Mentors from './pages/root/mentor'; 
import Login from './pages/auth/Login';
import Signup from './pages/auth/Singup';
import ForgotPassword from './pages/auth/ForgotPassword'; 
import Student from './pages/student';
import MainLayout from './pages/root/layout'; 

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/studentdetails/:id" element={<Student />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
