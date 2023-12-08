import { Route, Routes } from 'react-router-dom'
import Home from './pages/main/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Landing from './pages/main/Landing'
import ForgotPassword from './pages/auth/forgot-password'
import OTP from './pages/auth/otp'
import ChangePassword from './pages/auth/change-password'
import './App.css';

function App() {
  return (
   <>
     <Routes>
      <Route path="/" element={<Landing/>}/>
        <Route path="/main/Home" element={<Home/>}/>
        <Route path="/auth/Login" element={<Login/>}/>
        <Route path="/auth/Signup" element={<Signup/>}/>
        <Route path="/auth/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/auth/forgot-password/otp" element={<OTP/>}/>
        <Route path="/auth/change-password" element={<ChangePassword/>}/>
     </Routes>
   </>
  );
}

export default App;
