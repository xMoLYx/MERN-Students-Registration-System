import './App.css'
import {Routes, Route} from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Login from '../src/pages/Login';
import Home from '../src/pages/Home';
import Register from '../src/pages/Register'
import axios from 'axios';
import {Toaster} from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';
import Dashboard from './pages/Dashboard';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true

function App() {
  return (
    <UserContextProvider>
    <Navbar />
    <Toaster position='bottom right' toastOptions={{duration: 2000}}/>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/Dashboard' element={<Dashboard />} />
    </Routes>
    </UserContextProvider>
  )
}

export default App
