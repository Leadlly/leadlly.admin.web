import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Mentors from './pages/root/mentor';
import Login from './pages/auth/Login';
import Singup from './pages/auth/Singup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Student from './pages/student';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/mentors' element={<Mentors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Singup />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/studentdetails/:id' element={<Student />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
