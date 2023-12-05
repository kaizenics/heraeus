import { Route, Routes } from 'react-router-dom'
import Home from './pages/main/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Landing from './pages/main/Landing'
import './App.css';

function App() {
  return (
   <>
     <Routes>
      <Route path="/" element={<Landing/>}/>
        <Route path="/main/Home" element={<Home/>}/>
        <Route path="/auth/Login" element={<Login/>}/>
        <Route path="/auth/Signup" element={<Signup/>}/>
     </Routes>
   </>
  );
}

export default App;
