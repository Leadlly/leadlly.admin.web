import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Mentors from './pages/root/mentor'
// import Login from './pages/auth/Login'
// import Singup from './pages/auth/Singup'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Mentors/>}/>
        {/* <Route path='/login' element={ <Login/>}/>
        <Route path='/signup' element={ <Singup/>}/> */}
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
