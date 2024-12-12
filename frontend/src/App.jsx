
import {Routes, Route} from 'react-router-dom';
import Login from '../src/pages/Login';
import Banner from './components/Banner';
import ResetPassword from '../src/pages/ResetPassword'
import axios from 'axios';
import {Toaster} from 'react-hot-toast';
import { UserContextProvider } from '../context/userContext';
import Dashboard from './pages/Dashboard';

axios.defaults.baseURL = 'https://mern-students-registration-system.onrender.com/';
axios.defaults.withCredentials = true

function App() {
  return (
    <UserContextProvider>
    <Toaster position='bottom right' toastOptions={{duration: 2000}}/>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/Dashboard' element={<Dashboard />} />
    </Routes>
    </UserContextProvider>
  )
}

export default App
